import React from "react";
import Link from "next/link";
import DashboardLayoutClientWrapper from "@/components/DashboardLayoutClientWrapper";

export const metadata = {
  title: "Dashboard - Hotel Management",
};

export default function DashboardLayout({ children }) {
  return (
    <div>
      <DashboardLayoutClientWrapper>{children}</DashboardLayoutClientWrapper>
    </div>
  );
}