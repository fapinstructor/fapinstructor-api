const differenceInDays = require("date-fns/differenceInDays");
const log = require("lib/logger");
const knex = require("./connection");
const { resolveDirectLink } = require("lib/scrappers");
const { getMediaType } = require("lib/media-type");

const REDDIT_DOMAIN = "https://www.reddit.com";
const DESIRED_MINIMUM_POSTS = 100;
const UPDATE_FREQUENCY_IN_DAYS = 10;

async function scrapSubreddits(subreddits) {
  const results = await Promise.allSettled(
    subreddits.map(subreddit =>
      scrapSubreddit(subreddit).catch(error => {
        return Promise.reject({ subreddit, error });
      }),
    ),
  );

  const failedSubreddits = results.filter(
    result => result.status === "rejected",
  );

  return failedSubreddits.map(result => result.reason.subreddit);
}

async function scrapSubreddit(subreddit) {
  // Does the subreddit exist in our DB?
  const existingSubreddit = await getSubreddit(subreddit);

  let isSubredditOutdated = true;
  let subredditId;

  if (existingSubreddit) {
    const daysDelta = differenceInDays(Date.now(), existingSubreddit.updatedAt);
    isSubredditOutdated = daysDelta > UPDATE_FREQUENCY_IN_DAYS;
    subredditId = existingSubreddit.id;
  } else {
    await validateSubreddit(subreddit);
    subredditId = await createSubreddit(subreddit);
  }

  if (!isSubredditOutdated) {
    return;
  }

  const links = await fetchPostsAfter({ subreddit });

  const resolvedLinks = await resolveLinks(links);
  if (resolvedLinks.length === 0) {
    return;
  }

  await knex.transaction(async trx => {
    await updateSubreddit(trx, { subredditId });
    await deleteMediaContent(trx, { subredditId });
    await insertMediaContent(trx, { subredditId, links: resolvedLinks });
  });
}

async function getLinks({ subreddits, mediaTypes, limit }) {
  let links = await knex("subreddit_media_content")
    .select({
      sourceLink: "media_content.sourceLink",
      directLink: "media_content.directLink",
      mediaType: "media_type.name",
    })
    .join(
      "media_content",
      "subreddit_media_content.media_content_id",
      "media_content.id",
    )
    .join("subreddit", "subreddit_media_content.subreddit_id", "subreddit.id")
    .join("media_type", "media_content.mediaTypeId", "media_type.id")
    .modify(withMediaTypeFilter, mediaTypes)
    .whereIn("subreddit.name", subreddits)
    .orderByRaw("RANDOM()")
    .limit(limit);

  links = links.map(link => ({
    ...link,
    sourceLink: `${REDDIT_DOMAIN}${link.sourceLink}`,
  }));

  return links;
}

async function insertMediaContent(trx, { subredditId, links }) {
  const mediaContent = await trx("media_content")
    .insert(links)
    .returning(["id"]);

  const subredditMediaContent = mediaContent.map(({ id }) => ({
    media_content_id: id,
    subreddit_id: subredditId,
  }));

  await trx("subreddit_media_content").insert(subredditMediaContent);
}

async function deleteMediaContent(trx, { subredditId }) {
  const mediaContent = await trx("subreddit_media_content")
    .select({ id: "media_content_id" })
    .where({ subreddit_id: subredditId });

  await trx("media_content")
    .whereIn(
      "id",
      mediaContent.map(({ id }) => id),
    )
    .del();
}

async function createSubreddit(subreddit) {
  const result = await knex("subreddit")
    .insert({
      name: subreddit,
    })
    .returning(["id"]);

  return result[0].id;
}

async function updateSubreddit(trx, { subredditId }) {
  await trx("subreddit")
    .update({
      updatedAt: knex.fn.now(),
    })
    .where("id", subredditId);
}

