const {
  createSchedule,
  getSchedules,
  getSchedulesByID,
  updateSchedule,
  deleteSchedulesByID,
  deleteSchedules,
} = require("../../services/schedule");

const router = require("express").Router();

router.route("/").get(getSchedules);
router.route("/:id").get(getSchedulesByID);
router.route("/").post(createSchedule);
router.route("/:id").patch(updateSchedule);
router.route("/:id").delete(deleteSchedulesByID);
router.route("/").delete(deleteSchedules);

module.exports = router;
