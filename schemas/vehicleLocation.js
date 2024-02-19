const Joi = require("joi");

module.exports.VehicleLocationSchema = Joi.object({
  id: Joi.string(),
  vehicleID: Joi.string().required(),
  userID: Joi.string(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});
