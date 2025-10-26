"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FaEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useElementsHeights } from "@/contexts/elements-heights-context/context";
import { useDialog } from "@/contexts/modal-context/context";

export default function BookingsTable() {
  const bookings = [
    {
      image: "https://i.postimg.cc/KYGtGJT0/Deluxe-Twin-1-min.jpg",
      roomId: 1096,
      orderId: "ORD3554",
      email: "uttamsdev@gmail.com",
      startDate: "2025-10-09",
      endDate: "2025-10-09",
      price: "5150TK",
    },
    {
      image: "https://i.postimg.cc/63SZhKmP/16256-113891-f65416994-3xl.jpg",
      roomId: 1092,
      orderId: "ORD89802",
      email: "uttamsdev@gmail.com",
      startDate: "2025-10-10",
      endDate: "2025-10-30",
      price: "45150TK",
    },
    {
      image: "https://i.postimg.cc/63SZhKmP/16256-113891-f65416994-3xl.jpg",
      roomId: 1092,
      orderId: "ORD35672",
      email: "uttamsdev@gmail.com",
      startDate: "2025-10-07",
      endDate: "2025-10-07",
      price: "2150TK",
    },
    {
      image: "https://i.postimg.cc/gjZZS592/16256-113891-f65416992-3xl.jpg",
      roomId: 1090,
      orderId: "ORD76131",
      email: "john.sokpo@gmail.com",
      startDate: "2025-07-15",
      endDate: "2025-07-18",
      price: "4650TK",
    },
    {
      image: "https://i.postimg.cc/hG2TfTbc/Deluxe-2-min-1.jpg",
      roomId: 1094,
      orderId: "ORD19285",
      email: "uttamsdev@gmail.com",
      startDate: "2025-06-20",
      endDate: "2025-06-20",
      price: "3150TK",
    },
  ];

  // Pagination state / config
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const tr_Ref = useRef(null);

  const { topbarHeight, headerHeight } = useElementsHeights();
  const { populateModal } = useDialog();

  useEffect(() => {
    const handleResize = () => getPageSize();
    window.addEventListener("resize", handleResize);
    getPageSize(); // initial call
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visibleBookings = bookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function getPageSize() {
    if (typeof window === "undefined") return 5;
    const windowHeight = window.innerHeight || 800;
    const rowHeight = tr_Ref.current ? tr_Ref.current.offsetHeight : 60; // default row height
    const availableHeight = windowHeight - topbarHeight - headerHeight - 200; // reserve for paddings
    setPageSize(() => {
      return Math.max(1, Math.floor(availableHeight / rowHeight));
    });
  }

  function goToPage(page) {
    // Logic to prevent going out of bounds i.e. < 1 or > totalPages
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
  }

  function handleViewDetails(e, selectedBooking) {
    e.stopPropagation();
    // Open the details modal or perform any action with the booking data
    const modalTitle = `Booking Details for ${selectedBooking.email}`;
    const modalDescriptionJSX = (
      <div className="flex flex-col gap-3">
        <div className="flex justify-center">
          <Image
            src={selectedBooking.image}
            alt="Room Image"
            width={300}
            height={180}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          <p className="font-medium text-gray-700">Room ID:</p>
          <p>{selectedBooking.roomId}</p>

          <p className="font-medium text-gray-700">Order ID:</p>
          <p>{selectedBooking.orderId}</p>

          <p className="font-medium text-gray-700">Guest Email:</p>
          <p>{selectedBooking.email}</p>

          <p className="font-medium text-gray-700">Start Date:</p>
          <p>{selectedBooking.startDate}</p>

          <p className="font-medium text-gray-700">End Date:</p>
          <p>{selectedBooking.endDate}</p>

          <p className="font-medium text-gray-700">Price:</p>
          <p>{selectedBooking.price}</p>
        </div>
      </div>
    );
    populateModal(modalTitle, modalDescriptionJSX);
  }

  return (
    <div className="overflow-x-auto bg-white pb-5 mx-6 rounded shadow-sm">
      <table className="table w-full mx-auto">
        <thead className="bg-[#0284c7] text-white text-sm">
          <tr>
            <th className="p-3 text-start">Image</th>
            <th className="p-3 text-start">Room ID</th>
            <th className="p-3 text-start">Order ID</th>
            <th className="p-3 text-start">Guest</th>
            <th className="p-3 text-start">Start Date</th>
            <th className="p-3 text-start">End Date</th>
            <th className="p-3 text-start">Price</th>
            <th className="text-center py-3 w-[80px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleBookings.map((booking, index) => (
            <tr
              ref={tr_Ref}
              key={index}
              className="hover border-b border-gray-300"
            >
              <td className="p-2">
                <Image
                  className="w-20 h-[45px] rounded object-cover"
                  src={booking.image}
                  alt={`Room ${booking.roomId}`}
                  width={80}
                  height={45}
                />
              </td>
              <td className="p-3">{booking.roomId}</td>
              <td className="p-3">{booking.orderId}</td>
              <td className="p-3">{booking.email}</td>
              <td className="p-3">{booking.startDate}</td>
              <td className="p-3">{booking.endDate}</td>
              <td className="p-3">{booking.price}</td>
              <td className="flex gap-1 justify-center items-center py-3">
                <button
                  className="text-blue-500 hover:text-blue-100 hover:bg-blue-500 p-1 rounded transition flex items-center justify-center"
                  title="View Details"
                  onClick={(e) => handleViewDetails(e, booking)}
                >
                  <IoEyeOutline size={18} />
                </button>
                <button className=" hover:bg-green-500 flex justify-center p-1 rounded mx-auto">
                  <FaEdit className="w-5 h-5 text-green-500 hover:text-gray-100" />
                </button>
                <button className="hover:text-red-100 hover:bg-red-500 flex justify-center p-1 rounded mx-auto">
                  <TrashIcon className="w-5 h-5 text-red-600 hover:text-white" />
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
