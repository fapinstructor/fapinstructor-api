const { Router } = require("express");
const Axios = require('axios');
const path = require('path');

const router = Router();
const axios = Axios.create();

router.get("/", async (req, res) => {
  const { id, token } = req.query;

  const response = await axios.get(
    `https://api.redgifs.com/v2/gifs/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      }
    }
  );

  const imgResponse = await axios.get(response.data.gif.urls.hd, {
    responseType: "stream",
    headers: {
      authorization: `Bearer ${token}`,
    }
  });
  const filename = path.basename(response.data.gif.urls.hd);

  res.setHeader("content-disposition", `attachment; filename="${filename}"`);
  // pipe the data to the res object
  imgResponse.data.pipe(res);
});

module.exports = router;
