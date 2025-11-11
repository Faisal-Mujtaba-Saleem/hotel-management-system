"use client";

import React, { useEffect, useState } from "react";
import { DialogTitle } from "@headlessui/react";
import { useDialog } from "@/contexts/modal-context/context";
import { toast } from "react-toastify";

export default function EditBookingForm({ booking, onUpdate }) {
  const { setIsOpen } = useDialog();

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    totalAmount: 0,
    paidAmount: 0,
    paymentStatus: "Pending",
    status: "Pending",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        checkIn: booking.checkIn ? new Date(booking.checkIn).toISOString().split("T")[0] : "",
        checkOut: booking.checkOut ? new Date(booking.checkOut).toISOString().split("T")[0] : "",
        totalAmount: booking.totalAmount || 0,
        paidAmount: booking.paidAmount || 0,
        paymentStatus: booking.paymentStatus || "Pending",
        status: booking.status || "Pending",
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: /Amount/i.test(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!booking?._id) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/bookings/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Failed to update booking (${res.status})`);

      const updatedBooking = await res.json();
      // keep compatibility with existing handler
      const payload = updatedBooking.booking || updatedBooking || null;
      if (typeof onUpdate === "function") onUpdate(payload);
      toast.success("Booking updated successfully!");
      setIsOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl">
      <DialogTitle className="text-lg font-semibold border-b pb-3">Edit Booking</DialogTitle>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
            <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="form-input px-3 py-2 rounded-lg border" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
            <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="form-input px-3 py-2 rounded-lg border" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} min="0" className="form-input px-3 py-2 rounded-lg border" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
            <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleChange} min="0" max={formData.totalAmount} className="form-input px-3 py-2 rounded-lg border" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="form-select px-3 py-2 rounded-lg border" required>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Booking Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-select px-3 py-2 rounded-lg border" required>
              <option value="Pending">Pending</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Checked-Out">Checked-Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        AppModal<div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg">{loading ? "Updating..." : "Update Booking"}</button>
        </div>
      </form>
    </div>
  );
}
