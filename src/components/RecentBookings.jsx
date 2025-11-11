"use client";
import React, { useEffect, useState } from "react";

export default function RecentBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch("/api/v1/bookings", { cache: "no-store" });
      const data = await res.json();
      console.log(data);
      
      setBookings(data.slice(0, 5));
    }
    fetchBookings();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
      <table className="w-full text-sm text-gray-700">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Guest</th>
            <th className="pb-2">Room</th>
            <th className="pb-2">Check-In</th>
            <th className="pb-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-b hover:bg-gray-50">
              <td className="py-2">{b.guests?.[0]?.fullName}</td>
              <td>{b.room?.name}</td>
              <td>{new Date(b.checkIn).toLocaleDateString()}</td>
              <td>Rs. {b.paidAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
