const { Router } = require("express");
const auth = require("../../middleware/auth");

const router = Router();

router.use("/reddit", require("./reddit"));
router.use("/tags", require("./tags"));
router.use("/games", require("./games").router);
router.use("/users", auth(), require("./users"));

module.exports = router;
