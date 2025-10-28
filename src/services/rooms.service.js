import { Booking } from "@/models/booking.model";
import { Room } from "@/models/room.model";

const addRoomToDB = async (roomData) => {
  const result = await Room.create(roomData);
  return result;
};

const searchAvailableRoomsFromDB = async (startDate, endDate, guests) => {
  const overlappingBookedRoomsIds = await Booking.distinct("room_id", {
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
    status: { $ne: "Cancelled" }
  });

  if (overlappingBookedRoomsIds.length === 0) {
    // Agar koi booking nahi hai tou saare available rooms return kar do
    console.log("No overlapping bookings found.");

    const allAvailableRooms = await Room.find({
      status: "available",
      capacity: { $gte: guests }
    });
    return allAvailableRooms;
  }

  const availableRooms = await Room.find({
    _id: { $nin: overlappingBookedRoomsIds },
    status: "available",
    capacity: { $gte: guests },
  });
  return availableRooms;
};

const checkSpecificRoomAvailability = async (startDate, endDate, room_id) => {
  const overlappingBookedRoomsIds = await Booking.distinct("room_id", {
    room_id,
    startDate: { $lte: endDate }, endDate: { $gte: startDate }
  });

  // Agar overlappingBookedRoomsIds  me room mila, tou unavailable
  return overlappingBookedRoomsIds.length === 0; // true = available, false = booked
};


const getAllRoomFromDB = async () => {
  const result = await Room.find();
  return result;
};

const getSingleRoomFromDB = async (id) => {
  const result = await Room.find({ _id: id });
  return result;
};

const deleteRoomFromDB = async (id) => {
  const result = await Room.deleteOne({ _id: id });
  return result;
};

const updateRoomFromDB = async (id, updatedData) => {
  const result = await Room.updateOne({ _id: id }, updatedData);
  return result;
};

export const RoomServices = {
  addRoomToDB,
  getAllRoomFromDB,
  getSingleRoomFromDB,
  deleteRoomFromDB,
  searchAvailableRoomsFromDB,
  updateRoomFromDB,
  checkSpecificRoomAvailability,
};
