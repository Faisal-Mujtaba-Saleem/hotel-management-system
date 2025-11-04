import { Booking } from "@/models/booking.model";
import { Room } from "@/models/room.model";
import { ServerError } from "@/utlis/ServerError";

export const RoomServices = {
  /** 🏠 Add new room */
  async uploadRoomToDB(roomData) {
    try {
      if (!roomData?.name || !roomData?.price) {
        throw new ServerError("Room name and price are required", 400);
      }

      const existing = await Room.findOne({ room_no: roomData.room_no });
      if (existing) throw new ServerError("Room number already exists", 409);

      const newRoom = await Room.create(roomData);
      return newRoom;
    } catch (error) {
      if (error instanceof ServerError) throw error;
      throw new ServerError(error.message || "Failed to add room", 500);
    }
  },

  /** 🔍 Get all rooms (with optional filters) */
  async getAllRoomsFromDB(filters = {}) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.roomType) query.roomType = filters.roomType;

      const rooms = await Room.find(query).sort({ room_no: 1 });
      if (!rooms?.length) throw new ServerError("No rooms found", 404);
      return rooms;
    } catch (error) {
      if (error instanceof ServerError) throw error;
      throw new ServerError(error.message || "Failed to fetch rooms", 500);
    }
  },

  /** 📖 Get single room by ID */
  async getSingleRoomFromDB(id) {
    try {
      const room = await Room.findById(id).populate("bookings");
      if (!room) throw new ServerError("Room not found", 404);
      return room;
    } catch (error) {
      if (error instanceof ServerError) throw error;
      throw new ServerError(error.message || "Failed to fetch room", 500);
    }
  },

  /** ✏️ Update room by ID */
  async updateRoomFromDB(id, updatedData) {
    try {
      const updated = await Room.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!updated) throw new ServerError("Room not found", 404);
      return updated;
    } catch (error) {
      if (error instanceof ServerError) throw error;
      throw new ServerError(error.message || "Failed to update room", 500);
    }
  },

  /** ❌ Delete room by ID */
  async deleteRoomFromDB(id) {
    try {
      const deleted = await Room.findByIdAndDelete(id);
      if (!deleted) throw new ServerError("Room not found", 404);
      return deleted;
    } catch (error) {
      if (error instanceof ServerError) throw error;
      throw new ServerError(error.message || "Failed to delete room", 500);
    }
  },

  /** 🔎 Search available rooms between dates */
  async searchAvailableRoomsFromDB(startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        throw new ServerError("Start and end dates are required", 400);
      }

      const overlappingBookedRoomIds = await Booking.distinct("room", {
        checkIn: { $lte: endDate },
        checkOut: { $gte: startDate },
        status: { $ne: "Cancelled" },
      });

      const availableRooms = await Room.find({
        _id: { $nin: overlappingBookedRoomIds },
        status: "available",
      });

      if (!availableRooms.length)
        throw new ServerError("No available rooms found for the selected dates", 404);

      return availableRooms;
    } catch (error) {
      if (error instanceof ServerError) throw error;
      throw new ServerError(error.message || "Room search failed", 500);
    }
  },
};
