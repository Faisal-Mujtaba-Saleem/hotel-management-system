import { NextResponse } from "next/server";
import { BooingServices } from "@/services/booking.service.js";

export async function DELETE(request, { params }) {
  try {
    const { booking_id } = await params;
    const result = await BooingServices.deleteRoomOrderFromDB(booking_id);
    return NextResponse.json(
      {
        success: true,
        message: "Room order successfully deleted",
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
