import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const foodSchema = new mongoose.Schema < TProductFood > ({
    food_id: {
        type: Number,
        unique: true,
        required: true,
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

const AutoIncrement = AutoIncrementFactory(mongoose);
foodSchema.plugin(AutoIncrement, { inc_field: "food_id" });

export const Food = mongoose.model('food', foodSchema);