export class TelemetryLocalCache {

    constructor() {
        this.cache = {};
    }

    processValue = (telemetry, speedLimit) => {
        const vehicleId = telemetry.vehicleId;
        if (telemetry.speedKph > speedLimit) {
            if (!this.cache[vehicleId]) {
                this.cache[vehicleId] = Date.now();
                return false;
            }
            if (this.#timeDiff(telemetry.timestamp, this.cache[vehicleId]) > 10000) {
                return true;
            }
            return false;
        }
        this.cache[vehicleId] = null;
        return false;
    }

    #timeDiff = (time1, time2) => {
        return Math.abs(new Date(time1).getTime() - new Date(time2).getTime());
    }

}
