const { Router } = require("express");
const tagDb = require("lib/db/tag");

const router = Router();

router.get("/", async (req, res) => {
  const tags = await tagDb.findAll();

  res.send(tags);
});

module.exports = router;
