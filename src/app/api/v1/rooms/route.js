import { RoomServices } from '@/services/rooms.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const result = await RoomServices.getAllRoomFromDB();
        return NextResponse.json({
            success: true,
            message: "Room Fetched Successfully",
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
        const roomData = await request.json();
        const result = await RoomServices.addRoomToDB(roomData);
        return NextResponse.json({
            success: true,
            message: "Room Successfully Created",
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