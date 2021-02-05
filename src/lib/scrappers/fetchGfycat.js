const validateFetchResponse = require("./validateFetchResponse");

function fetchGfycat(url) {
  let id = url.split("/").pop();
  if (id.includes("-")) {
    id = id.split("-")[0];
  }
  const fetchUrl = `https://api.gfycat.com/v1/gfycats/${id}`;
  return fetch(fetchUrl)
    .then(validateFetchResponse)
    .then(res => res.json())
    .then(({ gfyItem }) => gfyItem.webmUrl);
}

module.exports = fetchGfycat;
