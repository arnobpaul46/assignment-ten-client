"use client"
import React, { useState } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import UsersTab from "@/components/admin/UsersTab";
import EbooksTab from "@/components/admin/EbooksTab";
import TransactionsTab from "@/components/admin/TransactionsTab";
import { Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const { data: session } = authClient.useSession();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white overflow-hidden">
      
      {/* ১. ডেস্কটপ সাইডবার */}
      <aside className="hidden lg:block w-72 border-r border-zinc-800/60 h-screen sticky top-0 bg-[#0c0c0e]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="admin" />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        
        {/* ২. রেসপন্সিভ ফিক্সড হেডার */}
        <header className="h-20 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2.5 bg-[#ff1e6d] rounded-xl shadow-lg active:scale-90 transition-all">
                    <Menu size={20} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[#0c0c0e] border-none text-white">
                   <SheetTitle className="hidden">Admin Menu</SheetTitle>
                   <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); }} role="admin" />
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-2">
               <div className="bg-[#ff1e6d] h-9 w-9 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-pink-500/20">F</div>
               <span className="text-xl font-black italic tracking-tighter uppercase hidden sm:block">Admin <span className="text-[#ff1e6d]">Panel</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#111113] p-1.5 pr-4 rounded-full border border-zinc-800 shadow-xl">
               <Avatar className="h-8 w-8 border border-zinc-700">
                 <AvatarImage src={session?.user?.image} />
                 <AvatarFallback className="bg-zinc-800 text-xs">AD</AvatarFallback>
               </Avatar>
               <span className="text-xs font-bold text-white hidden md:block">{session?.user?.name}</span>
            </div>
          </div>
        </header>

        {/* ৩. স্ক্রলেবল মেইন এরিয়া */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
           <div className="max-w-[1400px] mx-auto pb-20">
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "manage-users" && <UsersTab />}
              {activeTab === "all-ebooks" && <EbooksTab />}
              {activeTab === "transactions" && <TransactionsTab />}
           </div>
        </main>
      </div>
    </div>
  );
}