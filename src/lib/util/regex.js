const isAlpha = /^[a-zA-Z ]+$/g;

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
  validSubreddit,
  stripQueryString,
};
