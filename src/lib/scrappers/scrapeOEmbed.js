/* eslint-disable  */
/**
 * First request will return null for before since there are no newer posts.
 * However, we need a before for the next days request,
 * so we use the first post name instead
 * */
async function scrapeOEmbed(post) {
  const { permalink, url, is_reddit_media_domain, media } = post;

  let directLink;
  if (is_reddit_media_domain) {
    directLink = url;
  } else {
    // Embeded scrapper
    let src;
    if (media) {
      const decode = entities.decode(media.oembed.html);
      const root = HTMLParser.parse(decode);
      src = root.firstChild.getAttribute("src");
    } else {
      src = url;
    }

    try {
      const embededPlayer = await fetch(src).then(res => res.text());
      const embededDom = HTMLParser.parse(embededPlayer);
      const videoElement = embededDom.querySelector("video");
      const sourceElement = videoElement.querySelector("source");
      const sourceSrc = sourceElement.getAttribute("src");

      directLink = sourceSrc;
    } catch (err) {
      log.error(err);
    }
  }
}

module.exports = { scrapeOEmbed };
