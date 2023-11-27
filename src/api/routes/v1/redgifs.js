const { Router } = require("express");
const Axios = require('axios');
const path = require('path');

const router = Router();
const axios = Axios.create();

router.get("/", async (req, res) => {
  const { id, token } = req.query;
  console.log("redgifs", id);
  const response = await axios.get(
    `https://api.redgifs.com/v2/gifs/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      }
    }
  );
  console.log("response", response.data.gif);
  const imgResponse = await axios.get(response.data.gif.urls.hd, {
    responseType: "stream",
    headers: {
      authorization: `Bearer ${token}`,
    }
  });
  console.log("asdf");
  const filename = path.basename(response.data.gif.urls.hd);
  console.log(imgResponse);

  res.setHeader("content-disposition", `attachment; filename="${filename}"`);
  // pipe the data to the res object
  imgResponse.data.pipe(res);
  // res.send('oop');
});

module.exports = router;
