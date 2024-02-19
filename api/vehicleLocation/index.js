const {
  createVehicleLocation,
  getVehicleLocation,
  getVehicleLocationByID,
  updateVehicleLocation,
} = require("../../services/vehicleLocation");

const router = require("express").Router();

router.route("/").get(getVehicleLocation);
router.route("/:id").get(getVehicleLocationByID);
router.route("/").post(createVehicleLocation);
router.route("/:id").patch(updateVehicleLocation);

module.exports = router;
