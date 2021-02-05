const { Router } = require("express");

const router = Router();

router.use("/health", require("./health"));
router.use("/robots.txt", require("./robots"));
router.use("/v1", require("./v1"));

module.exports = router;
