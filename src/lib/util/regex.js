const isAlpha = /^[a-zA-Z ]+$/g;
const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * A subreddit is valid when the following conditions match:
 * - no spaces
 * - 3-21 char long
 * - underscore only special char allowed (cannot be first char)
 */
const validSubreddit = /^[a-z0-9][a-z0-9_]{2,20}$/i;

const stripQueryString = url => {
  const result = url.match(/^[^?]+/g);
  return result.length >= 1 ? result[0] : url;
};

module.exports = {
  isAlpha,
  isUuid,
  validSubreddit,
  stripQueryString,
};
