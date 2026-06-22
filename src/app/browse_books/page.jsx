"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link'; // লিঙ্ক ইমপোর্ট করুন

const BrowsePage = () => {
  const [books, setBooks] = useState([]);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    fetch(`${SERVER_URL}/api/reader/all-books`)
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] py-20 px-10 text-white">
      <div className="max-w-[85%] mx-auto">
        <h2 className="text-5xl font-black italic mb-16 tracking-tighter">Discover <span className="text-[#ff1e6d]">Stories</span></h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {books.map(book => (
            <div key={book._id} className="group cursor-pointer">
              <Link href={`/book/${book._id}`}> {/* বইয়ের বিস্তারিত পেজে নিয়ে যাবে */}
                <div className="aspect-[3/4.5] rounded-[35px] overflow-hidden border border-zinc-800 mb-5 shadow-2xl relative">
                   <img src={book.image} className="w-full h-full object-cover transition-all group-hover:scale-110 duration-700" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-white">Click to view</div>
                </div>
              </Link>

              <h4 className="text-white font-bold text-lg mb-1 truncate italic">"{book.title}"</h4>
              <p className="text-zinc-500 text-[10px] mb-4 font-black uppercase tracking-widest">{book.writerName}</p>
              
              <Link href={`/book/${book._id}`}>
                <Button className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] h-11 rounded-xl font-black text-xs uppercase shadow-lg shadow-pink-500/10">
                  Read Now
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BrowsePage;