"use client"
import React from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, Bell, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const { data: session } = authClient.useSession();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      
      {/* বাম পাশে সাইডবার (ডেস্কটপ) */}
      <aside className="hidden lg:block w-72 border-r border-zinc-800/50 h-screen sticky top-0 bg-[#0c0c0e]">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ড্যাশবোর্ড হেডার */}
        <header className="h-20 border-b border-zinc-800/50 bg-[#09090b] sticky top-0 z-50 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 bg-[#ff1e6d] rounded-lg"><Menu size={20} /></button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[#0c0c0e] border-zinc-800 text-white">
                   <SheetTitle className="hidden">Menu</SheetTitle>
                   <Sidebar isMobile={true} />
                </SheetContent>
              </Sheet>
            </div>
            
            {/* লোগো (Header এ রাখা হয়েছে যেহেতু সাইডবার থেকে বাদ দেওয়া হয়েছে) */}
            <div className="flex items-center gap-2">
               <div className="bg-[#ff1e6d] h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-pink-500/20">F</div>
               <span className="text-xl font-bold tracking-tighter italic">Fable Admin</span>
            </div>
          </div>

          {/* ডান পাশে প্রোফাইল */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-white"><Bell size={20} /></button>
            <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 pr-4 rounded-full border border-zinc-800">
               <Avatar className="h-8 w-8 border border-zinc-700">
                 <AvatarImage src={session?.user?.image} />
                 <AvatarFallback className="bg-zinc-800">RV</AvatarFallback>
               </Avatar>
               <div className="hidden sm:block text-left">
                  <p className="text-[10px] text-zinc-500 font-bold leading-none uppercase">Admin</p>
                  <p className="text-xs font-bold text-white">{session?.user?.name}</p>
               </div>
            </div>
          </div>
        </header>

        {/* মেইন কন্টেন্ট এলাকা */}
        <main className="flex-1 p-6 lg:p-10 bg-[#09090b]">
           <div className="max-w-[1400px] mx-auto">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}