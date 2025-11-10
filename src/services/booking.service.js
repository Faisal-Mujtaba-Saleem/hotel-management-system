import sendMail from "@/utlis/sendMail";
import config from "@/config/env";
import { Booking } from "@/models/booking.model";
import { Guest } from "@/models/guest.model";
import { ServerError } from "@/utlis/ServerError";

export const BookingServices = {
    async postBookingToDB(bookingData) {
        try {
            const { room, checkIn, checkOut, totalAmount, paidAmount, guests } = bookingData;

            if (!guests || !guests.length) {
                throw new ServerError("At least one guest is required", 400);
            }

            const allGuestDocs = [];

            // 🔹 Step 1: Validate or create guests
            for (const g of guests) {
                const existing = await Guest.isGuestExists(g.email, g.contactNumber, g.cnic);

                if (existing) {
                    if (
                        existing.email !== g.email ||
                        existing.contactNumber !== g.contactNumber ||
                        existing.cnic !== g.cnic
                    ) {
                        throw new ServerError(
                            `Guest data conflict for ${g.fullName}. Please verify credentials.`,
                            409
                        );
                    }

                    const alreadyBooked = await Guest.isGuestBooked(checkIn, checkOut, {
                        email: g.email,
                        contactNumber: g.contactNumber,
                        cnic: g.cnic,
                    });

                    if (alreadyBooked) {
                        throw new ServerError(
                            `Guest ${g.fullName} already has an active booking overlapping this date range.`,
                            409
                        );
                    }

                    allGuestDocs.push(existing);
                } else {
                    const newGuest = await Guest.create({ ...g, room });
                    allGuestDocs.push(newGuest);
                }
            }

            // 🔹 Step 4: Create booking
            const result = await Booking.create({
                room,
                checkIn,
                checkOut,
                totalAmount,
                paidAmount,
                guests: allGuestDocs.map((g) => g._id),
            });

            if (!result) throw new ServerError("Could not create booking", 400);

            // 🔹 Step 5: Confirmation email
            const primaryGuest = allGuestDocs.find((g) => !!g.isPrimaryGuest);
            if (primaryGuest?.email) {
                try {
                    const info = await sendMail({
                        from: `"Hotel Redisons" <${config.email_user}>`,
                        to: primaryGuest.email,
                        subject: "Booking Confirmed",
                        text: `Dear ${primaryGuest.fullName}, your booking from ${new Date(
                            checkIn
                        ).toDateString()} to ${new Date(checkOut).toDateString()} has been confirmed.`,
                        html: `<p>Dear <strong>${primaryGuest.fullName}</strong>,</p>
                   <p>Your booking from <b>${new Date(checkIn).toDateString()}</b> 
                   to <b>${new Date(checkOut).toDateString()}</b> has been confirmed.</p>
                   <p>Thank you for choosing <b>Hotel Redisons</b>.</p>`,
                    });

                    if (info?.messageId) console.log("📧 Confirmation email sent:", info.messageId);
                } catch (mailErr) {
                    console.warn("⚠️ Email sending failed:", mailErr.message);
                }
            }

            return result;
        } catch (err) {
            console.error("Booking Error:", err);
            if (err instanceof ServerError) throw err;
            throw new ServerError(err.message || "Booking failed", 500);
        }
    },

    // concerned function
    async getAllBookingsFromDB(filters = {}) {
        try {
            const query = {};

            // Apply filters if provided
            if (filters.status) query.status = filters.status;
            if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;

            const result = await Booking.find(query)
                .populate("room")
                .populate("guests")
                .sort({ createdAt: -1 });

            if (!result?.length) throw new ServerError("No bookings found", 404);
            return result;
        } catch (error) {
            if (error instanceof ServerError) throw error;
            throw new ServerError(error.message || "Failed to fetch bookings", 500);
        }
    },

    async getBookingByIdFromDB(_id) {
        const result = await Booking.findById(_id).populate("room").populate("guests");
        if (!result) throw new ServerError("Booking not found", 404);
        return result;
    },

    async updateBookingInDB(_id, updates) {
        const result = await Booking.findByIdAndUpdate(_id, updates, { new: true });
        if (!result) throw new ServerError("Booking not found", 404);
        return result;
    },

    async deleteBookingFromDB(_id) {
        const result = await Booking.findByIdAndDelete({ _id });
        if (!result) throw new ServerError("Booking not found", 404);
        return result;
    },
};
