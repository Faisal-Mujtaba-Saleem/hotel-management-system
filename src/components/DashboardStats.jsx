"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { BiSolidRegistered } from "react-icons/bi";
import { FaUsers, FaConciergeBell, FaHamburger, FaHotel, FaUtensils, FaTools } from "react-icons/fa";
import { FaDoorClosed, FaRegCalendar, FaRegCalendarCheck, FaRegistered } from "react-icons/fa6";
import { IoBedOutline, IoLockClosed, IoOpen } from "react-icons/io5";
import { MdAppRegistration, MdBookOnline, MdEventNote, MdOutlineEventAvailable, MdOutlineRoom, MdRoom, MdRoomPreferences } from "react-icons/md";
import { TbDoorOff } from "react-icons/tb";

export default function DashboardStats() {
  const [stats, setStats] = useState([
    { title: "Guests", value: "—", icon: <FaUsers className="text-blue-500" /> },
    { title: "Bookings", value: "—", icon: <FaRegCalendarCheck className="text-green-500" /> },
    { title: "Total Rooms", value: "—", icon: <FaHotel className="text-purple-500" /> },
    { title: "Available Rooms", value: "—", icon: <IoBedOutline className="text-blue-600" /> },
    { title: "Booked Rooms", value: "—", icon: <IoLockClosed className="text-red-500" /> },
  ]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const [guestsRes, bookingsRes, roomsRes, availableRes, bookedRes] = await Promise.all([
          fetch("/api/v1/guests", { cache: "no-store" }),
          fetch("/api/v1/bookings", { cache: "no-store" }),
          fetch("/api/v1/rooms", { cache: "no-store" }),
          fetch("/api/v1/rooms?status=available", { cache: "no-store" }),
          fetch("/api/v1/rooms/booked", { cache: "no-store" }),
        ]);

        const guestsCount = guestsRes.ok ? (await guestsRes.json()).length : 0;
        const bookingsCount = bookingsRes.ok ? (await bookingsRes.json()).length : 0;
        const totalRoomsCount = roomsRes.ok ? (await roomsRes.json()).length : 0;
        const availableRoomsCount = availableRes.ok ? (await availableRes.json()).length : 0;
        const bookedRoomsCount = bookedRes.ok ? (await bookedRes.json()).length : 0;

        const maintenanceRoomsCount = Math.max(0, totalRoomsCount - availableRoomsCount);

        if (!mounted) return;

        setStats([
          { title: "Guests", value: guestsCount, icon: <FaUsers className="text-blue-500" /> },
          { title: "Bookings", value: bookingsCount, icon: <FaRegCalendarCheck className="text-green-500" /> },
          { title: "Total Rooms", value: totalRoomsCount, icon: <FaHotel className="text-purple-500" /> },
          { title: "Available Rooms", value: availableRoomsCount, icon: <IoBedOutline className="text-blue-600" /> },
          { title: "Booked Rooms", value: bookedRoomsCount, icon: <IoLockClosed className="text-red-500" /> },
          { title: "Maintenance Rooms", value: maintenanceRoomsCount, icon: <FaTools className="text-red-500" /> },
        ]);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        if (mounted) setError(err.message || "Failed to load stats");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${stats.length} gap-6 mb-8`}>
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-linear-to-br from-white to-gray-100 rounded-xl shadow-lg p-6 flex items-center space-x-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer"
        >
          <div className="text-4xl text-blue-500 dark:text-blue-400">
            {item.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700 mb-1">{item.title}</h3>
            <p className="text-3xl font-semibold text-gray-600 tracking-tight">
              {loading ? "..." : item.value}
            </p>
          </div>
        </div>
      ))}
      {error && (
        <div className="col-span-full text-sm text-red-600 mt-2">Error loading stats: {error}</div>
      )}
    </div>
  );
}
