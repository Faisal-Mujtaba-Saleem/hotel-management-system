// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    payableAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["Pending", "Checked-In", "Checked-Out", "Cancelled"],
      default: "Pending",
    },

    guests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
      },
    ],
  },
  { timestamps: true }
);

//
// 🔹 Utility: Only handle payment logic
//
function applyPaymentLogic(doc) {
  if (!doc) return;

  if (doc.paidAmount >= doc.totalAmount) {
    doc.paymentStatus = "Paid";
  } else if (doc.paidAmount > 0 && doc.paidAmount < doc.totalAmount) {
    doc.paymentStatus = "Pending";
  } else if (doc.paidAmount === 0) {
    doc.paymentStatus = "Pending";
  }
}

//
// 🧩 pre('save') - when creating or editing booking
//
bookingSchema.pre("save", function (next) {
  applyPaymentLogic(this);
  next();
});

//
// 🧩 pre('findOneAndUpdate') & pre('updateOne') - for query updates
//
bookingSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  // Get the object of the document being updated
  const update = this.getUpdate();
  if (!update) return next();

  // Auto-cancel sync
  if (update.paymentStatus === "Cancelled" || update.status === "Cancelled") {
    this.setUpdate({ ...update, paymentStatus: "Cancelled", status: "Cancelled" });
    return next();
  }

  // Handle payment logic if paidAmount or totalAmount updated
  if (update.paidAmount !== undefined || update.totalAmount !== undefined) {
    if (update.paidAmount >= update.totalAmount) {
      update.paymentStatus = "Paid";
    } else if (update.paidAmount > 0) {
      update.paymentStatus = "Pending";
    } else {
      update.paymentStatus = "Pending";
    }
  }

  this.setUpdate(update);
  next();
});

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
