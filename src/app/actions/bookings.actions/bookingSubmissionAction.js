'use server';
import { BookingServices } from "@/services/booking.service";

export async function bookingSubmissionAction(bookingPayload) {
  console.log("🚀 Booking submission action called with payload:", bookingPayload);
  try {
    const booking = await BookingServices.postBookingToDB(bookingPayload);
    console.log("✅ Booking successfully created:", booking);
    return { success: true, booking };
  } catch (error) {
    console.error("❌ Error submitting booking:", error);
    return {
      success: false,
      message: error.message || "Unknown server error",
      status: error.statusCode || 500,
    };
  }
}
