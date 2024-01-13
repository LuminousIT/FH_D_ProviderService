const { model, Schema } = require("mongoose");

const AdminSchema = new Schema({
  id: {
    type: String,
    // required: true,
    // default: 0,
  },
  email: {
    type: String,
    required: [true, "Email address cannot be empty"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "First name cannot be empty"],
  },
  lastName: {
    type: String,
    required: [true, "Last name cannot be empty"],
  },
  password: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    default: "Europe",
  },
  role: {
    type: String,
    // required: true,
    default: "interviewer",
  },
  activated: {
    type: Boolean,
    default: true,
  },
  deactivationDate: {
    type: Date,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    default: "en",
  },
  companyOwner: {
    type: Boolean,
    default: false,
  },
  created_on: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  updated_on: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

model("Admin", AdminSchema);

module.exports = model("Admin", AdminSchema);
