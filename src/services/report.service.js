// services/report.service.js
import { Booking } from "@/models/booking.model";
import mongoose from "mongoose";

export const ReportServices = {
  async getReportSummary() {
    const allBookings = await Booking.find({});

    const totalRevenue = allBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const pendingPayments = allBookings.reduce(
      (sum, b) => sum + Math.max(0, (b.totalAmount || 0) - (b.paidAmount || 0)),
      0
    );

    const currentMonth = new Date().getMonth();
    const monthRevenue = allBookings
      .filter((b) => new Date(b.createdAt).getMonth() === currentMonth)
      .reduce((sum, b) => sum + (b.paidAmount || 0), 0);

    return { totalRevenue, pendingPayments, monthRevenue };
  },

  async getWeeklyReport() {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: { $week: "$createdAt" },
          totalRevenue: { $sum: "$paidAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    return result;
  },

  async getRevenueByRoomType() {
    const result = await Booking.aggregate([
      {
        $lookup: {
          from: "rooms",
          localField: "room",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { $unwind: "$roomDetails" },
      {
        $group: {
          _id: "$roomDetails.roomType",
          revenue: { $sum: "$paidAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          roomType: "$_id",
          revenue: 1,
        },
      },
    ]);
    return result;
  },

  async getBookingTrend(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          bookings: 1,
          _id: 0,
        },
      },
    ]);
    return result;
  },
};
    