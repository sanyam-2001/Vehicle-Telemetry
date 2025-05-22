class DataProductionService {
    constructor(vehicleId, minSpeed = 60, maxSpeed = 200) {
        this.vehicleId = vehicleId;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
    }

    publishTelemetry = async () => {
        try {
            const response = await fetch('http://localhost:5000/telemetry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vehicleId: this.vehicleId,
                    timestamp: Date.now(),
                    location: {
                        lat: Math.random() * 180 - 90,
                        lon: Math.random() * 360 - 180
                    },
                    speedKph: Math.floor(Math.random() * (this.maxSpeed - this.minSpeed)) + this.minSpeed
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Published Telemetry for ${this.vehicleId}`)
            return data;
        } catch (error) {
            console.error('Error Publishing');
        }
    }

    startLoop = async (timeout = 5000) => {
        setInterval(() => {
            this.publishTelemetry()
        }, timeout);
    }
};


const dataProductionServiceForV1 = new DataProductionService('V-1', 80, 90).startLoop();
const dataProductionServiceForV2 = new DataProductionService('V-2', 110, 150).startLoop(4000);
const dataProductionServiceForV3 = new DataProductionService('V-3', 90, 110).startLoop(6000);
const dataProductionServiceForV4 = new DataProductionService('V-4', 200, 300).startLoop(1000);

