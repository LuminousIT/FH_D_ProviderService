const { getUser } = require("../../services/admin");

const router = require("express").Router();

router.route("/").get(getUser);

module.exports = router;
