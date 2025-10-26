"use client";

import React from "react";
import { IoAdd } from "react-icons/io5";
import { useElementsHeights } from "@/contexts/elements-heights-context/context";

export default function DashboardSharedHeader({
  Icon,
  heading,
  addingButtonText = "",
}) {
  const { headerRef } = useElementsHeights();

  return (
    <header
      ref={headerRef}
      className={`border border-gray-200 text-xl text-black mb-8 py-2 px-5 font-bold bg-[#F8FAFC] ${
        !!addingButtonText && `flex items-center justify-between`
      }`}
    >
      <p className="h-14 p-5 flex items-center gap-3">
        <Icon />
        {heading}
      </p>
      {!!addingButtonText && (
        <button
          className="bg-[#0284c7] px-4 py-2 gap-2 text-white font-medium rounded text-sm 
      w-auto text-center flex items-center justify-center"
        >
          <div>
            <IoAdd className="text-white font-bold" />
          </div>
          {addingButtonText}
        </button>
      )}
    </header>
  );
}
