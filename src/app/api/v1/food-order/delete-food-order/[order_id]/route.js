import { FoodOrderServices } from '@/services/foodOrder.service';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    try {
        const { order_id } = await params;
        console.log("order_id: ", order_id)

        const result = await FoodOrderServices.deleteFoodOrderFromDB(order_id);
        return NextResponse.json({
            success: true,
            message: "Food order successfully deleted",
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