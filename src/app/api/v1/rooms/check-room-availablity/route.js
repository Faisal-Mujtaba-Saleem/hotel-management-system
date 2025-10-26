import { RoomServices } from '@/services/rooms.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const room_id = searchParams.get('room_id');

        const result = await RoomServices.checkSpecificRoomAvailability(startDate, endDate, room_id);
        console.log(result);
        
        return NextResponse.json({
            success: true,
            message: "Room data",
            data: result
        }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({
            success: false,
            message: error.message || 'Something went wrong.',
            data: null
        }, { status: 500 });
    }
}