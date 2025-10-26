import mongoose from "mongoose";
import { TFoodOrder } from "./foodOrder.interface";

const foodOrderSchema = new mongoose.Schema < TFoodOrder > ({
   food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'food',
      required: true,
   },
   order_id: {
      type: String,
      unique: true,
      required: true,
   },
   email: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   img: {
      type: String,
      required: true
   }
});

export const FoodOrder = mongoose.model('food-order', foodOrderSchema);