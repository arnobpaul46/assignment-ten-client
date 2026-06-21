"use client"
import React from 'react';
import { BookOpen, Play } from "lucide-react";

const PurchasedEbooksTab = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">My <span className="text-[#ff1e6d]">Library</span></h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* নমুনা বই - এটি ডাটাবেস থেকে আসবে */}
        <div className="group cursor-pointer">
           <div className="aspect-[3/4.5] rounded-[30px] overflow-hidden border border-zinc-800 mb-4 shadow-2xl relative">
              <img src="https://images.unsplash.com/photo-1543004471-240ce4e12159?q=80&w=1000" className="w-full h-full object-cover transition-all group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                 <div className="bg-[#ff1e6d] p-4 rounded-full shadow-pink-500/50 shadow-2xl"><Play fill="white" size={20} /></div>
              </div>
           </div>
           <h4 className="text-white font-bold text-sm mb-1 italic">The Crimson Letter</h4>
           <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Elias Thorne</p>
        </div>
      </div>
    </div>
  );
};
export default PurchasedEbooksTab;