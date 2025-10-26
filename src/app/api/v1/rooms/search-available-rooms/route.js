import connectDB from '@/lib/dbConnect';
import { RoomServices } from '@/services/rooms.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const checkIn = searchParams.get('checkInDate');
        const checkOut = searchParams.get('checkOutDate');
        const guests = searchParams.get('guests');

        await connectDB();

        const result = await RoomServices.searchAvailableRoomsFromDB(checkIn, checkOut, guests);
        return NextResponse.json({
            success: true,
            message: "Available Rooms Fetched successfully",
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