function withMediaTypeFilter(query, mediaTypes) {
  if (mediaTypes && mediaTypes.length > 0) {
    query.whereIn("media_type_id", mediaTypes);
  }
}

async function resolveLinks(links) {
  const unresolvedLinks = [];

  // Attempt to resolve source links to direct links
  const resolvedLinks = (
    await Promise.all(
      links.map(
        async link =>
          await resolveDirectLink(link.direct_link)
            .then(
              directLinks =>
                // create DB objects
                directLinks &&
                directLinks.map(direct_link => ({
                  ...link,
                  direct_link,
                  media_type_id: getMediaType(direct_link),
                })),
            )
            .catch(error => {
              // Don't log 400 errors. This usually happens when the file is removed from targeted site.
              const is400SeriesCode = /4[0-9]{2}/.test(error.response.status);
              if (!is400SeriesCode) {
                unresolvedLinks.push({ link, error: error.toString() });
              }
            }),
      ),
    )
  )
    .flat() // a source link could return more than one direct link, flatten
    .filter(v => v); // remove unresolvable links

  // consolidate all failed links into a single log
  if (unresolvedLinks.length > 0) {
    log.warn(unresolvedLinks);
  }

  return resolvedLinks;
}

async function getSubreddit(subreddit) {
  const existingSubreddit = await knex("subreddit")
    .select(["id", "updated_at"])
    .where({
      name: subreddit,
    })
    .first();

  return existingSubreddit;
}

async function fetchPostsAfter({ subreddit, after = null }) {
  let links = [];

  do {
    const posts = await fetchPosts({ subreddit, after });
    after = posts.after;
    links = links.concat(posts.links);
  } while (after && links.length < DESIRED_MINIMUM_POSTS);

  return links;
}

async function validateSubreddit(subreddit) {
  const res = await fetch(`${REDDIT_DOMAIN}/r/${subreddit}`);

  if (res.status !== 200) {
    throw new Error(
      `Failed to fetch the subreddit ${subreddit} with a status code of ${res.status}`,
    );
  }
}

function parseGallery(media_metadata) {
  const gallery = Object.values(media_metadata).filter(
    ({ status }) => status === "valid",
  );

  const galleryLinks = gallery
    .map(({ e: imageType, s: image }) => {
      if (imageType === "Image") {
        // Get the image and remove the amp; occurrences within it
        return (
          image &&
          image.u &&
          image.u.replace(/amp;/g, "").replace("preview", "i")
        );
      }
    })
    // Remove any undefined entries.
    .filter(link => link);

  return galleryLinks;
}

async function fetchPosts({ subreddit, after }) {
  const res = await fetch(
    `${REDDIT_DOMAIN}/r/${subreddit}/hot/.json?limit=100&after=${after}`,
  )
    .then(async res => {
      try {
        JSON.parse(res);
      } catch {
        const text = await res.text();
        log.error("Expected JSON but received text", text);
      }
      return res;
    })
    .then(res => res.json());

  if (res.error) {
    throw new Error(res);
  }

  after = res.data.after;

  const filteredPosts = res.data.children
    .map(({ data }) => data)
    .filter(({ is_self }) => !is_self)
    .filter(({ stickied }) => !stickied)
    // Remove poorly scored posts.
    .filter(({ score }) => score >= 0);

  const links = filteredPosts.map(
    ({ permalink, url, media, is_gallery, media_metadata }) => {
      if (is_gallery && media_metadata) {
        const galleryLinks = parseGallery(media_metadata);

        return galleryLinks.map(galleryLink => ({
          source_link: permalink,
          direct_link: galleryLink,
        }));
      } else {
        const mediaKeys = media ? Object.keys(media) : [];

        return {
          source_link: permalink,
          direct_link: mediaKeys.includes("reddit_video")
            ? media.reddit_video.fallback_url
            : url,
        };
      }
    },
  );

  return { links: links.flat(), after };
}

module.exports = { scrapSubreddits, getLinks };
