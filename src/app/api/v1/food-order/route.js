import { FoodOrderServices } from '@/services/foodOrder.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const result = await FoodOrderServices.getAllFoodOrdersFromDB();
        return NextResponse.json({
            success: true,
            message: "Fetched all food order data",
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
        const orderFoodData = await request.json();
        const result = await FoodOrderServices.orderFoodToDB(orderFoodData);
        return NextResponse.json({
            success: true,
            message: "Food Successfully Ordered",
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