import { NextResponse } from "next/server";
import { Booking } from "@/models/booking.model";
import { BookingServices } from "@/services/booking.service";
import connectDB from "@/lib/db";

// ✅ GET One Booking
export async function GET(req, { params }) {
  await connectDB();
  try {
    const { _id } = await params;

    const booking = await BookingServices.getBookingByIdFromDB(_id);

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE Booking (status/payment update)
export async function PATCH(req, { params }) {
  await connectDB();
  try {
    const updates = await req.json();
    const { _id } = await params;

    const booking = await BookingServices.updateBookingInDB(_id, updates);

    return NextResponse.json({ message: "Booking updated", booking });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE Booking
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { _id } = await params;

    const booking = await BookingServices.deleteBookingFromDB(_id);
    console.log(`Successfully deleted the booking, ${booking}`);

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
