"use client";

import React from "react";
import Image from "next/image";

export default function RoomView({ room }) {
  const imgSrc = room.img || room.image || "/placeholder.jpg";

  return (
    <div className="flex flex-col gap-4">
      {/* Image */}
      <div className="flex justify-center">
        <Image
          src={imgSrc}
          alt={`Room ${room.room_no || room.name || "#"}`}
          width={400}
          height={240}
          className="rounded-lg object-cover shadow-sm"
        />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p className="font-medium text-gray-700">Room No:</p>
        <p>{room.room_no ?? "—"}</p>

        <p className="font-medium text-gray-700">Name:</p>
        <p>{room.name ?? "—"}</p>

        <p className="font-medium text-gray-700">Type:</p>
        <p>{room.roomType ?? "—"}</p>

        <p className="font-medium text-gray-700">Price:</p>
        <p>
          {typeof room.price === "number"
            ? `$${room.price}`
            : room.price ?? "—"}
        </p>

        <p className="font-medium text-gray-700">Capacity:</p>
        <p>
          {room.capacity ?? "—"}
          {room.capacity ? " guests" : ""}
        </p>

        <p className="font-medium text-gray-700">Status:</p>
        <p>{room.status ?? "—"}</p>

        <p className="font-medium text-gray-700">Features:</p>
        <p>
          {(room.features && room.features.length > 0
            ? room.features.join(", ")
            : "—")}
        </p>

        <p className="font-medium text-gray-700">Created At:</p>
        <p>
          {room.createdAt
            ? new Date(room.createdAt).toLocaleString()
            : "—"}
        </p>
      </div>
    </div>
  );
}
