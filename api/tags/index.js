const {
  createTags,
  getTags,
  getTagsByID,
  updateTags,
} = require("../../services/tags");

const router = require("express").Router();

router.route("/").get(getTags);
router.route("/:id").get(getTagsByID);
router.route("/").post(createTags);
router.route("/:id").patch(updateTags);

module.exports = router;
