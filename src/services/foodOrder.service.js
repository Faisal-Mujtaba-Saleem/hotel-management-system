import generate6DigitId from '@/utlis/generate6DigitId';
import sendMail from '@/utlis/sendMail';
import config from "@/config/env";
import { FoodOrder } from '@/models/foodOrder.model';

const orderFoodToDB = async (orderFoodData) => {
    orderFoodData.order_id = generate6DigitId();
    
    const result = await FoodOrder.create(orderFoodData);
    if (result) {
        const info = await sendMail({
            from: `"Faisal Mujtaba Saleem" <${config.email_user}>`,
            to: `${result?.email}`,
            subject: 'Food Order Confirmed',
            text: "Your food order is successful. Thank for ordering. @Team Hotel Redisons"
        })

        if (!!config) {
            console.log('Message sent: %s', info.messageId);
        }
        else {
            console.log("Message sent failed");
        }
    }
    return result;
}

const getAllFoodOrdersFromDB = async () => {
    const result = await FoodOrder.find();
    return result;
}

const getFoodOrderByEmailFromDB = async (email) => {
    const result = await FoodOrder.find({ email });
    return result;
}

const deleteFoodOrderFromDB = async (order_id) => {
    const result = await FoodOrder.deleteOne({ order_id });
    return result;
}

export const FoodOrderServices = {
    orderFoodToDB,
    getAllFoodOrdersFromDB,
    getFoodOrderByEmailFromDB,
    deleteFoodOrderFromDB
}