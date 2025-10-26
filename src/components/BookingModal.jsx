import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { formatCurrency } from "@/utlis/formatCurrency";
import React, { useState, useMemo } from "react";

export function BookingModal({ open, room, onClose, onConfirm, bookingParams }) {
    const [fullName, setFullName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [cnic, setCnic] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");

    const [advancePaid, setAdvancePaid] = useState(0);

    const { checkIn, checkOut, guestsCount } = bookingParams || {};

    // compute nights and total amount
    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return null;
        const ci = new Date(checkIn);
        const co = new Date(checkOut);
        if (isNaN(ci) || isNaN(co)) return null;
        const diffMs = co.getTime() - ci.getTime();
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return days > 0 ? days : null;
    }, [checkIn, checkOut]);

    const totalAmount = useMemo(() => {
        if (!nights) return 0;
        return (room?.price ?? 0) * nights;
    }, [nights, room]);

    if (!room) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // basic validation
        if (!fullName || !checkIn || !checkOut) {
            return alert("Please provide guest name and both check-in and check-out dates.");
        }

        const bookingPayload = {
            room_id: room.id || room._id || room.room_no || null,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            totalAmount: totalAmount,
            advancePaid: Number(advancePaid) || 0,
            paymentStatus: "Pending",
            status: "Pending",
            guests: [
                {
                    fullName,
                    contactNumber,
                    email,
                    cnic,
                    gender,
                    address,
                    isPrimaryGuest: true,
                },
            ],
        };

        onConfirm(bookingPayload);
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                    <header className="flex justify-between items-center mb-2">
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            Book {room.name}
                        </DialogTitle>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </header>

                    <p className="text-sm text-gray-500 mb-4">
                        Rate: {formatCurrency(room.price)} / night • Capacity {room.capacity}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Guest name</span>
                                <input
                                    required
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full name"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Contact number</span>
                                <input
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    placeholder="Phone"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Email</span>
                                <input
                                    type="email"
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">CNIC</span>
                                <input
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={cnic}
                                    onChange={(e) => setCnic(e.target.value)}
                                    placeholder="ID / CNIC"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Gender</span>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Prefer not to say</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Address</span>
                                <input
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Address (optional)"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Check-in</span>
                                <input
                                    required
                                    type="date"
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={checkIn}
                                    readOnly
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Check-out</span>
                                <input
                                    required
                                    type="date"
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={checkOut}
                                    readOnly
                                />
                            </label>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <label className="flex-1 flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">Advance paid</span>
                                <input
                                    type="number"
                                    min={0}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-blue-500"
                                    value={advancePaid}
                                    onChange={(e) => setAdvancePaid(e.target.value)}
                                />
                            </label>

                            <div className="text-right">
                                <div className="text-sm text-gray-500">Nights: {nights ?? "—"}</div>
                                <div className="text-lg font-semibold">{formatCurrency(totalAmount)}</div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
                            >
                                Confirm booking
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}