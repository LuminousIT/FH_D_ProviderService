const uuid = require("uuid");
const ScheduleDB = require("../../model/schedule");
const AdminDB = require("../../model/admin");

const createSchedule = async (request, response, next) => {
  try {
    const { shiftStart, shiftEnd, userID, id, task } = request.body;
    if (!userID) throw new Error("User Id is required");

    // check if user exist for booking
    const user = await AdminDB.findOne({ id: userID }).exec();
    if (!user) throw new Error("user does not exist");
    const schedule_id = uuid.v4();

    const created = new ScheduleDB({
      id: schedule_id,
      userID,
      workerID: userID,
      shiftStart,
      shiftEnd,
      scheduleID: schedule_id,
      task,
    });
    await created.save();
    if (!created) throw new Error("Schedule Creation Failed");
    return response.status(200).json({ status: "success", content: created });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const updateSchedule = async (request, response, next) => {
  try {
    const { shiftStart, shiftEnd, userID, id, task } = request.body;
    const updated = await ScheduleDB.updateOne(
      { id },
      { $set: { ...request.body } }
    );
    if (!updated) throw new Error("Schedule Update failed");
    return response.status(200).json({ status: "success", content: updated });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const getSchedules = async (request, response, next) => {
  try {
    const schedules = await ScheduleDB.find({}).exec();
    if (!schedules) throw new Error("Schedule does not exist");
    return response.status(200).json({ status: "success", content: schedules });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const getSchedulesByID = async (request, response, next) => {
  try {
    const { id } = request.params;

    const schedule_record = await ScheduleDB.findOne({ id }).exec();
    if (!schedule_record) throw new Error("Schedule does not exist");
    return response
      .status(200)
      .json({ status: "success", content: schedule_record });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  createSchedule,
  updateSchedule,
  getSchedulesByID,
};
