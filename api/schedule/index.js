const {
  createSchedule,
  getSchedules,
  getSchedulesByID,
  updateSchedule,
} = require("../../services/schedule");

const router = require("express").Router();

router.route("/").get(getSchedules);
router.route("/:id").get(getSchedulesByID);
router.route("/").post(createSchedule);
router.route("/:id").patch(updateSchedule);

module.exports = router;
