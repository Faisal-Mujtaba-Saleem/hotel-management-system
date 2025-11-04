"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useMemo, Fragment, useEffect } from "react";
import { formatCurrency } from "@/utlis/formatCurrency";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { bookingSubmissionAction } from "@/app/actions/booking.actions/bookingSubmissionAction";
import { toast } from "react-toastify";
import calculateNights from "@/utlis/calculateNights";

export function BookingModal({
  open,
  room,
  onClose,
  bookingParams,
  refresher,
}) {
  const { checkIn, checkOut } = bookingParams || {};

  const [guests, setGuests] = useState([
    {
      fullName: "",
      contactNumber: "",
      email: "",
      cnic: "",
      gender: "",
      address: "",
      isPrimaryGuest: true,
      expanded: true,
    },
  ]);

  const [paidAmount, setpaidAmount] = useState(0);

  useEffect(() => {
    // Delete guests which are empty on modal close
    console.log(`Guests Length before modal close: ${guests.length}`);
    if (guests.length === 1) {
      const g = guests[0];
      g.isPrimaryGuest = true;
      return setGuests([g]);
    }

    setGuests((prev) =>
      prev.filter((g) => {
        return (
          g.fullName.trim() !== "" ||
          g.contactNumber.trim() !== "" ||
          g.email.trim() !== "" ||
          g.cnic.trim() !== "" ||
          g.address.trim() !== "" ||
          g.isPrimaryGuest !== false
        );
      })
    );
  }, [onClose]);

  // ✅ Nights & Total
  const nights = calculateNights(checkIn, checkOut);

  const totalAmount = useMemo(() => {
    if (!nights) return 0;
    return (room?.price ?? 0) * nights;
  }, [nights, room]);

  if (!room) return null;

  // ✅ Guests Handlers
  const addGuest = () =>
    setGuests([
      ...guests,
      {
        fullName: "",
        contactNumber: "",
        email: "",
        cnic: "",
        gender: "",
        address: "",
        isPrimaryGuest: false,
        expanded: true,
      },
    ]);

  const removeGuest = (index) => {
    if (guests.length === 1) return;
    setGuests(guests.filter((_, i) => i !== index));
  };

  const   handleGuestChange = (index, field, value) => {
    const updated = guests.map((g, i) =>
      i === index ? { ...g, [field]: value } : g
    );
    setGuests(updated);
  };

  const handlePrimarySelect = (index) => {
    const updated = guests.map((g, i) => ({
      ...g,
      isPrimaryGuest: i === index,
    }));
    setGuests(updated);
  };

  const toggleExpand = (index) => {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, expanded: !g.expanded } : g))
    );
  };

  const handleBookingSubmission = async (e) => {
    e.preventDefault();

    const bookingPayload = {
      room_id: room._id || room.id || null,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalAmount,
      paidAmount: Number(paidAmount) || 0,
      paymentStatus: "Pending",
      status: "Pending",
      guests,
    };
    // Validate Primary Guest
    if (!guests.some((g) => g.isPrimaryGuest)) {
      return alert("Please select one primary guest.");
    }
    // Call server action to post booking
    try {
      const res = await bookingSubmissionAction(bookingPayload);

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success("Booking successfully created!");
      refresher();
    } catch (error) {
      toast.error(`Failed to create booking: ${error.message}`);
    } finally {
      onClose();
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        {/* ✅ Modal Wrapper (Scroll Fixed) */}
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto my-8">
            <DialogPanel className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
              <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
                Book Room — {room.name}
              </DialogTitle>

              <p className="text-sm text-gray-500 mb-5">
                Rate: {formatCurrency(room.price)} / night • Capacity{" "}
                {room.capacity}
              </p>

              <form onSubmit={handleBookingSubmission} className="space-y-5">
                {/* Guests Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">
                      Guest Details
                    </h3>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      + Add Guest
                    </button>
                  </div>

                  {/* Accordion Style Guest Cards */}
                  <AnimatePresence>
                    {guests.map((guest, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="border border-gray-200 rounded-xl bg-gray-50"
                      >
                        {/* Header */}
                        <div
                          className="flex justify-between items-center px-4 py-3 cursor-pointer select-none"
                          onClick={() => toggleExpand(index)}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="primaryGuest"
                              checked={guest.isPrimaryGuest}
                              onChange={() => handlePrimarySelect(index)}
                            />
                            <span className="font-medium text-gray-700">
                              Guest {index + 1}
                              {guest.isPrimaryGuest && (
                                <span className="text-blue-600 text-sm ml-1">
                                  (Primary)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {guests.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeGuest(index);
                                }}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            )}
                            {guest.expanded ? (
                              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        {/* Expandable Form */}
                        <AnimatePresence>
                          {guest.expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="px-4 pb-4"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                <input
                                  required
                                  placeholder="Full Name"
                                  value={guest.fullName}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      index,
                                      "fullName",
                                      e.target.value
                                    )
                                  }
                                  className="border rounded-md px-3 py-2"
                                />
                                <input
                                  placeholder="Contact Number"
                                  value={guest.contactNumber}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      index,
                                      "contactNumber",
                                      e.target.value
                                    )
                                  }
                                  className="border rounded-md px-3 py-2"
                                />
                                <input
                                  type="email"
                                  placeholder="Email"
                                  value={guest.email}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="border rounded-md px-3 py-2"
                                />
                                <input
                                  placeholder="CNIC"
                                  value={guest.cnic}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      index,
                                      "cnic",
                                      e.target.value
                                    )
                                  }
                                  className="border rounded-md px-3 py-2"
                                />
                                <select
                                  value={guest.gender}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      index,
                                      "gender",
                                      e.target.value
                                    )
                                  }
                                  className="border rounded-md px-3 py-2"
                                >
                                  <option value="">Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                <input
                                  placeholder="Address"
                                  value={guest.address}
                                  onChange={(e) =>
                                    handleGuestChange(
                                      index,
                                      "address",
                                      e.target.value
                                    )
                                  }
                                  className="border rounded-md px-3 py-2"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Dates + Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      Check-in
                    </span>
                    <input
                      type="date"
                      value={checkIn}
                      readOnly
                      className="border rounded-md px-3 py-2 bg-gray-100"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      Check-out
                    </span>
                    <input
                      type="date"
                      value={checkOut}
                      readOnly
                      className="border rounded-md px-3 py-2 bg-gray-100"
                    />
                  </label>
                </div>

                {/* Payment Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                  <label className="flex-1 flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      Amount Paid
                    </span>
                    <input
                      type="number"
                      min={totalAmount * 0.1} // Minimum 10% advance
                      max={totalAmount}
                      value={paidAmount}
                      onChange={(e) => setpaidAmount(e.target.value)}
                      className="border rounded-md px-3 py-2"
                    />
                  </label>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Nights: {nights ?? "—"}
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-6">
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
                    Confirm Booking
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
