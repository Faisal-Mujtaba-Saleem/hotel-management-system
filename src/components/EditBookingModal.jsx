"use client";

import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditBookingModal({ isOpen, closeModal, booking, onUpdate }) {
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
            [name]: name.includes("Amount") ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/v1/bookings/${booking._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error(`Failed to update booking (${res.status})`);

            const updatedBooking = await res.json();
            onUpdate(updatedBooking.booking);
            toast.success("Booking updated successfully!");
            closeModal();
        } catch (err) {
            toast.error(err.message || "Failed to update booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-xl w-full bg-white rounded-xl shadow-lg">
                    <div className="p-6">
                        <DialogTitle className="text-lg font-semibold border-b pb-3">
                            Edit Booking
                        </DialogTitle>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Check-in Date */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                        className="form-input px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Check-out Date */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                        className="form-input px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Total Amount */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Total Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="totalAmount"
                                        value={formData.totalAmount}
                                        onChange={handleChange}
                                        className="form-input px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Paid Amount */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Paid Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="paidAmount"
                                        value={formData.paidAmount}
                                        onChange={handleChange}
                                        className="form-input px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                        max={formData.totalAmount}
                                        required
                                    />
                                </div>

                                {/* Payment Status */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Payment Status
                                    </label>
                                    <select
                                        name="paymentStatus"
                                        value={formData.paymentStatus}
                                        onChange={handleChange}
                                        className="form-select px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                {/* Booking Status */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Booking Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="form-select px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Checked-In">Checked-In</option>
                                        <option value="Checked-Out">Checked-Out</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Updating..." : "Update Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}