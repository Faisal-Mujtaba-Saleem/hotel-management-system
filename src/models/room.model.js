import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const roomSchema = new mongoose.Schema(
  {
    room_no: {
      type: Number,
      unique: true,
    },

    name: { type: String, required: true },

    roomType: {
      type: String,
      required: true,
      enum: ["Suite", "Deluxe", "Standard", "Family"],
    },

    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    features: { type: [String], required: true },

    img: { type: String, required: true },

    status: {
      type: String,
      enum: ["available", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

roomSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  const lastRoom = await this.constructor.findOne().sort({ room_no: -1 });
  console.log("lastRoom?.room_no", lastRoom?.room_no);
  
  this.room_no = lastRoom ? lastRoom.room_no + 1 : 101;
  next();
});

export const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
