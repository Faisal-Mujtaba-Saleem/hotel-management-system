"use client";

import React, { useEffect, useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FaEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useElementsHeights } from "@/contexts/elements-heights-context/context";
import { useDialog } from "@/contexts/modal-context/context";
import EditGuestModal from "./EditGuestModal";
import { toast } from "react-toastify";

export default function GuestsTable() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const { topbarHeight, headerHeight } = useElementsHeights();
  const { populateModal } = useDialog();

  // Pagination state / config
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const tr_Ref = useRef(null);

  // Fetch guests
  useEffect(() => {
    const ac = new AbortController();
    const fetchGuests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/guests", { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed to fetch guests (${res.status})`);
        const data = await res.json();
        setGuests(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        if (err.name !== "AbortError")
          setError(err.message || "Failed to load guests");
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
    return () => ac.abort();
  }, []);

  // Resize-based dynamic pagination
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
    const rowHeight = tr_Ref.current ? tr_Ref.current.offsetHeight : 60;
    const availableHeight = windowHeight - topbarHeight - headerHeight - 200;
    setPageSize(() => Math.max(1, Math.floor(availableHeight / rowHeight)));
  }

  function goToPage(page) {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
  }

  // Handle edit
  const handleEdit = (e, guest) => {
    e.stopPropagation();
    setSelectedGuest(guest);
    setIsEditModalOpen(true);
  };

  const handleGuestUpdate = async () => {
    // Refresh list after edit modal closes
    try {
      const res = await fetch("/api/v1/guests");
      if (!res.ok) throw new Error("Failed to refresh guests");
      const data = await res.json();
      setGuests(Array.isArray(data) ? data : data?.data || []);
      console.log("Guest updated, list refreshed");
      toast.success("Guest updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle delete
  const handleDelete = async (e, guestId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this guest?")) return;

    try {
      const res = await fetch(`/api/v1/guests/${guestId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete guest (${res.status})`);
      setGuests((prev) => prev.filter((g) => g._id !== guestId));
      toast.success("Guest deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete guest");
    }
  };

  // Handle view modal
  const handleViewDetails = (guest) => {
    const modalTitle = `Guest — ${guest.fullName || "—"}`;
    const modalDesc = (
      <div className="flex flex-col gap-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <p className="font-medium text-gray-700">Full Name:</p>
          <p>{guest.fullName ?? "—"}</p>

          <p className="font-medium text-gray-700">Contact Number:</p>
          <p>{guest.contactNumber ?? "—"}</p>

          <p className="font-medium text-gray-700">CNIC:</p>
          <p>{guest.cnic ?? "—"}</p>

          <p className="font-medium text-gray-700">Email:</p>
          <p>{guest.email ?? "—"}</p>

          <p className="font-medium text-gray-700">Gender:</p>
          <p>{guest.gender ?? "—"}</p>

          <p className="font-medium text-gray-700">Address:</p>
          <p>{guest.address ?? "—"}</p>

          <p className="font-medium text-gray-700">Primary Guest:</p>
          <p>{guest.isPrimaryGuest ? "Yes" : "No"}</p>

          <p className="font-medium text-gray-700">Created At:</p>
          <p>
            {guest.createdAt ? new Date(guest.createdAt).toLocaleString() : "—"}
          </p>
        </div>
      </div>
    );

    populateModal(modalTitle, modalDesc);
  };

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
            <th className="p-3 text-start">Contact</th>
            <th className="p-3 text-start">CNIC</th>
            <th className="p-3 text-start">Gender</th>
            <th className="p-3 text-start">Primary</th>
            <th className="text-center py-3 w-[120px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-sm text-gray-500">
                Loading guests...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-sm text-red-600">
                Error: {error}
              </td>
            </tr>
          ) : visibleGuests.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-sm text-gray-500">
                No guests found
              </td>
            </tr>
          ) : (
            visibleGuests.map((guest, index) => (
              <tr
                ref={tr_Ref}
                key={guest._id || index}
                className="hover border-b border-gray-300"
              >
                <td className="p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                    {initials(guest.fullName)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {guest.fullName}
                    </div>
                    <div className="text-xs text-slate-500">{guest.email}</div>
                  </div>
                </td>

                <td className="p-3 text-sm text-slate-700">
                  {guest.contactNumber}
                </td>
                <td className="p-3 text-sm text-slate-700">{guest.cnic}</td>
                <td className="p-3 text-sm text-slate-700">{guest.gender}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      guest.isPrimaryGuest
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {guest.isPrimaryGuest ? "Yes" : "No"}
                  </span>
                </td>

                <td className="flex gap-2 justify-center items-center py-3">
                  <button
                    title="View Guest Details"
                    onClick={() => handleViewDetails(guest)}
                    className="text-blue-500 hover:text-blue-100 hover:bg-blue-500 p-1 rounded transition flex items-center justify-center"
                  >
                    <IoEyeOutline size={18} />
                  </button>

                  <button
                    title="Edit Guest"
                    onClick={(e) => handleEdit(e, guest)}
                    className="hover:bg-green-500 flex justify-center p-1 rounded mx-auto"
                  >
                    <FaEdit className="w-5 h-5 text-green-500 hover:text-gray-100" />
                  </button>

                  <button
                    title="Delete Guest"
                    onClick={(e) => handleDelete(e, guest._id)}
                    className="hover:text-red-100 hover:bg-red-500 flex justify-center p-1 rounded mx-auto"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600 hover:text-white" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Guest Modal */}
      {isEditModalOpen && selectedGuest && (
        <EditGuestModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          guest={selectedGuest}
          onUpdate={() => {
            handleGuestUpdate();
            setIsEditModalOpen(false);
          }}
        />
      )}

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
