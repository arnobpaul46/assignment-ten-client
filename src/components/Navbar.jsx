"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full bg-black/60 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-[85%] mx-auto flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#ff1e6d] h-9 w-9 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,30,109,0.3)]">F</div>
          <span className="text-xl font-bold tracking-tighter text-white">Fable</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-medium text-white hover:text-[#ff1e6d] transition-all">Home</Link>
          <Link href="/browse" className="text-sm font-medium text-zinc-400 hover:text-white transition-all">Browse Ebooks</Link>
          <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-all">Dashboard</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-all">Login </Link>
          <Button asChild className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-full px-8 font-bold shadow-lg shadow-pink-500/20 border-none">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;