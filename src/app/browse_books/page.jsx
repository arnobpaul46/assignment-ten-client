"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const BrowsePage = () => {
  const [books, setBooks] = useState([]);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    fetch(`${SERVER_URL}/api/reader/all-books`)
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] py-20 px-10">
      <div className="max-w-[85%] mx-auto">
        <h2 className="text-4xl font-black text-white italic mb-12">Discover <span className="text-[#ff1e6d]">Stories</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {books.map(book => (
            <div key={book._id} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-[25px] overflow-hidden border border-zinc-800 mb-4 shadow-xl">
                 <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h4 className="text-white font-bold text-lg mb-1 truncate italic">"{book.title}"</h4>
              <p className="text-zinc-500 text-xs mb-3 font-medium uppercase tracking-widest">{book.writerName}</p>
              <Button className="w-full bg-[#ff1e6d] h-10 rounded-xl font-black text-xs uppercase">Read Now</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BrowsePage;