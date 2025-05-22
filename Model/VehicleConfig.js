import mongoose from "mongoose";

const vehicleConfigSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true,
        unique: true
    },
    speedLimit: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});

export const VehicleConfig = mongoose.model('VehicleConfig', vehicleConfigSchema);
