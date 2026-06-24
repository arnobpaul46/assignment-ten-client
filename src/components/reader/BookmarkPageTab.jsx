"use client"
import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Loader2, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const BookmarkPageTab = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeId, setRemoveId] = useState(null);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchBookmarks = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/reader/my-bookmarks/${session.user.email}`);
      const data = await res.json();
      setBookmarks(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (session) fetchBookmarks(); }, [session]);

  const confirmRemove = async () => {
    const res = await fetch(`${SERVER_URL}/api/reader/toggle-bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: removeId, userEmail: session.user.email })
    });
    if (res.ok) {
      toast.success("Bookmark removed");
      setBookmarks(bookmarks.filter(b => b.bookId !== removeId));
      setRemoveId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 px-2">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">My <span className="text-[#ff1e6d]">Bookmarks</span></h2>
      
      {loading ? (
         <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4.5] bg-zinc-900 rounded-[30px] animate-pulse"></div>)}
         </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#111113]/50 border-2 border-dashed border-zinc-800 rounded-[45px] text-center">
           <Heart size={40} className="text-[#ff1e6d] mb-6" fill="#ff1e6d" />
           <h3 className="text-2xl font-black text-white italic uppercase mb-2">Wishlist is Empty</h3>
           <Link href="/browse_books"><button className="bg-zinc-900 border border-zinc-700 text-zinc-500 hover:text-white px-10 py-4 rounded-[22px] font-black text-xs uppercase mt-6 flex items-center gap-3 transition-all">Go to Store <ArrowRight size={16} /></button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
          {bookmarks.map(book => (
            <div key={book._id} className="group relative">
               <div className="aspect-[3/4.5] rounded-[28px] md:rounded-[35px] overflow-hidden border border-zinc-800 shadow-2xl relative">
                  <img src={book.image} className="w-full h-full object-cover transition-all group-hover:scale-110 duration-700" alt="" />
                  <button onClick={() => setRemoveId(book.bookId)} className="absolute top-4 right-4 bg-[#ff1e6d] p-2.5 rounded-full text-white shadow-xl active:scale-90 transition-transform"><Bookmark size={18} fill="white" /></button>
                  <Link href={`/book/${book.bookId}`} className="absolute inset-0 bg-black/10"></Link>
               </div>
               <h4 className="mt-4 text-white font-bold text-sm italic truncate">"{book.title}"</h4>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!removeId} onOpenChange={() => setRemoveId(null)}>
        <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center">
            <Heart className="text-[#ff1e6d] mx-auto mb-4" size={40} fill="#ff1e6d" />
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Remove Bookmark?</DialogTitle>
            <div className="flex gap-3 mt-10"><button onClick={() => setRemoveId(null)} className="flex-1 bg-zinc-900 rounded-xl h-12 font-bold text-xs uppercase text-zinc-500">Cancel</button><button onClick={confirmRemove} className="flex-1 bg-[#ff1e6d] rounded-xl h-12 font-black text-xs uppercase shadow-lg shadow-pink-500/20 active:scale-95">Confirm</button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default BookmarkPageTab;