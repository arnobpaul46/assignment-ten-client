"use client"
import React from 'react';
import { Heart, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookmarkPageTab = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">My <span className="text-[#ff1e6d]">Bookmarks</span></h2>
      
      {/* গ্যালারি ভিউ */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* নমুনা বুকমার্ক করা বই */}
        <div className="group relative bg-[#111113] p-4 rounded-[35px] border border-zinc-800 hover:border-[#ff1e6d]/50 transition-all shadow-2xl">
           <div className="aspect-[3/4.5] rounded-[25px] overflow-hidden border border-zinc-800 mb-4 relative">
              <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000" className="w-full h-full object-cover transition-all group-hover:scale-110" />
              {/* রিমুভ বাটন */}
              <button className="absolute top-3 right-3 bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition-all backdrop-blur-md">
                 <Trash2 size={14} />
              </button>
           </div>
           <h4 className="text-white font-bold text-sm mb-1 italic truncate">Whispers of Eternity</h4>
           <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Julian Thorne</p>
           
           <Button className="w-full bg-[#ff1e6d]/10 hover:bg-[#ff1e6d] text-[#ff1e6d] hover:text-white h-9 rounded-xl font-black text-[10px] uppercase transition-all">
              View Details
           </Button>
        </div>
      </div>
    </div>
  );
};
export default BookmarkPageTab;