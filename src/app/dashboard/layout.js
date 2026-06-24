"use client"
import React from 'react';
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, Bell, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import Cookies from 'js-cookie'; 
import { toast } from "sonner";

export default function DashboardLayout({ children }) {

  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  // src/app/dashboard/layout.js এর ভেতরে useEffect আপডেট করুন:

  useEffect(() => {
    // এখানে Cookies এখন ডিফাইন করা আছে
    const token = Cookies.get('access-token');

    const syncToken = async () => {
      if (session?.user && !token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          });
          const data = await response.json();
          if (data.token) {
            Cookies.set('access-token', data.token, { expires: 7 });
            // টোকেন পাওয়ার পর পেজটি একবার রিলোড দিবে যাতে ট্যাবগুলো ডাটা পায়
            window.location.reload();
          }
        } catch (err) {
          console.error("Cookie Sync Error:", err);
        }
      }
    };

    toast.dismiss(); 

    if (!isPending) syncToken();
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#ff1e6d]" size={48} />
        <p className="text-[#ff1e6d] font-black uppercase tracking-[5px] text-xs italic animate-pulse">
          Loading...
        </p>
      </div>
    );
  }


  if (!session) {
    router.push("/login");
    return null;
  }


  const role = pathname.includes("/admin") ? "admin" : pathname.includes("/writer") ? "writer" : "reader";

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white overflow-hidden font-sans">


      <aside className="hidden lg:block w-72 border-r border-zinc-800/60 h-screen sticky top-0 bg-[#0c0c0e]">
        <Sidebar role={role} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">


        <header className="h-20 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2.5 bg-[#ff1e6d] rounded-xl shadow-lg active:scale-90 transition-all">
                    <Menu size={22} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[#0c0c0e] border-none text-white">
                  <SheetTitle className="hidden">Navigation</SheetTitle>
                  <Sidebar role={role} />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#ff1e6d] h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-pink-500/20">F</div>
              <span className="text-xl font-black italic tracking-tighter uppercase sm:block hidden">
                Fable <span className="text-[#ff1e6d]">{role}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#111113] p-1.5 pr-4 rounded-full border border-zinc-800 shadow-xl">
              <Avatar className="h-8 w-8 border border-zinc-700">
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback className="bg-zinc-800 text-xs">U</AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-white hidden md:block">{session?.user?.name}</span>
            </div>
            <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Bell size={20} /></button>
          </div>
        </header>

        {/* মেইন কন্টেন্ট */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-12 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}