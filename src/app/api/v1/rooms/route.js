import "@/lib/mongoose/connectDB";
import { RoomServices } from "@/services/room.service";
import { NextResponse } from "next/server";

/** 🏠 POST → Add new room */
export async function POST(req) {
  try {
    const body = await req.json();
    const room = await RoomServices.uploadRoomToDB(body);
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

/** 📖 GET → Get all rooms (with optional filters) */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      status: searchParams.get("status") || undefined,
      roomType: searchParams.get("roomType") || undefined,
    };

    const rooms = await RoomServices.getAllRoomsFromDB(filters);
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
