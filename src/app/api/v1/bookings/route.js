import "@/lib/connectDB";
import { NextResponse } from "next/server";
import { BookingServices } from "@/services/booking.service";

export async function POST(req) {
  try {
    const data = await req.json();
    const booking = await BookingServices.postBookingToDB(data);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await BookingServices.getAllBookingsFromDB();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
