const { stripQueryString } = require("lib/util/regex");
const fetchImgur = require("./fetchImgur");
const { fetchGfycat, GfycatDomain } = require("./fetchGfycat");

const fetchers = {
  "imgur.com": fetchImgur,
  "gfycat.com": fetchGfycat(GfycatDomain.gfycat),
  "redgifs.com": url => Promise.resolve(url),
  "redd.it": url => Promise.resolve(url),
};

function findFetcher(src) {
  const fetcher = Object.keys(fetchers).find(key => src.includes(key));

  if (!fetcher) {
    // only enable this when we want to see what sites we should support next
    // log.error("Unsupported Site:", src);
  }

  return fetcher;
}

/**
 * Will attempt to get the direct media link.
 * If it cannot it will return undefined.
 * @param {*} src
 */
async function resolveDirectLink(src) {
  const fetcher = findFetcher(src);

  if (!fetcher) {
    return;
  }

  const resolvedLink = await fetchers[fetcher](src);
  if (!Array.isArray(resolvedLink)) {
    return [stripQueryString(resolvedLink)];
  }
  return resolvedLink.map(stripQueryString);
}

module.exports = {
  resolveDirectLink,
};
