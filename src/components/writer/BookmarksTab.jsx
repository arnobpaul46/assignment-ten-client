"use client"
import React from 'react';
import { BookMarked } from "lucide-react";

const BookmarksTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black italic uppercase tracking-tighter">
        Bookmarked <span className="text-[#ff1e6d]">Library</span>
      </h2>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-[#111113] border border-zinc-800 rounded-[30px] p-4 group cursor-pointer hover:border-[#ff1e6d]/50 transition-all">
           <div className="aspect-[3/4] bg-zinc-900 rounded-2xl mb-4 overflow-hidden relative border border-zinc-800">
              <div className="absolute top-3 right-3 bg-[#ff1e6d] p-2 rounded-full shadow-lg">
                <BookMarked size={14} className="text-white" />
              </div>
              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs italic font-bold">
                 No Cover Preview
              </div>
           </div>
           <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#ff1e6d] transition-colors">Sample Ebook Title</h4>
           <p className="text-zinc-500 text-xs">Rena Voss</p>
        </div>
      </div>
    </div>
  );
};
export default BookmarksTab;