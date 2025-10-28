import generate6DigitId from "@/utlis/generate6DigitId.js";
import sendMail from "@/utlis/sendMail";
import config from "@/config/env";
import { Booking } from "@/models/booking.model";
import { NextResponse } from "next/server";

const postBookingToDB = async (bookingData) => {
    const { room_id, checkIn, checkOut, totalAmount, paidAmount, guests } = bookingData;

    // 2️⃣ Create guests if not existing
    const savedGuests = await Guest.insertMany(guests || []);

    // 4️⃣ Create booking
    const result = await Booking.create({
        room_id,
        checkIn,
        checkOut,
        totalAmount,
        paidAmount,
        guests: savedGuests.map((g) => g._id),
    });

    if (result) {
        const info = await sendMail({
            from: `"Faisal Mujtaba Saleem" <${config.email_user}>`,
            to: `${result?.email}`,
            subject: 'Food Order Confirmed',
            text: "Your food order is successful. Thank for ordering. @Team Hotel Redisons"
        })

        if (!!info) {
            console.log('Message sent: %s', info.messageId);
        }
        else {
            console.log("Message sent failed");
        }
    } else {
        return NextResponse.json({ error: "Could not create booking" }, { status: 400 });
    }

    return result;
}

const getAllBookingsFromDB = async () => {
    const result = await Booking.find()
        .populate("room_id")
        .populate("guests")
        .sort({ createdAt: -1 });

    if (!result) {
        return NextResponse.json({ error: "No bookings found" }, { status: 404 });
    }

    return result;
}

const getBookingByIdFromDB = async (_id) => {
    const result = await Booking.findById(_id)
        .populate("room_id")
        .populate("guests");

    if (!result) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return result;
}

const updateBookingInDB = async (_id, updates) => {
    const result = await Booking.findByIdAndUpdate(_id, updates, { new: true });
    if (!result) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return result;
}

const deleteBookingFromDB = async (_id) => {
    const result = await Booking.findByIdAndDelete({ _id });
    if (!result) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return result;
}

export const BookingServices = {
    postBookingToDB,
    getAllBookingsFromDB,
    getBookingByIdFromDB,
    updateBookingInDB,
    deleteBookingFromDB
}