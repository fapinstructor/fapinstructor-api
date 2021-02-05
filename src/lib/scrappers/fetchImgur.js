const log = require("lib/logger");
const validateFetchResponse = require("./validateFetchResponse");
const { IMGUR_API_KEY } = require("config");

const options = {
  headers: {
    Authorization: `Client-ID ${IMGUR_API_KEY}`,
  },
  cache: "force-cache",
};

async function fetchGallery(urlParts) {
  const hash = urlParts.pop();
  const urls = await fetch(
    `https://api.imgur.com/3/gallery/album/${hash}`,
    options,
  )
    .then(validateFetchResponse)
    .then(res => res.json())
    .then(({ data }) => data.images.map(image => image.link));

  return urls;
}

async function fetchAlbum(urlParts) {
  const hash = urlParts.pop();
  const urls = await fetch(
    `https://api.imgur.com/3/album/${hash}/images`,
    options,
  )
    .then(validateFetchResponse)
    .then(res => res.json())
    .then(res => {
      if (!res.data) {
        log.error(res.data);
      }
      return res;
    })
    .then(({ data }) => data.map(image => image.link));

  return urls;
}

async function fetchRedditGallery(urlParts) {
  const hash = urlParts.pop();
  const subreddit = urlParts.pop();
  const url = await fetch(
    `https://api.imgur.com/3/gallery/r/${subreddit}/${hash}`,
    options,
  )
    .then(validateFetchResponse)
    .then(res => res.json())
    .then(({ data }) => data.link);

  return url;
}

async function fetchOther(urlParts) {
  const hash = urlParts.pop();
  const url = await fetch(`https://api.imgur.com/3/image/${hash}`, options)
    .then(validateFetchResponse)
    .then(res => res.json())
    .then(({ data }) => data.link);

  return url;
}

async function fetchImgur(url) {
  // split and remove any empty elements
  const urlParts = url.split("/").filter(part => part.length > 0);
  const hasFileExtension = urlParts[urlParts.length - 1].includes(".");

  let urls = [];
  if (hasFileExtension) {
    urls.push(url);
  } else if (url.match(/\/a\//)) {
    urls = await fetchAlbum(urlParts);
  } else if (url.match(/\/r\//)) {
    urls.push(await fetchRedditGallery(urlParts));
  } else if (url.match(/\/gallery\//)) {
    urls = await fetchGallery(urlParts);
  } else {
    urls.push(await fetchOther(urlParts));
  }

  urls = urls.map(url => url.replace(".gifv", ".mp4"));

  return urls;
}

module.exports = fetchImgur;
