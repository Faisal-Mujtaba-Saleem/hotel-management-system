import { NextResponse } from "next/server";
import "@/lib/connectDB";
import { RoomServices } from "@/services/room.service";
import { ServerError } from "@/utlis/ServerError";

/** 🔎 GET → Search available rooms between dates */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    if (!startDate || !endDate)
      throw new ServerError("Both start and end dates are required", 400);

    const availableRooms = await RoomServices.searchAvailableRoomsFromDB(
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json(availableRooms, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
