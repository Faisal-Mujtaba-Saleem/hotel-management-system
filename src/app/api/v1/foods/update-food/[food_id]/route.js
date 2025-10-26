import { FoodServices } from '@/services/food.service';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { food_id } = await params;
        const updateData = req.body;
        const result = await FoodServices.updateFoodFromDB(
            Number(food_id),
            updateData
        );

        return NextResponse.json({
            success: true,
            message: "Food Successfully updated",
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