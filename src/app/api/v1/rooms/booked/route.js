import "@/lib/mongoose/connectDB";
import { NextResponse } from "next/server";
import { RoomServices } from "@/services/room.service";

export async function GET() {
  try {
    // 🧩 Step 1: Find all booked room numbers from bookings
    const bookedRooms = await RoomServices.getBookedRoomsFromDB();
    return NextResponse.json(bookedRooms, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
