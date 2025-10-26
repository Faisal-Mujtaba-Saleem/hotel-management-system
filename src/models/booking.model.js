// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        room_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },

        totalAmount: { type: Number, required: true },
        advancePaid: { type: Number, default: 0 },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Cancelled"],
            default: "Pending",
        },
        status: {
            type: String,
            enum: ["Pending", "Checked-In", "Checked-Out", "Cancelled"],
            default: "Pending",
        },

        // 👇 yahan guests ka link aaya
        guests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Guest",
            },
        ],
    },
    { timestamps: true }
);

export const Booking = mongoose.models.Booking ||
    mongoose.model("Booking", bookingSchema);
