"use client"
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import UsersTab from "@/components/admin/UsersTab";
import EbooksTab from "@/components/admin/EbooksTab";
import TransactionsTab from "@/components/admin/TransactionsTab";

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "analytics";

  
  const setActiveTab = (tab) => {
    router.push(`/dashboard/admin?tab=${tab}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "manage-users" && <UsersTab />}
        {activeTab === "all-ebooks" && <EbooksTab />}
        {activeTab === "transactions" && <TransactionsTab />}
    </div>
  );
}