import { UserServices } from "@/services/user.service";
import "@/lib/mongoose/connectDB";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result = await UserServices.getAllUserFromDB();
    return NextResponse.json(
      {
        success: true,
        message: "User fetch Successfully",
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

export async function POST(request) {
  try {
    const userData = req.body;
    const result = await UserServices.storeUserToDB(userData);
    return NextResponse.json(
      {
        success: true,
        message: "User Successfully Created",
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
