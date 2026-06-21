"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import PurchaseHistoryTab from "@/components/reader/PurchaseHistoryTab";
import PurchasedEbooksTab from "@/components/reader/PurchasedEbooksTab";
import UserProfileTab from "@/components/reader/UserProfileTab";
import BookmarkPageTab from "@/components/reader/BookmarkPageTab";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("purchased-gallery");
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="h-screen flex items-center justify-center bg-[#09090b]"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      <aside className="hidden lg:block w-72 h-screen sticky top-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="reader" />
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
         <div className="max-w-[1200px] mx-auto">
            {activeTab === "purchased-gallery" && <PurchasedEbooksTab />}
            {activeTab === "purchase-history" && <PurchaseHistoryTab />}
            {activeTab === "bookmarks" && <BookmarkPageTab />}
            {activeTab === "profile" && <UserProfileTab />}
         </div>
      </main>
    </div>
  );
};
export default UserDashboard;