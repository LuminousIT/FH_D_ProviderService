const uuid = require("uuid");
const ScheduleDB = require("../../model/schedule");
const AdminDB = require("../../model/admin");
const jwt = require("jsonwebtoken");
const { decryptJwtAuthToken } = require("../../util");
const { ScheduleSchema } = require("../../schemas/schedule");
// const vehicleLocationRouter = require("../services/schedule/VehicleLocation");

const createSchedule = async (request, response, next) => {
  try {
    const { token } = request;
    const { shiftStart, shiftEnd, userID, id, task, status, description } =
      request.body;
    const { error } = ScheduleSchema.validate(request.body);
    if (error) throw new Error(error.message);
    const userInfo = await decryptJwtAuthToken(token);

    // check if user exist
    if (userID) {
      const user = await AdminDB.findOne({ id: userID }).exec();
      if (!user) throw new Error("User does not exist.");
    }

    const { id: verifiedUserId } = userInfo;
    const schedule_id = uuid.v4();
    const created = new ScheduleDB({
      id: schedule_id,
      userID: verifiedUserId,
      workerID: verifiedUserId,
      shiftStart,
      shiftEnd,
      scheduleID: schedule_id,
      task,
      status,
      description,
    });
    await created.save();
    if (!created) throw new Error("Schedule Creation Failed");
    return response.status(200).json({ status: "success", content: created });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const updateSchedule = async (request, response, next) => {
  try {
    const { error } = ScheduleSchema.validate(request.body);
    if (error) throw new Error(error.message);
    const param = request.params.id;

    if (!param) throw new Error("Schedule id missing from param");

    const existingSchedule = await ScheduleDB.findOne({ id: param }).exec();
    if (!existingSchedule) throw new Error("Schedule does not exist.");

    const updated = await ScheduleDB.updateOne(
      { id: param },
      { $set: { ...request.body } }
    );
    if (!updated) throw new Error("Schedule Update failed");
    return response.status(200).json({ status: "success", content: updated });
  } catch (error) {
    console.log(error.message);
    return response.status(400).json({ status: "failed", msg: error.message });
  }
};

const getSchedules = async (request, response, next) => {
  try {
    const { token } = request;
    // decode token and get id from token
    const verified_token = await jwt.verify(token, process.env.SECRET);

    const { id } = verified_token;

    const schedules = await ScheduleDB.find({ userID: id }).exec();

    if (!schedules) throw new Error("Schedule does not exist");
    return response.status(200).json({ status: "success", content: schedules });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
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

const deleteSchedulesByID = async (request, response, next) => {
  try {
    const { id } = request.params;
    if (!id) throw new Error("Schedule id missing from param");

    const schedule_record = await ScheduleDB.deleteOne({ id }).exec();
    console.log(schedule_record);
    if (!schedule_record) throw new Error("Schedule does not exist");
    return response
      .status(200)
      .json({ status: "success", content: schedule_record });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const deleteSchedules = async (request, response, next) => {
  try {
    const { ids } = request.body;
    if (!ids) throw new Error("Schedule id missing from param");
    if (!Array.isArray(ids)) throw new Error("ids must be an array");
    const schedule_record = await ScheduleDB.deleteMany({
      id: { $in: ids },
    }).exec();
    console.log(schedule_record);
    if (!schedule_record) throw new Error("Schedules does not exist");
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
  deleteSchedulesByID,
  deleteSchedules,
};
