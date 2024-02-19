const { model, Schema } = require("mongoose");

const VehicleLocationSchema = new Schema({
  id: {
    type: String,
  },
  vehicleID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

model("VehicleLocation", VehicleLocationSchema);

module.exports = model("VehicleLocation", VehicleLocationSchema);
