"use client";

import React from 'react'
import DashboardSharedHeader from '@/components/DashboardSharedHeader'
import RoomsTable from '@/components/RoomsTable';
import { SiHomebridge } from 'react-icons/si';

export default function page() {
    return (
        <div className='bg-[#F1F5F9] bg-gradient-to-r from-stone-100 to-blue-50 calc-height'>
            <DashboardSharedHeader Icon={SiHomebridge} heading={"Rooms"} addingButtonText={"Add Room"} />
            <RoomsTable />
        </div>
    )
}