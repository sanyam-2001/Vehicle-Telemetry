import express from "express";
import { AlertService } from "../Services/AlertService.js";
import { TelemetryProcessingService } from "../Services/TelemetryProcessingService.js";
import { VehicleConfig } from "../Model/VehicleConfig.js";
import { TelemetryLocalCache } from "../Services/TelemetryLocalCache.js";
import { RateLimitingService } from "../Services/RateLimitingService.js";
import { getVehiclePerformanceMetrics } from "../Utils/StatUtils.js";

const router = express.Router();
const alertService = new AlertService();
const telemetryLocalCache = new TelemetryLocalCache();
const telemetryProcessingService = new TelemetryProcessingService(alertService, telemetryLocalCache);
const rateLimitingService = new RateLimitingService();

// Rate limiting middleware for telemetry endpoint
const rateLimitMiddleware = (req, res, next) => {
    const vehicleId = req.body.vehicleId;

    if (!vehicleId) {
        return res.status(400).json({ error: 'vehicleId is required' });
    }

    if (rateLimitingService.isRateLimited(vehicleId)) {
        return res.status(429).json({ error: 'Too many requests. Please wait 2 seconds between requests.' });
    }

    next();
};

router.post('/telemetry', rateLimitMiddleware, (req, res) => {
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

router.get('/vehicle/stats/:vehicleId', async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;
        const response = await getVehiclePerformanceMetrics(vehicleId);
        res.json(response);
    } catch (err) {
        res.send(500);
    }
});

export default router;