import { VehicleTelemetry } from "../Model/VehicleTelemetry.js";
import { Alert } from "../Model/Alert.js";

export async function getVehiclePerformanceMetrics(vehicleId) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    const averageSpeedPipeline = [
        {
            $match: {
                vehicleId: vehicleId,
                timestamp: {
                    $gte: twentyFourHoursAgo,
                    $lte: now
                }
            }
        },
        {
            $group: {
                _id: null,
                averageSpeedKph: { $avg: "$speedKph" }
            }
        },
        {
            $project: {
                _id: 0,
                averageSpeedKph: 1
            }
        }
    ];

    const numberOfAlertsPipeline = [
        {
            $match: {
                vehicleId: vehicleId,
                timestamp: {
                    $gte: twentyFourHoursAgo,
                    $lte: now
                }
            }
        },
        {
            $count: "numberOfAlerts"
        }
    ];

    try {
        const [avgSpeedResult, alertsCountResult] = await Promise.all([
            VehicleTelemetry.aggregate(averageSpeedPipeline).exec(),
            Alert.aggregate(numberOfAlertsPipeline).exec()
        ]);

        const averageSpeedKph = avgSpeedResult.length > 0 ? avgSpeedResult[0].averageSpeedKph : null;
        const numberOfAlerts = alertsCountResult.length > 0 ? alertsCountResult[0].numberOfAlerts : 0;

        return {
            averageSpeedKph: averageSpeedKph,
            numberOfAlerts: numberOfAlerts
        };

    } catch (error) {
        console.error("Error fetching vehicle performance metrics:", error);
        throw error;
    }
}