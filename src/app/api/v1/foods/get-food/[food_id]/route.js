import { FoodServices } from '@/services/food.service';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { food_id } = await params;
        const result = await FoodServices.getSingleFoodFromDB(
            Number(food_id)
        );

        return NextResponse.json({
            success: true,
            message: "Food Successfully Fetched",
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