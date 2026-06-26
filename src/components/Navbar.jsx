"use client"
import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, User, LayoutDashboard, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Cookies from 'js-cookie';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    authClient.signOut()
      .then(() => {
        Cookies.remove('access-token');
        toast.success("Logged out successfully", { id: toastId });
        router.push('/login');
        router.refresh();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Logout failed.", { id: toastId });
      });
  };

  const getDashboardPath = () => {
    const role = session?.user?.role || "reader";
    return `/dashboard/${role}`;
  };


  const isActive = (path) => pathname === path;

  return (
    <nav className="w-full bg-[#09090b] border-b border-zinc-800/60 sticky top-0 z-50 font-sans">
      <div className="max-w-[85%] mx-auto flex items-center justify-between h-20">

        <Link href="/" className="flex items-center gap-2 border-b-2 border-[#ff1e6d]">

          <div className="flex h-10 w-10 items-center justify-center ">
            <svg className=" h-10 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title xmlns="">accusoft</title><path fill="currentColor" d="m14.177 4.214l-4.366.022c-.618.005-.776-.004-.874.11c-.051.06-.133.164.154.524c.286.358 8.777 11.221 8.993 11.481c.273.331.527.445.638.463c.178.026.4-.067.52-.114c.118-.047 4.324-1.785 4.416-1.834c.14-.076.13-.289.037-.447a4 4 0 0 0-.307-.429c-.08-.096-7.69-9.195-7.77-9.295c-.147-.185-.36-.36-.445-.39c-.084-.029-.204-.093-.996-.09m-4.015 5.132s-.449.06-.943.562c-.337.35-9.077 8.949-9.124 9.016c-.042.06-.147.175-.064.24c.042.033.451-.1.656-.174c.029 0 4.293-1.36 4.293-1.36c.02-.023-.003-.003.022-.02c-.013-.19-.029-.98-.036-1.036c-.02-.158.056-.223.11-.259c.053-.035.153-.075.153-.075l3.47-1.265c.023-.029 3.32-3.064 3.384-3.122v-.042c-.029-.022-.04-.06-.064-.087c-.016-.006-1.857-2.385-1.857-2.378m1.85 5.062c-.116.009-.36.029-.542.109s-5.443 1.979-5.632 2.052s-.427.133-.414.285c.007.093.074.1.174.13c.1.034 11.278 2.522 11.548 2.578c.269.055 1.129.293 1.576.204a1.04 1.04 0 0 0 .431-.14c.078-.047 4.642-2.85 4.716-2.904c.07-.053.122-.089.13-.175c.005-.033-.09-.11-.195-.131l-1.114-.218l-.309-.056s-4.31 1.89-4.406 1.934a.94.94 0 0 1-.445.087c-.316-.029-.558-.207-.93-.633l-2.138-2.773s-.936-.151-1.267-.196c-.332-.044-1.067-.16-1.183-.153" /></svg>
          </div>
          <span className="text-xl font-bold uppercase tracking-wider text-white">
            Fable
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className={`text-sm font-bold uppercase tracking-widest transition-all ${isActive('/') ? 'text-[#ff1e6d]' : 'text-zinc-400 hover:text-white'}`}
          >
            Home
          </Link>

          <Link
            href="/browse_books"
            className={`text-sm font-bold uppercase tracking-widest transition-all ${isActive('/browse_books') ? 'text-[#ff1e6d]' : 'text-zinc-400 hover:text-white'}`}
          >
            Browse
          </Link>

          <Link
            href="/dashboard"
            className={`text-sm font-bold uppercase tracking-widest transition-all ${pathname.startsWith('/dashboard') ? 'text-[#ff1e6d]' : 'text-zinc-400 hover:text-white'}`}
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-5">
          {isPending ? (
            <Loader2 className="animate-spin text-zinc-500" size={20} />
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">Welcome!</p>
                <p className="text-sm text-white font-black italic uppercase leading-none mt-1">{session.user.name.split(' ')[0]}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-10 w-10 border-2 border-[#ff1e6d] p-0.5 cursor-pointer hover:scale-105 transition-all">
                    <AvatarImage src={session.user.image} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-zinc-800 text-white font-bold uppercase">{session.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-52 bg-[#111113] border-zinc-800 text-white rounded-2xl p-1.5 mt-2 shadow-2xl">
                  <DropdownMenuLabel className="p-3">
                    <p className="text-sm font-black text-white uppercase italic">{session.user.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{session.user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800/50" />
                  <DropdownMenuItem onClick={() => router.push(`${getDashboardPath()}?tab=profile`)} className="flex items-center p-3 rounded-xl cursor-pointer text-zinc-300 focus:bg-[#ff1e6d] focus:text-white transition-all font-bold uppercase text-[10px] tracking-widest"><User className="mr-3 h-4 w-4" /><span>My Profile</span></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="flex items-center p-3 rounded-xl cursor-pointer text-zinc-300 focus:bg-[#ff1e6d] focus:text-white transition-all font-bold uppercase text-[10px] tracking-widest"><LayoutDashboard className="mr-3 h-4 w-4" /><span>Dashboard</span></DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800/50" />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center p-3 rounded-xl cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-white transition-all font-black uppercase text-[10px] tracking-widest"><LogOut className="mr-3 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={`text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${isActive('/login') ? 'text-[#ff1e6d]' : 'text-zinc-400 hover:text-white'}`}>Login</Link>
              <Button asChild className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-full px-4 md:px-5 font-black h-10 transition-all active:scale-95 uppercase text-[10px] md:text-sm tracking-widest shadow-lg shadow-pink-500/10 border-none">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;