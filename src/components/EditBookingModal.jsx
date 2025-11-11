"use client";

// Deprecated: EditBookingModal moved to `EditBookingForm` used inside AppModal.
export default function EditBookingModal() {
  if (typeof window !== "undefined") console.warn("EditBookingModal is deprecated. Use EditBookingForm via AppModal.");
  return null;
}