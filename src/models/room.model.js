import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const roomSchema = new mongoose.Schema({
    room_no: {
        type: Number,
        unique: true,
        required: true,
    },

    name: { type: String, required: true },

    roomType: {
        type: String,
        required: true,
        enum: ["Suite", "Deluxe", "Standard", "Family"],
    },

    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    features: { type: [String], required: true },

    img: { type: String, required: true },

    status: {
        type: String,
        enum: ["available", "maintenance"],
        default: "available",
    },

    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: [],
        },
    ],
});

// ✅ Only apply plugin if not already applied
if (!mongoose.models.Room) {
    const AutoIncrement = AutoIncrementFactory(mongoose);
    roomSchema.plugin(AutoIncrement, { inc_field: "room_id" });
}

// ✅ Prevent overwrite on hot reload
export const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
