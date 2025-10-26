import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    contactNumber: { type: String },
    cnic: { type: String },
    email: { type: String },
    gender: { type: String, enum: ["Male", "Female"] },
    address: { type: String },

    isPrimaryGuest: { type: Boolean, default: false },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
  },
  { timestamps: true }
);

// static method
guestSchema.statics.isguestExists = async function (email, phone) {
  const existingguest = await this.findOne({ email, phone });
  return existingguest;
};

export const guest = mongoose.model("guest", guestSchema);
