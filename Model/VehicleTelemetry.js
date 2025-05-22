import mongoose from "mongoose";

const vehicleTelemetrySchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lon: {
            type: Number,
            required: true
        }
    },
    speedKph: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

export const VehicleTelemetry = mongoose.model('VehicleTelemetry', vehicleTelemetrySchema);
