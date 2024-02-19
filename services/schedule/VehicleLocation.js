const express = require('express');
const router = express.Router();

const TelematicsService = require('./TelematicsService');

router.get('/vehicle/:vehicleID/location', async (req, res) => {
    const vehicleID = req.params.vehicleID;

    if (!vehicleID) {
        return res.status(400).send('Bad Request: vehicleID parameter is missing.');
    }

    try {
        const locationData = await TelematicsService.getVehicleLocation(vehicleID);

        if (!locationData) {
            return res.status(404).send('Not Found: Vehicle ID does not exist or location data is unavailable.');
        }

        res.json({
            vehicleID: vehicleID,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            timestamp: locationData.timestamp,
        });
    } catch (error) {
        console.error(`Error retrieving vehicle location: ${error}`);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
