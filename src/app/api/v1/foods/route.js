import connectDB from '@/lib/dbConnect';
import { FoodServices } from '@/services/food.service';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectDB();

        const result = await FoodServices.getAllFoodFromDB();

        return NextResponse.json({
            success: true,
            message: "Food Successfully Fetched",
            data: result
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || 'Something Went Wrong.',
            data: null
        }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const foodData = await request.json();
        const result = await FoodServices.addFoodToDB(foodData);

        return NextResponse.json({
            success: true,
            message: "Food Successfully Added",
            data: result
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || 'Something Went Wrong.',
            data: null
        }, { status: 500 })
    }
}