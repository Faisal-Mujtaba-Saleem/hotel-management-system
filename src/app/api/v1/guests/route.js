import "@/lib/mongoose/connectDB";
import { GuestServices } from "@/services/guest.service";
import { NextResponse } from "next/server";

// ✅ Create Guest
export async function POST(req) {
  try {
    const body = await req.json();
    const result = await GuestServices.storeGuestToDB(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}

// ✅ Get All Guests
export async function GET() {
  try {
    const result = await GuestServices.getAllGuestsFromDB();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}