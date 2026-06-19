"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800/50">
      <div className="max-w-[85%] mx-auto flex items-center justify-between h-20">
        
        
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#ff1e6d] h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-pink-500/20">
            F
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">Fable</span>
        </Link>

        
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-medium text-white hover:text-[#ff1e6d] transition-colors">Home</Link>
          <Link href="/browse" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Browse Ebooks</Link>
          <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
        </div>

        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
          <Link href="/register">
            <Button className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-full px-8 h-11 font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;