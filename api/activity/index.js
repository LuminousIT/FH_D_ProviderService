const {
  createActivity,
  getActivities,
  getActivityByID,
  updateActivity,
} = require("../../services/activity");

const router = require("express").Router();

router.route("/").get(getActivities);
router.route("/:id").get(getActivityByID);
router.route("/").post(createActivity);
router.route("/:id").patch(updateActivity);

module.exports = router;
