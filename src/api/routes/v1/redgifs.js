const knex = require("../../../lib/db/connection");
const dotenv = require("dotenv");
dotenv.config();

let tempToken;

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

async function fetchAuthToken() {
  const response = await fetch("https://api.redgifs.com/v2/oauth/client", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.REDGIFS_CLIENT_ID,
      client_secret: process.env.REDGIFS_CLIENT_SECRET,
    }),
  });
  const data = await response.json();
  return data.token;
}

function isTokenExpired(token) {
  const decoded = parseJwt(token);
  if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
    return true;
  }
  return false;
}

async function setAuthToken(token) {
  const result = await knex("redGifsToken").insert({
    name: "redGifsToken",
    token: token,
  });
  return result;
}

async function getAuthToken() {
  const result = await knex("redGifsToken")
    .select("token")
    .where({
      name: "redGifsToken",
    })
    .first();
  if (result && result.token) {
    tempToken = result.token;
  }
  return tempToken;
}

async function instance(url) {
  let token = await getAuthToken();
  if (!token || isTokenExpired(token)) {
    token = await fetchAuthToken();
    setAuthToken(token);
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, { headers });
  return res.json();
}

async function searchRedGifs(id) {
  const response = await instance(`https://api.redgifs.com/v2/gifs/${id}`);
  const mediaLink = {
    mediaType: "VIDEO",
    sourceLink: `https://www.redgifs.com/watch/${response.gif.id}`,
    directLink: response.gif.urls.hd,
  };
  return mediaLink;
}

async function resolveRedgifsLinks(redGifLinks) {
  const redgifsSignedLinksPromise = await Promise.allSettled(
    redGifLinks.map(link => {
      const redGifID = link.directLink.split("/")[3].split("-")[0];
      return searchRedGifs(redGifID.toLowerCase());
    }),
  );

  const redgifsSignedLinks = redgifsSignedLinksPromise
    .filter(linkPromise => linkPromise.status === "fulfilled")
    .map(link => link.value);

  return redgifsSignedLinks;
}

module.exports = {
  resolveRedgifsLinks,
};
