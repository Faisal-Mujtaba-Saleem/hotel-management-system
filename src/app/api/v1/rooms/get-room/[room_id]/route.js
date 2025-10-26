import { RoomServices } from "@/services/rooms.service";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { room_id } = await params;
    const result = await RoomServices.getSingleRoomFromDB(room_id);
    return NextResponse.json(
      {
        success: true,
        message: "Room Fetched Successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong.",
        data: null,
      },
      { status: 500 }
    );
  }
}