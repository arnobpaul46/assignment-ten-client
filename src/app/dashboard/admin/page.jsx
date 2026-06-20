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

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("analytics");
  const { data: session } = authClient.useSession();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      
      {/* বাম পাশে ফিক্সড সাইডবার (ডেস্কটপ) */}
      <aside className="hidden lg:block w-72 border-r border-zinc-800/60 h-screen sticky top-0 bg-[#0c0c0e]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* হেডার - কালার একদম বডির সাথে ফিক্সড */}
        <header className="h-20 border-b border-zinc-800/60 bg-[#09090b] sticky top-0 z-50 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 bg-[#ff1e6d] rounded-lg active:scale-95"><Menu size={20} /></button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[#0c0c0e] border-zinc-800 text-white">
                   <SheetTitle className="hidden">Menu</SheetTitle>
                   <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={true} />
                </SheetContent>
              </Sheet>
            </div>
            <span className="text-xl font-black italic tracking-tighter text-white uppercase">
              Admin <span className="text-[#ff1e6d]">Panel</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#111113] p-1.5 pr-4 rounded-full border border-zinc-800/80">
               <Avatar className="h-8 w-8 border border-zinc-700">
                 <AvatarImage src={session?.user?.image} />
                 <AvatarFallback className="bg-zinc-800 text-white text-[10px]">AD</AvatarFallback>
               </Avatar>
               <span className="text-xs font-bold text-white hidden sm:block">{session?.user?.name}</span>
            </div>
          </div>
        </header>

        {/* মেইন ডাইনামিক এরিয়া */}
        <main className="flex-1 p-6 lg:p-10">
           <div className="max-w-[1400px] mx-auto">
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