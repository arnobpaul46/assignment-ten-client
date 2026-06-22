"use client"
import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, Bookmark, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from 'next/link';

const BookmarkPageTab = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchBookmarks = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/reader/my-bookmarks/${session.user.email}`);
      const data = await res.json();
      setBookmarks(data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  useEffect(() => { if (session) fetchBookmarks(); }, [session]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">My <span className="text-[#ff1e6d]">Bookmarks</span></h2>
      
      {/* --- EMPTY STATE START --- */}
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#111113]/50 border-2 border-dashed border-zinc-800 rounded-[45px] text-center">
           <div className="bg-[#ff1e6d]/10 p-6 rounded-full mb-6 border border-[#ff1e6d]/20">
              <Heart size={40} className="text-[#ff1e6d]" fill="#ff1e6d" />
           </div>
           <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">No bookmarks found</h3>
           <p className="text-zinc-500 text-sm mb-10 font-bold italic">"Save the stories that touch your heart."</p>
           <Link href="/browse_books">
              <button className="bg-zinc-900 border border-zinc-700 hover:border-[#ff1e6d] text-zinc-400 hover:text-white px-10 py-4 rounded-[22px] font-black text-xs uppercase transition-all flex items-center gap-3">
                Go to Store <ArrowRight size={16} />
              </button>
           </Link>
        </div>
      ) : (
        /* --- BOOKMARKS GRID --- */
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {bookmarks.map(book => (
            <div key={book._id} className="group relative">
               <Link href={`/book/${book.bookId}`}>
                 <div className="aspect-[3/4.5] rounded-[30px] overflow-hidden border border-zinc-800 shadow-2xl relative cursor-pointer">
                    <img src={book.image} className="w-full h-full object-cover transition-all group-hover:scale-110" alt="" />
                    <div className="absolute top-4 right-4 bg-[#ff1e6d] p-2 rounded-full text-white shadow-lg"><Bookmark size={16} fill="white" /></div>
                 </div>
               </Link>
               <h4 className="mt-4 text-white font-bold text-sm italic truncate">"{book.title}"</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default BookmarkPageTab;