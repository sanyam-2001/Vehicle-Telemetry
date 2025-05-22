import { Alert } from "../Model/Alert.js";

export class AlertService {

    generateAlert = async (vehicleId, speedLimit) => {
        const newAlert = new Alert({
            vehicleId,
            timestamp: Date.now(),
            speedLimit
        });

        await newAlert.save();
    }

    getAlerts = async (vehicleId) => {
        return await Alert.find({ vehicleId });
    }
}