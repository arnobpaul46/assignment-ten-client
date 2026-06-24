"use client"
import React, { useEffect } from 'react';
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, Bell, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from 'js-cookie';

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
        return;
      }

      // ১. রোল প্রোটেকশন (অন্যের ড্যাশবোর্ডে ঢোকা বন্ধ করবে)
      const userRole = session.user.role || "reader";
      const isSupremeAdmin = session.user.email === "admin@fable.com";

      if (pathname.includes("/admin") && !isSupremeAdmin && userRole !== "admin") {
        router.push("/dashboard/writer");
      }
      if (pathname.includes("/writer") && userRole !== "writer" && !isSupremeAdmin) {
        router.push("/dashboard/reader");
      }

      // ২. কুকি টোকেন সিঙ্ক
      const token = Cookies.get('access-token');
      if (!token) {
        const syncToken = async () => {
          const response = await fetch(`${SERVER_URL}/api/jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          });
          const data = await response.json();
          if (data.token) {
            Cookies.set('access-token', data.token, { expires: 7 });
            window.location.reload(); 
          }
        };
        syncToken();
      }
    }
  }, [session, isPending, pathname, router, SERVER_URL]);

  if (isPending) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="animate-spin text-[#ff1e6d]" size={48} />
        <p className="text-[#ff1e6d] font-black uppercase text-xs animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  if (!session) return null;

  const role = pathname.includes("/admin") ? "admin" : pathname.includes("/writer") ? "writer" : "reader";

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      <aside className="hidden lg:block w-72 border-r border-zinc-800/60 h-screen sticky top-0 bg-[#0c0c0e]">
        <Sidebar role={role} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild><button className="p-2 bg-[#ff1e6d] rounded-lg shadow-lg active:scale-90"><Menu size={22} /></button></SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[#0c0c0e] border-none text-white"><SheetTitle className="hidden">Nav</SheetTitle><Sidebar role={role} /></SheetContent>
              </Sheet>
            </div>
            <div className="bg-[#ff1e6d] h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-pink-500/20">F</div>
            <span className="text-xl font-black italic tracking-tighter uppercase sm:block hidden">Fable <span className="text-[#ff1e6d]">{role}</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#111113] p-1.5 pr-4 rounded-full border border-zinc-800 shadow-xl">
               <Avatar className="h-8 w-8 border border-zinc-700">
                 <AvatarImage src={session?.user?.image} />
                 <AvatarFallback className="bg-zinc-800 text-xs">{session?.user?.name[0]}</AvatarFallback>
               </Avatar>
               <span className="text-xs font-bold text-white hidden md:block">{session?.user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-12 custom-scrollbar">
           {children}
        </main>
      </div>
    </div>
  );
}