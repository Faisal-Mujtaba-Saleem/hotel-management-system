import { RoomServices } from "@/services/rooms.service";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await RoomServices.deleteRoomFromDB(Number(id));
    return NextResponse.json({
      success: true,
      message: "Room Successfully Deleted",
      data: result,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong.",
      data: null,
    }, { status: 500 });
  }
}
