const Joi = require("joi");

module.exports.ScheduleSchema = Joi.object({
  id: Joi.string(),
  workerID: Joi.string(),
  date: Joi.string(),
  shiftStart: Joi.date().required(),
  shiftEnd: Joi.date().required(),
  task: Joi.string().required(),
  scheduleID: Joi.string(),
  userID: Joi.string().trim(),
  status: Joi.number(),
  description: Joi.string(),
});
