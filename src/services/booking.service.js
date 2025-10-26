import generate6DigitId from "@/utlis/generate6DigitId.js";
import sendMail from "@/utlis/sendMail";
import config from "@/config/env";
import { Booking } from "@/models/booking.model";

const orderRoomToDB = async (roomOrderData) => {
    roomOrderData.booking_id = generate6DigitId();

    const result = await Booking.create(roomOrderData);
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

const getAllRoomOrdersFromDB = async () => {
    const result = await Booking.find();
    return result;
}

const getRoomOrderByEmailFromDB = async (email) => {
    const result = await Booking.find({ email });
    return result;
}

const deleteRoomOrderFromDB = async (booking_id) => {
    const result = await Booking.deleteOne({ booking_id });
    return result;
}

export const BooingServices = {
    orderRoomToDB,
    getAllRoomOrdersFromDB,
    getRoomOrderByEmailFromDB,
    deleteRoomOrderFromDB
}