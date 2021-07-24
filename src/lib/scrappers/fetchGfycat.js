const validateFetchResponse = require("./validateFetchResponse");

const GfycatDomain = {
  gfycat: "gfycat",
  redgif: "redgifs",
};

const fetchGfycat = domain => url => {
  let id = url.split("/").pop();
  if (id.includes("-")) {
    id = id.split("-")[0];
  }
  return fetch(`https://api.${domain}.com/v1/gfycats/${id}`)
    .then(validateFetchResponse)
    .then(res => res.json())
    .then(
      ({ gfyItem }) => gfyItem.webmUrl || gfyItem.mp4Url || gfyItem.mobileUrl,
    );
};

module.exports = { fetchGfycat, GfycatDomain };
