const uuid = require("uuid");
const ActivityDB = require("../../model/activity");
const jwt = require("jsonwebtoken");
const { decryptJwtAuthToken } = require("../../util");
const { ActivitySchema } = require("../../schemas/activity");

const createActivity = async (request, response, next) => {
  try {
    const { token } = request;
    const { name, billable, plannedQuota, tags } = request.body;
    const { error } = ActivitySchema.validate(request.body);
    if (error) throw new Error(error.message);

    const activity_id = uuid.v4();
    const created = new ActivityDB({
      id: activity_id,
      name,
      billable,
      plannedQuota,
      tags,
    });
    await created.save();
    if (!created) throw new Error("Activity Creation Failed");
    return response.status(200).json({ status: "success", content: created });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const updateActivity = async (request, response, next) => {
  try {
    const { error } = ActivitySchema.validate(request.body);
    if (error) throw new Error(error.message);
    const param = request.params.id;

    if (!param) throw new Error("Activity id missing from param");

    const existingActivity = await ActivityDB.findOne({ id: param }).exec();
    if (!existingActivity) throw new Error("Activity does not exist.");

    const updated = await ActivityDB.updateOne(
      { id: param },
      { $set: { ...request.body } }
    );
    if (!updated) throw new Error("Activity Update failed");
    return response.status(200).json({ status: "success", content: updated });
  } catch (error) {
    console.log(error.message);
    return response.status(400).json({ status: "failed", msg: error.message });
  }
};

const getActivities = async (request, response, next) => {
  try {
    const { token } = request;
    // decode token and get id from token
    const verified_token = await jwt.verify(token, process.env.SECRET);

    const { id } = verified_token;

    const activities = await ActivityDB.find({}).exec();

    if (!activities) throw new Error("Activity does not exist");
    return response
      .status(200)
      .json({ status: "success", content: activities });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const getActivityByID = async (request, response, next) => {
  try {
    const { id } = request.params;

    const activity_record = await ActivityDB.findOne({ id }).exec();
    if (!activity_record) throw new Error("Activity does not exist");
    return response
      .status(200)
      .json({ status: "success", content: activity_record });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

module.exports = {
  createActivity,
  updateActivity,
  getActivities,
  getActivityByID,
};
