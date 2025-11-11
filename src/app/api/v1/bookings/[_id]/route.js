import "@/lib/mongoose/connectDB";
import { NextResponse } from "next/server";
import { BookingServices } from "@/services/booking.service";

export async function GET(_, { params }) {
  try {
    const result = await BookingServices.getBookingByIdFromDB(params._id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const updates = await req.json();
    const result = await BookingServices.updateBookingInDB(params._id, updates);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    const result = await BookingServices.deleteBookingFromDB(params._id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}