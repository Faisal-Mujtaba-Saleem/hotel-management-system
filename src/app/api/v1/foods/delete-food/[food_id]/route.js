import { FoodServices } from "@/services/food.service";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { food_id } = req.params;
    const result = await FoodServices.deleteFoodFromDB(Number(food_id));
    return NextResponse.json(
      {
        success: true,
        message: "Food Successfully deleted",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong.",
      data: null,
    });
  }
}
