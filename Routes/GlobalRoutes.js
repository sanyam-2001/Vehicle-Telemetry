import express from "express";
import { AlertService } from "../Services/AlertService.js";
import { TelemetryProcessingService } from "../Services/TelemetryProcessingService.js";

const router = express.Router();
const alertService = new AlertService();
const telemetryProcessingService = new TelemetryProcessingService(alertService);

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

export default router;