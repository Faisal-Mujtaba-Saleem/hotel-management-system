"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FaEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useElementsHeights } from "@/contexts/elements-heights-context/context";

// Component now matches the `guest` model: { name, email, phone, status }
export default function GuestsTable({ onEdit, onDelete, onView }) {
  // fallback/sample data if no guests passed
  const guests = [
    {
      _id: "65e862a5bfd2858b448459cf",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 555-1234",
      status: "active",
    },
    {
      _id: "675f9f457c31c03e233e51af",
      name: "Emily Clark",
      email: "emily@example.com",
      phone: "+1 555-5678",
      status: "active",
    },
    {
      _id: "675f9f457c31c03e233e51af",
      name: "Sam Smith",
      email: "sam@example.com",
      phone: "+1 555-9012",
      status: "inactive",
    },
  ];

  const { topbarHeight = 0, headerHeight = 0 } = useElementsHeights();

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

  const totalPages = Math.max(1, Math.ceil(guests.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visibleGuests = guests.slice(
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
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
  }

  function initials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <div className="overflow-x-auto bg-white pb-5 mx-6 rounded shadow-sm">
      <table className="table w-full mx-auto">
        <thead className="bg-[#0284c7] text-white text-sm">
          <tr>
            <th className="p-3 text-start">Guest</th>
            <th className="p-3 text-start">Email</th>
            <th className="p-3 text-start">Phone</th>
            <th className="p-3 text-start">Status</th>
            <th className="text-center py-3 w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleGuests.map((g, index) => (
            <tr
              ref={tr_Ref}
              key={index}
              className="hover border-b border-gray-300"
            >
              <td className="p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                  {initials(g.name)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {g.name}
                  </div>
                  <div className="text-xs text-slate-500">{g._id}</div>
                </div>
              </td>

              <td className="p-3 text-sm text-slate-700">{g.email}</td>
              <td className="p-3 text-sm text-slate-700">{g.phone || "-"}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    g.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {g.status}
                </span>
              </td>

              <td className="flex gap-2 justify-center items-center py-3">
                <button
                  // onClick={() => onDelete && onDelete(g)}
                  className="hover:text-red-100 hover:bg-red-500 flex justify-center p-1 rounded mx-auto"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5 text-red-600 hover:text-white" />
                </button>

                <button
                  // onClick={() => onEdit && onEdit(g)}
                  className="hover:bg-green-500 flex justify-center p-1 rounded mx-auto"
                  title="Edit"
                >
                  <FaEdit className="w-5 h-5 text-green-500 hover:text-gray-100" />
                </button>

                <button
                  // onClick={() => onView && onView(g)}
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

GuestsTable.propTypes = {
  guests: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
};
