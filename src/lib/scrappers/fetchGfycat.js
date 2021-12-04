const Axios = require("axios");

const axios = Axios.create();

axios.interceptors.response.use(response => {
  return response.data;
});

const GfycatDomain = {
  gfycat: "gfycat",
  redgif: "redgifs",
};

const fetchGfycat = domain => url => {
  let id = url.split("/").pop();
  if (id.includes("-")) {
    id = id.split("-")[0];
  }

  return axios
    .get(`https://api.${domain}.com/v1/gfycats/${id}`)
    .then(
      ({ gfyItem }) => gfyItem.webmUrl || gfyItem.mp4Url || gfyItem.mobileUrl,
    );
};

module.exports = { fetchGfycat, GfycatDomain };
