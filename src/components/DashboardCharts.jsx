"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { getWeekDateRange } from "@/utlis/date-time-utils/getWeekDateRange";

// 🔹 Animated Gradient KPI Badge with Icon Glow & Pulse
function KpiBadge({ title, value, fromColor, toColor }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-3 rounded-2xl font-semibold text-white shadow-md bg-gradient-to-r ${fromColor} ${toColor} cursor-default relative overflow-hidden`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-2xl opacity-20 bg-white blur-2xl"
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Content */}
      <div className="relative flex flex-col">
        <span className="text-sm">{title}</span>
        <div className="text-lg mt-1">{value}</div>
      </div>
    </motion.div>
  );
}

export default function DashboardCharts() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [revenueByRoom, setRevenueByRoom] = useState([]);
  const [bookingTrend, setBookingTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const [summaryMetrics, setSummaryMetrics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    avgBookingValue: 0,
    totalBookings30Days: 0,
    avgBookingsPerDay: 0,
  });

  useEffect(() => {
    async function loadCharts() {
      setLoading(true);
      try {
        // 🔹 Weekly Booking & Revenue Trend
        const weeklyRes = await fetch("/api/v1/reports", { cache: "no-store" });
        const weeklyRaw = weeklyRes.ok ? await weeklyRes.json() : { weekly: [] };
        const formattedWeekly = weeklyRaw.weekly.map((w) => ({
          week: `Week ${getWeekDateRange(w._id)}`,
          revenue: w.totalRevenue,
          bookings: w.bookings,
        }));
        setWeeklyData(formattedWeekly);

        const totalBookings = formattedWeekly.reduce((sum, w) => sum + w.bookings, 0);
        const totalRevenue = formattedWeekly.reduce((sum, w) => sum + w.revenue, 0);
        const avgBookingValue = totalBookings ? Math.round(totalRevenue / totalBookings) : 0;

        // 🔹 Revenue by Room Type
        const roomRevenueRes = await fetch("/api/v1/reports?type=roomRevenue", { cache: "no-store" });
        const roomRevenueData = roomRevenueRes.ok ? await roomRevenueRes.json() : [];
        setRevenueByRoom(roomRevenueData);

        // 🔹 Booking Trend Last 30 Days
        const bookingTrendRes = await fetch("/api/v1/reports?type=bookingTrend", { cache: "no-store" });
        const bookingTrendData = bookingTrendRes.ok ? await bookingTrendRes.json() : [];
        setBookingTrend(bookingTrendData);

        const totalBookings30Days = bookingTrendData.reduce((sum, d) => sum + d.bookings, 0);
        const avgBookingsPerDay = bookingTrendData.length
          ? Math.round(totalBookings30Days / bookingTrendData.length)
          : 0;

        setSummaryMetrics({ totalBookings, totalRevenue, avgBookingValue, totalBookings30Days, avgBookingsPerDay });
      } catch (err) {
        console.error("Error loading charts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCharts();
  }, []);

  return (
    <div className="space-y-8">

      {/* Weekly Booking & Revenue Trend */}
      <div className="chart-container bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <KpiBadge
            title="Total Bookings"
            value={summaryMetrics.totalBookings}
            fromColor="from-blue-500"
            toColor="to-blue-600"
          />
          <KpiBadge
            title="Total Revenue"
            value={`Rs. ${summaryMetrics.totalRevenue.toLocaleString()}`}
            fromColor="from-green-500"
            toColor="to-green-600"
          />
          <KpiBadge
            title="Avg. Booking Value"
            value={`Rs. ${summaryMetrics.avgBookingValue.toLocaleString()}`}
            fromColor="from-purple-500"
            toColor="to-purple-600"
          />
        </div>
        <h3 className="text-lg font-semibold mb-4">Weekly Booking & Revenue Trend</h3>
        {loading ? <div>Loading...</div> : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue by Room Type */}
      <div className="chart-container bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <KpiBadge
            title="Total Revenue by Room"
            value={`Rs. ${revenueByRoom.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}`}
            fromColor="from-teal-500"
            toColor="to-teal-600"
          />
        </div>
        <h3 className="text-lg font-semibold mb-4">Revenue by Room Type</h3>
        {loading ? <div>Loading...</div> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByRoom} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="roomType" />
              <YAxis />
              <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Booking Trend Last 30 Days */}
      <div className="chart-container bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <KpiBadge
            title="Total Bookings (30 Days)"
            value={summaryMetrics.totalBookings30Days}
            fromColor="from-orange-500"
            toColor="to-orange-600"
          />
          <KpiBadge
            title="Avg. Bookings/Day"
            value={summaryMetrics.avgBookingsPerDay}
            fromColor="from-indigo-500"
            toColor="to-indigo-600"
          />
        </div>
        <h3 className="text-lg font-semibold mb-4">Booking Trend (Last 30 Days)</h3>
        {loading ? <div>Loading...</div> : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
