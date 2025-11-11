import { GuestServices } from "@/services/guest.service";
import "@/lib/mongoose/connectDB";
import { NextResponse } from "next/server";

// ✅ Get Single Guest by ID
export async function GET(req, { params }) {
  try {
    const result = await GuestServices.getSingleGuestFromDB(params._id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}

// ✅ Update Guest
export async function PATCH(req, { params }) {
  try {
    const updates = await req.json();
    const result = await GuestServices.updateGuestInDB(params._id, updates);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}

// ✅ Delete Guest
export async function DELETE(req, { params }) {
  try {
    const result = await GuestServices.deleteGuestFromDB(params._id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}
