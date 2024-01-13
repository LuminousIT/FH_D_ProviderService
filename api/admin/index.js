const {
  registerAdmin,
  login,
  getAdmins,
  getRFID,
  getHomepage,
} = require("../../services/admin");

const router = require("express").Router();
router.route("/register").post(registerAdmin);
router.route("/login").post(login);
router.route("/").get(getAdmins);
// router.route("/rfid").post(getRFID);

module.exports = router;
