"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("manage");

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">

      
      {/* ডান পাশে কন্টেন্ট */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AdminDashboard />
      </main>
    </div>
  );
}