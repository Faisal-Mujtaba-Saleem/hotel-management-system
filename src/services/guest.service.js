import { Guest } from "@/models/guest.model";
import { ServerError } from "@/utlis/ServerError";

export const GuestServices = {
  async storeGuestToDB(guestData) {
    const {
      fullName,
      contactNumber,
      cnic,
      email,
      gender,
      address,
      isPrimaryGuest,
    } = guestData;

    // ✅ Duplicate check
    const existing = await Guest.isGuestExists(email, contactNumber, cnic);
    if (existing) throw new ServerError("Guest already exists", 409);

    // ✅ Create guest
    const result = await Guest.create({
      fullName,
      contactNumber,
      cnic,
      email,
      gender,
      address,
      isPrimaryGuest,
    });

    if (!result) throw new ServerError("Guest creation failed", 400);
    return result;
  },

  async getSingleGuestFromDB(_id) {
    const result = await Guest.findById(_id);
    if (!result) throw new ServerError("Guest not found", 404);
    return result;
  },

  async getAllGuestsFromDB() {
    const result = await Guest.find().sort({ createdAt: -1 });
    if (!result?.length) throw new ServerError("No guests found", 404);
    return result;
  },

  async updateGuestInDB(_id, updates) {
    const result = await Guest.findByIdAndUpdate(_id, updates, { new: true });
    if (!result) throw new ServerError("Guest not found", 404);
    return result;
  },

  async deleteGuestFromDB(_id) {
    const result = await Guest.findByIdAndDelete(_id);
    if (!result) throw new ServerError("Guest not found", 404);
    return result;
  },

  async checkAdminFromDB(email) {
    const guest = await Guest.findOne({ email, role: "admin" });
    return !!guest;
  },
};
