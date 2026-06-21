"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import MyEbooksTab from "@/components/writer/MyEbooksTab";
import AddEbookTab from "@/components/writer/AddEbookTab";
import SalesHistoryTab from "@/components/writer/SalesHistoryTab";
import WriterProfileTab from "@/components/writer/WriterProfileTab"; // নতুন
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

// ... বাকি ইমপোর্ট ...

const WriterDashboard = () => {
  const [activeTab, setActiveTab] = useState("my-ebooks");
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="h-screen flex items-center justify-center bg-[#09090b]"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      <aside className="hidden lg:block w-72 h-screen sticky top-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="writer" />
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
         <div className="max-w-[1200px] mx-auto">
            {activeTab === "my-ebooks" && <MyEbooksTab setActiveTab={setActiveTab} />}
            {activeTab === "add-ebook" && <AddEbookTab setActiveTab={setActiveTab} />}
            {activeTab === "sales" && <SalesHistoryTab />}
            
            {/* --- এখানে setActiveTab পাস করতে হবে --- */}
            {activeTab === "profile" && <WriterProfileTab setActiveTab={setActiveTab} />}
         </div>
      </main>
    </div>
  );
};

export default WriterDashboard;