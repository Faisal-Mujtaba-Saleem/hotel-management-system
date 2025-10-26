import { NextResponse } from 'next/server';
import { BooingServices } from '@/services/booking.service';

export async function GET(request, { params }) {
    try {
        const { email } = await params;
        const result = await BooingServices.getRoomOrderByEmailFromDB(email);
        return NextResponse.json({
            success: true,
            message: "Fetched users room orders",
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

