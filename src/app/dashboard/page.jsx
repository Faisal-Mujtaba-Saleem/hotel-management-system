"use client"

import React from "react";
import DashboardSharedHeader from "@/components/DashboardSharedHeader";
import DashboardStats from "@/components/DashboardStats";
import RecentOrders from "@/components/RecentOrders";
import { AiOutlineDashboard } from "react-icons/ai";

export default function page() {
  return (
    <div className="bg-[#F1F5F9] bg-gradient-to-r from-stone-100 to-blue-50 min-h-[calc(100vh_-_70px)]">
      <DashboardSharedHeader
        Icon={AiOutlineDashboard}
        heading={"Administrator Dashboard"}
      />
      <div className="px-5">
        <DashboardStats />
        {/* <RecentOrders /> */}
      </div>
    </div>
  );
}
