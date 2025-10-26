"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import { BiSolidRegistered } from "react-icons/bi";
import { FaUsers, FaConciergeBell, FaHamburger, FaHotel, FaUtensils } from "react-icons/fa";
import { FaDoorClosed, FaRegCalendar, FaRegCalendarCheck, FaRegistered } from "react-icons/fa6";
import { IoBedOutline, IoLockClosed, IoOpen } from "react-icons/io5";
import { MdAppRegistration, MdBookOnline, MdEventNote, MdOutlineEventAvailable, MdOutlineRoom, MdRoom, MdRoomPreferences } from "react-icons/md";
import { TbDoorOff } from "react-icons/tb";

export default function DashboardStats() {
  const stats = [
    {
      title: "Guests",
      value: 124,
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      title: "Bookings",
      value: 43,
      icon: <FaRegCalendarCheck className="text-green-500" />,
    },
    {
      title: "Total Rooms",
      value: 10,
      icon: <FaHotel className="text-purple-500" />,
    },
    {
      title: "Available Rooms",
      value: 10,
      icon: <IoBedOutline className="text-blue-600"/>,
    },
    {
      title: "Booked Rooms",
      value: 0,
      icon: <IoLockClosed className="text-red-500" />,
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${stats.length} gap-6 mb-8`}>
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg p-6 flex items-center space-x-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer"
        >
          <div className="text-4xl text-blue-500 dark:text-blue-400">
            {item.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700 mb-1">{item.title}</h3>
            <p className="text-3xl font-semibold text-gray-600 tracking-tight">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
