const { model, Schema } = require("mongoose");

const ScheduleSchema = new Schema({
  id: {
    type: String,
  },
  workerID: {
    type: String,
    //     required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date(),
    //     required: true,
  },
  shiftStart: {
    type: String,
    required: true,
  },
  shiftEnd: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  status: {
    type: Number,
    // required: true,
  },
  scheduleID: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

model("Schedule", ScheduleSchema);

module.exports = model("Schedule", ScheduleSchema);
