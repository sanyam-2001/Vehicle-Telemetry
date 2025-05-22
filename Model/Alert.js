import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true
    },
    speedLimit: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});

export const Alert = mongoose.model('Alert', alertSchema);
