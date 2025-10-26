import { NextResponse } from 'next/server';
import { BooingServices } from '@/services/booking.service';

export async function GET(request) {
  try {
    const result = await BooingServices.getAllRoomOrdersFromDB();
    return NextResponse.json({
      success: true,
      message: "Fetched all room order data",
      data: result
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Something went wrong.',
      data: null
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const roomOrderData = await request.json();
    const result = await BooingServices.orderRoomToDB(roomOrderData);
    return NextResponse.json({
      success: true,
      message: "Room Successfully Ordered",
      data: result
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Something went wrong.',
      data: null
    }, { status: 500 })
  }
}