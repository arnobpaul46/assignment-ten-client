"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import MyLibraryTab from "@/components/reader/PurchasedEbooksTab";
import OrderHistoryTab from "@/components/reader/PurchaseHistoryTab";
import BookmarkTab from "@/components/reader/BookmarkPageTab";
import ProfileTab from "@/components/reader/UserProfileTab";
import { authClient } from "@/lib/auth-client";
import { Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const ReaderDashboard = () => {
  const [activeTab, setActiveTab] = useState("my-library");
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div className="h-screen flex items-center justify-center bg-[#09090b]"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      
      {/* ১. ফিক্সড সাইডবার (ডেস্কটপ) */}
      <aside className="hidden lg:block w-72 border-r border-zinc-800/60 h-screen sticky top-0 bg-[#0c0c0e]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="reader" />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* ২. ড্যাশবোর্ড হেডার (মোবাইল ও ডেস্কটপ) */}
        <header className="h-20 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 bg-[#ff1e6d] rounded-lg shadow-lg"><Menu size={20} /></button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[#0c0c0e] border-none text-white">
                   <SheetTitle className="hidden">Navigation</SheetTitle>
                   <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="reader" />
                </SheetContent>
              </Sheet>
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">
               Reader <span className="text-[#ff1e6d]">Panel</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 bg-[#111113] p-1.5 pr-4 rounded-full border border-zinc-800">
             <img src={session?.user?.image || "https://via.placeholder.com/150"} className="h-8 w-8 rounded-full border border-zinc-700 object-cover" />
             <span className="text-xs font-bold text-zinc-100 hidden sm:block">{session?.user?.name}</span>
          </div>
        </header>

        {/* ৩. মেইন কন্টেন্ট */}
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
           <div className="max-w-[1300px] mx-auto">
              {activeTab === "my-library" && <MyLibraryTab />}
              {activeTab === "order-history" && <OrderHistoryTab />}
              {activeTab === "bookmarks" && <BookmarkTab />}
              {activeTab === "profile" && <ProfileTab setActiveTab={setActiveTab} />}
           </div>
        </main>
      </div>
    </div>
  );
};

export default ReaderDashboard;