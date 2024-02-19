const uuid = require("uuid");
const VehicleLocationDB = require("../../model/vehicleLocation");
const AdminDB = require("../../model/admin");
const jwt = require("jsonwebtoken");
const { decryptJwtAuthToken } = require("../../util");
const { VehicleLocationSchema } = require("../../schemas/vehicleLocation");

const createVehicleLocation = async (request, response, next) => {
  try {
    const { token } = request;
    const { latitude, longitude } = request.body;
    console.log("reques", request.body);
    const { error } = VehicleLocationSchema.validate(request.body);
    if (error) throw new Error(error.message);
    const userInfo = await decryptJwtAuthToken(token);

    const { id: verifiedUserId } = userInfo;
    const vehicleLocationEntryID = uuid.v4();
    const created = new VehicleLocationDB({
      id: vehicleLocationEntryID,
      userID: verifiedUserId,
      latitude,
      longitude,
      vehicleID: request?.body?.vehicleID || vehicleLocationEntryID,
    });
    await created.save();
    if (!created) throw new Error("Vehicle Location Creation Failed");
    return response.status(200).json({ status: "success", content: created });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const updateVehicleLocation = async (request, response, next) => {
  try {
    const { error } = VehicleLocationSchema.validate(request.body);
    if (error) throw new Error(error.message);
    const param = request.params.id;

    if (!param) throw new Error("Vehicle Location id missing from param");

    const existingVehicleLocation = await VehicleLocationDB.findOne({
      id: param,
    }).exec();
    if (!existingVehicleLocation)
      throw new Error("Vehicle Loc data does not exist.");

    const updated = await VehicleLocationDB.updateOne(
      { id: param },
      { $set: { ...request.body } }
    );
    if (!updated) throw new Error("VehicleLocation Update failed");
    return response.status(200).json({ status: "success", content: updated });
  } catch (error) {
    console.log(error.message);
    return response.status(400).json({ status: "failed", msg: error.message });
  }
};

const getVehicleLocation = async (request, response, next) => {
  try {
    const { token } = request;
    // decode token and get id from token
    const verified_token = await jwt.verify(token, process.env.SECRET);

    const { id } = verified_token;

    const vehicleLocations = await VehicleLocationDB.find({
      userID: id,
    }).exec();

    if (!vehicleLocations) throw new Error("Vehicle Locations does not exist");
    return response
      .status(200)
      .json({ status: "success", content: vehicleLocations });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const getVehicleLocationByID = async (request, response, next) => {
  try {
    const { id } = request.params;

    const vehicle_location_record = await VehicleLocationDB.findOne({
      id,
    }).exec();
    if (!vehicle_location_record)
      throw new Error("Vehicle Location does not exist");
    return response
      .status(200)
      .json({ status: "success", content: vehicle_location_record });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

module.exports = {
  createVehicleLocation,
  getVehicleLocation,
  getVehicleLocationByID,
  updateVehicleLocation,
};
