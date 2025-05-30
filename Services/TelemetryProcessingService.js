import { VehicleConfig } from "../Model/VehicleConfig.js";
import { VehicleTelemetry } from "../Model/VehicleTelemetry.js";
import { TelemetryLocalCache } from "./TelemetryLocalCache.js";
export class TelemetryProcessingService {
    constructor(alertService, telemetryLocalCache) {
        this.alertService = alertService;
        // Holds the first value of exceeded speed with its timestamp
        // If we encounter the same vehicleId again, we check if the time difference is greater than 30 seconds
        // If it is, we generate an alert
        // If it is not, nullify the key
        this.localCache = telemetryLocalCache;
        this.defaultSpeedLimit = 100;
    }

    processIncomingTelemetry = async (telemetry) => {
        const newTelemetry = new VehicleTelemetry(telemetry);
        const vehicleId = telemetry.vehicleId;
        console.log(`New Telemetry Data From: ${vehicleId}`);
        const existingVehicleConfig = await VehicleConfig.findOne({ vehicleId });
        if (!existingVehicleConfig) {
            await new VehicleConfig({ vehicleId, speedLimit: this.defaultSpeedLimit }).save();
        }
        const speedLimit = !existingVehicleConfig ? this.defaultSpeedLimit : existingVehicleConfig.speedLimit;
        await newTelemetry.save();
        const processingResult = this.localCache.processValue(newTelemetry, speedLimit);
        if (processingResult) {
            console.log(`Generating Alert for: ${vehicleId} at Speed Limit: ${speedLimit}`);
            await this.alertService.generateAlert(vehicleId, speedLimit);
        }
    }
}