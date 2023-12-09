const { Router } = require("express");
const Axios = require('axios');

const router = Router();
const axios = Axios.create();

router.get("/", async (req, res) => {
  const { id } = req.query;

  const response = await axios.get(
    `https://api.redgifs.com/v2/gifs/${id}`,
    {
      headers: {
        authorization: req.headers.authorization,
        'User-Agent': req.headers["user-agent"],
      }
    }
  );

  res.send(response.data.gif);
});

module.exports = router;
