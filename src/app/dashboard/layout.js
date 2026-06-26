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

      
      const userRole = session.user.role || "reader";
      const isSupremeAdmin = session.user.email === "admin@fable.com";

      if (pathname.includes("/admin") && !isSupremeAdmin && userRole !== "admin") {
        router.push("/dashboard/writer");
      }
      if (pathname.includes("/writer") && userRole !== "writer" && !isSupremeAdmin) {
        router.push("/dashboard/reader");
      }

      
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
            <div className=" h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs "><svg className=" h-10 "  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title xmlns="">accusoft</title><path fill="currentColor" d="m14.177 4.214l-4.366.022c-.618.005-.776-.004-.874.11c-.051.06-.133.164.154.524c.286.358 8.777 11.221 8.993 11.481c.273.331.527.445.638.463c.178.026.4-.067.52-.114c.118-.047 4.324-1.785 4.416-1.834c.14-.076.13-.289.037-.447a4 4 0 0 0-.307-.429c-.08-.096-7.69-9.195-7.77-9.295c-.147-.185-.36-.36-.445-.39c-.084-.029-.204-.093-.996-.09m-4.015 5.132s-.449.06-.943.562c-.337.35-9.077 8.949-9.124 9.016c-.042.06-.147.175-.064.24c.042.033.451-.1.656-.174c.029 0 4.293-1.36 4.293-1.36c.02-.023-.003-.003.022-.02c-.013-.19-.029-.98-.036-1.036c-.02-.158.056-.223.11-.259c.053-.035.153-.075.153-.075l3.47-1.265c.023-.029 3.32-3.064 3.384-3.122v-.042c-.029-.022-.04-.06-.064-.087c-.016-.006-1.857-2.385-1.857-2.378m1.85 5.062c-.116.009-.36.029-.542.109s-5.443 1.979-5.632 2.052s-.427.133-.414.285c.007.093.074.1.174.13c.1.034 11.278 2.522 11.548 2.578c.269.055 1.129.293 1.576.204a1.04 1.04 0 0 0 .431-.14c.078-.047 4.642-2.85 4.716-2.904c.07-.053.122-.089.13-.175c.005-.033-.09-.11-.195-.131l-1.114-.218l-.309-.056s-4.31 1.89-4.406 1.934a.94.94 0 0 1-.445.087c-.316-.029-.558-.207-.93-.633l-2.138-2.773s-.936-.151-1.267-.196c-.332-.044-1.067-.16-1.183-.153" /></svg></div>
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