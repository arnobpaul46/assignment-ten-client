"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push('/login');
          router.refresh();
        },
      },
    });
  };

  // রোল অনুযায়ী সঠিক ইউআরএল বের করা
  const getDashboardPath = () => {
    const role = session?.user?.role || "reader";
    return `/dashboard/${role}`;
  };

  return (
    <nav className="w-full bg-[#09090b] border-b border-zinc-800/60 sticky top-0 z-50 font-sans">
      <div className="max-w-[85%] mx-auto flex items-center justify-between h-20">
        
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#ff1e6d] h-9 w-9 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-pink-500/20 uppercase">
            F
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase italic">Fable</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-bold text-white hover:text-[#ff1e6d] transition-all uppercase tracking-widest">Home</Link>
          <Link href="/browse_books" className="text-sm font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest">Browse</Link>
          <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest">Dashboard</Link>
        </div>

        <div className="flex items-center gap-5">
          {isPending ? (
            <Loader2 className="animate-spin text-zinc-500" size={20} />
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Welcome!</p>
                <p className="text-sm text-white font-black italic uppercase leading-none mt-1">{session.user.name.split(' ')[0]}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-10 w-10 border-2 border-[#ff1e6d] p-0.5 cursor-pointer hover:scale-105 transition-all">
                    <AvatarImage src={session.user.image} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-zinc-800 text-white font-bold uppercase">
                      {session.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-52 bg-[#111113] border-zinc-800 text-white rounded-2xl p-1.5 mt-2 shadow-2xl">
                  <DropdownMenuLabel className="p-3">
                    <p className="text-sm font-black text-white uppercase italic">{session.user.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{session.user.email}</p>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-zinc-800/50" />
                  
                  {/* My Profile Button - সচল করা হয়েছে */}
                  <DropdownMenuItem 
                    onClick={() => router.push(`${getDashboardPath()}?tab=profile`)}
                    className="flex items-center p-3 rounded-xl cursor-pointer text-zinc-300 focus:bg-[#ff1e6d] focus:text-white transition-all font-bold uppercase text-[10px] tracking-widest"
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  
                  {/* Dashboard Button - সচল করা হয়েছে */}
                  <DropdownMenuItem 
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center p-3 rounded-xl cursor-pointer text-zinc-300 focus:bg-[#ff1e6d] focus:text-white transition-all font-bold uppercase text-[10px] tracking-widest"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>

                  {/* Settings বাদ দেওয়া হয়েছে */}

                  <DropdownMenuSeparator className="bg-zinc-800/50" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-xl cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-white transition-all font-black uppercase text-[10px] tracking-widest"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-widest">Login</Link>
              <Button asChild className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-full px-7 font-black h-10 transition-all active:scale-95 uppercase text-[10px] tracking-widest shadow-lg shadow-pink-500/10 border-none">
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