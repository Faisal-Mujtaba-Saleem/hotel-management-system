import { RoomServices } from "@/services/rooms.service";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updateData = req.body;
    const result = await RoomServices.updateRoomFromDB(Number(id), updateData);
    return NextResponse.json(
      {
        success: true,
        message: "Successfully updated Deleted",
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
