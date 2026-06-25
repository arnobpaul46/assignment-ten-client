"use client"
import Link from 'next/link';
import { Home, Search, LayoutDashboard, PenTool, Bookmark, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#09090b] text-white flex items-center justify-center font-sans selection:bg-[#ff1e6d] px-6 relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ডের বড় আলংকারিক অক্ষর "4" */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[25rem] md:text-[40rem] font-black text-white/[0.02] pointer-events-none select-none italic z-0">4</div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[25rem] md:text-[40rem] font-black text-white/[0.02] pointer-events-none select-none italic z-0">4</div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 py-10">
         
         {/* বাম পাশের মেসেজ সেকশন */}
         <div className="space-y-8 border-l-4 border-[#ff1e6d] pl-8 md:pl-12">
            <div className="inline-flex items-center gap-2 bg-[#ff1e6d]/10 border border-[#ff1e6d]/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff1e6d]">
               <AlertCircle size={12} /> 404 Error
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
              This <br /> chapter <br /> <span className="text-[#ff1e6d]">is blank.</span>
            </h2>
            
            <p className="text-zinc-500 text-lg max-w-md italic leading-relaxed font-medium">
              The page you're looking for doesn't exist — or it was removed. Every story has a few missing pages. Let's write a new one.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Link href="/">
                  <Button className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-14 w-full sm:w-56 rounded-2xl font-black text-sm uppercase shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
                     Return Home
                  </Button>
               </Link>
               <Link href="/browse_books">
                  <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 h-14 w-full sm:w-56 rounded-2xl font-black text-sm uppercase hover:bg-zinc-800 text-zinc-400 hover:text-white">
                     Search Ebooks
                  </Button>
               </Link>
            </div>
         </div>

         {/* ডান পাশের ড্রয়ার স্টাইল মেনু */}
         <div className="hidden lg:block space-y-6">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[4px] ml-4">Where to next?</p>
            <div className="grid gap-4">
               {[
                 { n: "Home", i: Home, d: "Back to start", h: "/" },
                 { n: "Browse", i: Search, d: "Explore library", h: "/browse_books" },
                 { n: "Dashboard", i: LayoutDashboard, d: "Go to your space", h: "/dashboard" },
               ].map((item) => (
                 <Link key={item.n} href={item.h} className="group flex items-center gap-6 p-5 bg-[#111113] border border-white/5 rounded-[30px] hover:bg-[#ff1e6d] transition-all duration-500">
                    <div className="h-12 w-12 bg-zinc-900 rounded-2xl flex items-center justify-center group-hover:bg-white/20">
                      <item.i size={22} className="text-zinc-500 group-hover:text-white" />
                    </div>
                    <div>
                       <h4 className="text-white font-black uppercase italic text-lg leading-none mb-1">{item.n}</h4>
                       <p className="text-zinc-600 group-hover:text-white/60 text-[10px] font-bold uppercase tracking-widest">{item.d}</p>
                    </div>
                    <ArrowRight className="ml-auto text-zinc-800 group-hover:text-white group-hover:translate-x-2 transition-all" size={20} />
                 </Link>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}