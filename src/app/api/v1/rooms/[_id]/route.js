import { NextResponse } from "next/server";
import "@/lib/mongoose/connectDB";
import { RoomServices } from "@/services/room.service";

/** 📖 GET → Get single room by ID */
export async function GET(_, { params }) {
  try {
    const room = await RoomServices.getSingleRoomFromDB(params._id);
    if (!room)
      throw new ServerError("Room not found", 404);

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

/** ✏️ PATCH → Update room by ID */
export async function PATCH(req, { params }) {
  try {
    const data = await req.json();
    const updated = await RoomServices.updateRoomFromDB(params._id, data);
    if (!updated)
      throw new ServerError("Room not found", 404);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

/** ❌ DELETE → Delete room by ID */
export async function DELETE(_, { params }) {
  try {
    const deleted = await RoomServices.deleteRoomFromDB(params._id);
    if (!deleted)
      throw new ServerError("Room not found", 404);

    return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
