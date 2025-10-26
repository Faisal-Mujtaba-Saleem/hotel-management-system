"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FaEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useElementsHeights } from "@/contexts/elements-heights-context/context";

export default function RoomsTable() {
  const rooms = [
    {
      image: "https://i.postimg.cc/KYGtGJT0/Deluxe-Twin-1-min.jpg",
      roomId: "DLX-001",
      roomName: "Deluxe Twin Room",
      pricePerNight: 120,
      status: "Booked",
      guestName: "John Doe",
      checkInDate: "2025-10-15",
      checkOutDate: "2025-10-18",
    },
    {
      image: "https://i.postimg.cc/6q3C6tcd/Superior-King-1-min.jpg",
      roomId: "SUP-002",
      roomName: "Superior King Room",
      pricePerNight: 150,
      status: "Available",
      guestName: null,
      checkInDate: null,
      checkOutDate: null,
    },
    {
      image: "https://i.postimg.cc/x8VZX3P9/Executive-Suite-1-min.jpg",
      roomId: "EXS-003",
      roomName: "Executive Suite",
      pricePerNight: 220,
      status: "Booked",
      guestName: "Emily Clark",
      checkInDate: "2025-10-17",
      checkOutDate: "2025-10-20",
    },
    {
      image: "https://i.postimg.cc/yN1C1N8v/Standard-Single-1-min.jpg",
      roomId: "STD-004",
      roomName: "Standard Single Room",
      pricePerNight: 80,
      status: "Maintenance",
      guestName: null,
      checkInDate: null,
      checkOutDate: null,
    },
  ];

  const { topbarHeight, headerHeight } = useElementsHeights();

  // Pagination state / config
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const tr_Ref = useRef(null);

  useEffect(() => {
    const handleResize = () => getPageSize();
    window.addEventListener("resize", handleResize);
    getPageSize(); // initial call
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(rooms.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visibleRooms = rooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function getPageSize() {
    if (typeof window === "undefined") return 5;
    const windowHeight = window.innerHeight || 800;
    const rowHeight = tr_Ref.current ? tr_Ref.current.offsetHeight : 60; // default row height
    const availableHeight = windowHeight - topbarHeight - headerHeight - 200; // 200 - reserve for paddings
    setPageSize(() => {
      return Math.max(1, Math.floor(availableHeight / rowHeight));
    });
  }

  function goToPage(page) {
    // Logic to prevent going out of bounds i.e. < 1 or > totalPages
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
  }

  return (
    <div className="overflow-x-auto bg-white pb-5 mx-6 rounded shadow-sm">
      <table className="table w-full mx-auto">
        <thead className="bg-[#0284c7] text-white text-sm">
          <tr>
            <th className="p-3 text-start">Image</th>
            <th className="p-3 text-start">Room ID</th>
            <th className="p-3 text-start">Room Name</th>
            <th className="p-3 text-start">Guest Name</th>
            <th className="p-3 text-start">Check In</th>
            <th className="p-3 text-start">Check Out</th>
            <th className="p-3 text-start">Price/Night</th>
            <th className="p-3 text-start">Status</th>
            <th className="text-center py-3 w-[80px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleRooms.map((room, index) => (
            <tr
              ref={tr_Ref}
              key={index}
              className="hover border-b border-gray-300"
            >
              <td className="p-2">
                <Image
                  className="w-20 h-[45px] rounded object-cover"
                  src={room.image}
                  alt={`Room ${room.roomId}`}
                  width={80}
                  height={45}
                />
              </td>
              <td className="p-3">{room.roomId}</td>
              <td className="p-3">{room.roomName}</td>
              <td className="p-3">{room.guestName || "-"}</td>
              <td className="p-3">{room.checkInDate || "-"}</td>
              <td className="p-3">{room.checkOutDate || "-"}</td>
              <td className="p-3">${room.pricePerNight}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    room.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : room.status === "Booked"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {room.status}
                </span>
              </td>
              <td className="flex gap-1 justify-center items-center py-3">
                <button className="hover:text-red-100 hover:bg-red-500 flex justify-center p-1 rounded mx-auto">
                  <TrashIcon className="w-5 h-5 text-red-600 hover:text-white" />
                </button>
                <button className="hover:bg-green-500 flex justify-center p-1 rounded mx-auto">
                  <FaEdit className="w-5 h-5 text-green-500 hover:text-gray-100" />
                </button>
                <button
                  className="text-blue-500 hover:text-blue-100 hover:bg-blue-500 p-1 rounded transition flex items-center justify-center"
                  title="View Details"
                >
                  <IoEyeOutline size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end pr-6 pt-5 border-t border-gray-100">
        <ul className="flex items-center gap-1 text-sm">
          <li>
            <button
              className={`px-3 py-[5px] border border-gray-100 rounded bg-[#0284c7] text-white ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {pages.map((page) => (
            <li key={page}>
              <button
                onClick={() => goToPage(page)}
                className={`px-3 py-[5px] border border-gray-100 rounded ${
                  page === currentPage
                    ? "bg-[#0284c7] text-white"
                    : "hover:bg-gray-100 transition"
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              className={`px-3 py-[5px] border border-gray-100 rounded bg-[#0284c7] text-white ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
