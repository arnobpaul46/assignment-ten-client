"use client"
import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import { Play, BookText, ArrowRight, Loader2 } from "lucide-react";
import Link from 'next/link';

const PurchasedEbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchLibrary = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/reader/my-library/${session.user.email}`);
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (err) { 
      console.error(err); 
      setLoading(false); 
    }
  };

  useEffect(() => { if (session) fetchLibrary(); }, [session]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">My <span className="text-[#ff1e6d]">Library</span></h2>
      
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#111113]/50 border-2 border-dashed border-zinc-800 rounded-[45px] text-center">
           <div className="bg-[#ff1e6d]/10 p-6 rounded-full mb-6 border border-[#ff1e6d]/20">
              <BookText size={40} className="text-[#ff1e6d]" />
           </div>
           <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Library is Empty</h3>
           <p className="text-zinc-500 text-sm mb-10 font-bold italic">Start your collection by purchasing a book.</p>
           <Link href="/browse_books">
              <button className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white px-10 py-4 rounded-[22px] font-black text-xs uppercase shadow-lg shadow-pink-500/20 transition-all flex items-center gap-3">
                Browse Store <ArrowRight size={16} />
              </button>
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {books.map(book => (
            /* --- এখানে href='/book/${book.bookId}' ব্যবহার করা হয়েছে --- */
            <Link href={`/book/${book.bookId}`} key={book._id} className="group relative cursor-pointer block">
               <div className="aspect-[3/4.5] rounded-[30px] overflow-hidden border border-zinc-800 shadow-2xl relative">
                  <img src={book.image} className="w-full h-full object-cover transition-all group-hover:scale-110 duration-700" alt={book.title} />
                  
                  {/* হোভার করলে প্লে আইকন আসবে */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <div className="bg-[#ff1e6d] p-4 rounded-full shadow-2xl shadow-pink-500/50 scale-75 group-hover:scale-100 transition-all">
                         <Play fill="white" size={24} />
                      </div>
                  </div>
               </div>
               
               <div className="mt-4 px-1">
                 <h4 className="text-white font-bold text-sm italic truncate group-hover:text-[#ff1e6d] transition-colors">"{book.title}"</h4>
                 <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-1">Purchased</p>
               </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasedEbooksTab;