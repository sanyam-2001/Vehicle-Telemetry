class RateLimitingService {
    constructor() {
        this.requestTimestamps = new Map();
        this.WINDOW_MS = 2000; // 2 seconds in milliseconds
    }

    isRateLimited(vehicleId) {
        const now = Date.now();
        const lastRequestTime = this.requestTimestamps.get(vehicleId);

        if (!lastRequestTime) {
            this.requestTimestamps.set(vehicleId, now);
            return false;
        }

        if (now - lastRequestTime < this.WINDOW_MS) {
            console.error(`Rejected ${vehicleId} telemetry as Rate Limit Exceeded`)
            return true;
        }

        this.requestTimestamps.set(vehicleId, now);
        return false;
    }
}

export { RateLimitingService };
