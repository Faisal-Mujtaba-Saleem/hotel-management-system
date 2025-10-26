import { Food } from "@/models/food.model";

const addFoodToDB = async (foodData) => {
    const result = await Food.create(foodData);
    return result;
}

const getAllFoodFromDB = async () => {
    const result = await Food.find();
    return result;
}

const getSingleFoodFromDB = async (food_id) => {
    const result = await Food.findOne({ food_id });
    return result;
}

const deleteFoodFromDB = async (food_id) => {
    const result = await Food.deleteOne({ food_id });
    return result;
}
const updateFoodFromDB = async (food_id, updatedData) => {
    const result = await Food.updateOne({ food_id }, updatedData);
    return result;
}

export const FoodServices = {
    addFoodToDB,
    getAllFoodFromDB,
    getSingleFoodFromDB,
    deleteFoodFromDB,
    updateFoodFromDB
}