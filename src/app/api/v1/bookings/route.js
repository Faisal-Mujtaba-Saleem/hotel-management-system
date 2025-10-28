import { NextResponse } from "next/server";
import { Booking } from "@/models/Booking";
import { Guest } from "@/models/Guest";
import connectDB from "@/lib/db"; // your db connection helper
import { BookingServices } from "@/services/booking.service";

// ✅ GET All Bookings
export async function GET() {
  await connectDB();
  try {
    const bookings = await BookingServices.getAllBookingsFromDB();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ CREATE Booking
export async function POST(req) {
  await connectDB();
  try {
    const bookingData = await req.json();
    const booking = await BookingServices.postBookingToDB(bookingData);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
