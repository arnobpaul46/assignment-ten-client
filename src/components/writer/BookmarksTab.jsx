"use client"
import React, { useState, useEffect } from 'react';
import { BookMarked, Loader2, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Cookies from 'js-cookie'; // কুকি ইমপোর্ট
import Link from 'next/link';

const BookmarksTab = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!session?.user?.email) return;
      
      const token = Cookies.get('access-token'); // টোকেন নেওয়া হলো
      
      try {
        const res = await fetch(`${SERVER_URL}/api/reader/my-bookmarks/${session.user.email}`, {
          headers: {
            authorization: `Bearer ${token}` // টোকেন হেডারে পাঠানো হলো
          }
        });
        const data = await res.json();
        setBookmarks(data);
        setLoading(false);
      } catch (err) {
        console.error("Bookmark fetch error:", err);
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [session, SERVER_URL]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
        Bookmarked <span className="text-[#ff1e6d]">Library</span>
      </h2>

      {bookmarks.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-zinc-800 rounded-[45px] bg-zinc-900/10">
           <p className="text-zinc-500 font-bold italic text-lg uppercase tracking-widest px-4">Your bookmarks list is empty</p>
           <Link href="/browse_books" className="text-[#ff1e6d] hover:text-white mt-4 inline-flex items-center gap-2 font-black uppercase text-xs transition-all underline underline-offset-8">
              Discover New Books <ArrowRight size={14} />
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarks.map((book) => (
            <div key={book._id} className="bg-[#111113] border border-zinc-800 rounded-[35px] p-4 group cursor-pointer hover:border-[#ff1e6d]/40 transition-all shadow-2xl relative overflow-hidden">
               <div className="aspect-[3/4] bg-zinc-900 rounded-[25px] mb-4 overflow-hidden relative border border-zinc-800">
                  <img src={book.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={book.title} />
                  <div className="absolute top-3 right-3 bg-[#ff1e6d] p-2.5 rounded-full shadow-lg">
                    <BookMarked size={16} className="text-white" fill="white" />
                  </div>
               </div>
               <div className="px-1">
                 <h4 className="text-white font-bold text-base mb-1 group-hover:text-[#ff1e6d] transition-colors italic truncate">"{book.title}"</h4>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">By {book.author}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksTab;