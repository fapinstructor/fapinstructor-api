const { Router } = require("express");

const router = new Router();

router.get("/", function(req, res) {
  res.header("Content-Type", "text/plain");
  res.send("User-agent: *\r\nDisallow: /");
});

module.exports = router;
