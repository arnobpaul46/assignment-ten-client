"use client"
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 font-sans">
      

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff1e6d]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 text-center space-y-8 max-w-lg">
        
        
        <div className="bg-red-500/10 h-24 w-24 rounded-[30px] flex items-center justify-center mx-auto border border-red-500/20 shadow-2xl">
           <AlertTriangle className="text-red-500" size={48} />
        </div>


        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
            Something <span className="text-[#ff1e6d]">went wrong!</span>
          </h2>
          <p className="text-zinc-500 font-medium italic">
            An unexpected error occurred while loading this page. Don't worry, every story has a plot twist.
          </p>
        </div>

        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={() => reset()} 
            className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-16 w-full sm:w-56 rounded-2xl font-black text-sm uppercase flex gap-3 shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
          >
            <RefreshCcw size={18} /> Reload Page
          </Button>
          
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 h-16 w-full sm:w-56 rounded-2xl font-black text-sm uppercase hover:bg-zinc-800 text-zinc-400">
               <Home size={18} /> Back to Home
            </Button>
          </Link>
        </div>

        
        <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[4px] pt-10">
          System Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    </div>
  );
}