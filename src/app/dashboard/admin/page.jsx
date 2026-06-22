"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import UsersTab from "@/components/admin/UsersTab";
import EbooksTab from "@/components/admin/EbooksTab";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:block w-72 h-screen sticky top-0"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="admin" /></aside>
      <div className="flex-1 lg:p-0">
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "manage-users" && <UsersTab />}
        {activeTab === "all-ebooks" && <EbooksTab />}
      </div>
    </div>
  );
};
export default AdminPage;