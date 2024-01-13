const { registerAdmin, login, getAdmins } = require("../../services/admin");

const router = require("express").Router();
router.route("/register").post(registerAdmin);
router.route("/login").post(login);
router.route("/").get(getAdmins);

module.exports = router;
