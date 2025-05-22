import express from "express";
import { AlertService } from "../Services/AlertService.js";
import { TelemetryProcessingService } from "../Services/TelemetryProcessingService.js";
import { VehicleConfig } from "../Model/VehicleConfig.js";
import { TelemetryLocalCache } from "../Services/TelemetryLocalCache.js";

const router = express.Router();
const alertService = new AlertService();
const telemetryLocalCache = new TelemetryLocalCache();
const telemetryProcessingService = new TelemetryProcessingService(alertService, telemetryLocalCache);
router.post('/telemetry', (req, res) => {
    const body = req.body;
    telemetryProcessingService.processIncomingTelemetry(body);
    res.json({ success: true });
});

router.get('/alerts/:vehicleId', async (req, res) => {
    const vehicleId = req.params.vehicleId;
    const response = await alertService.getAlerts(vehicleId);
    res.json(response)
});

router.get('/vehicles/settings/:vehicleId/:newSpeed', async (req, res) => {
    const vehicleId = req.params.vehicleId;
    const newSpeed = req.params.newSpeed;
    const response = await VehicleConfig.findOneAndUpdate({ vehicleId }, { speedLimit: newSpeed }, { new: true, upsert: true });
    res.json(response);
});

export default router;