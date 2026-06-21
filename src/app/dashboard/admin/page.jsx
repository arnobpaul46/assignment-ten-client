"use client"
import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/dashboard/Sidebar";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import UsersTab from "@/components/admin/UsersTab";
import EbooksTab from "@/components/admin/EbooksTab";
import TransactionsTab from "@/components/admin/TransactionsTab";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // সিকিউরিটি চেক: শুধু অ্যাডমিন ঢুকতে পারবে
  useEffect(() => {
    if (!isPending) {
      if (!session || session.user.role !== "admin") {
        router.push("/"); // অ্যাডমিন না হলে হোমপেজে পাঠিয়ে দিবে
      }
    }
  }, [session, isPending, router]);

  if (isPending) return <div className="h-screen flex items-center justify-center bg-[#09090b]"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;
  if (!session || session.user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      {/* বাম পাশে একটি সাইডবার */}
      <aside className="hidden lg:block w-72 border-r border-zinc-800/50 h-screen sticky top-0 bg-[#0c0c0e]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="admin" />
      </aside>

      {/* ডান পাশে কন্টেন্ট */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-[1400px] mx-auto">
           {activeTab === "analytics" && <AnalyticsTab />}
           {activeTab === "manage-users" && <UsersTab />}
           {activeTab === "all-ebooks" && <EbooksTab />}
           {activeTab === "transactions" && <TransactionsTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;