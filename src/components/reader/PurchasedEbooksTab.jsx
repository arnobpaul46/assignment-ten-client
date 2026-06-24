"use client"
import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import { Trash2, Play, BookText, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PurchasedEbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams.get('purchase');
  const sessionId = searchParams.get('session_id');

  const fetchLibrary = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/reader/my-library/${session.user.email}`);
      const data = await res.json();
      setBooks(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (purchaseStatus === 'success' && sessionId && session?.user?.email) {
      const verifyAndSave = async () => {
        const toastId = toast.loading("Verifying your payment...");
        try {
          const res = await fetch(`${SERVER_URL}/api/reader/verify-purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          if (res.ok) {
            toast.success("Purchase Confirmed!", { id: toastId });
            router.replace('/dashboard/reader?tab=my-library');
            fetchLibrary();
          }
        } catch (err) { toast.error("Verification failed"); }
      };
      verifyAndSave();
    } else { fetchLibrary(); }
  }, [purchaseStatus, sessionId, session]);

  const confirmRemove = async () => {
    const res = await fetch(`${SERVER_URL}/api/reader/delete-purchase/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success("Removed from library");
      setBooks(books.filter(b => b._id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none px-2">My <span className="text-[#ff1e6d]">Library</span></h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {[1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4.5] bg-zinc-900 rounded-[30px] animate-pulse"></div>)}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#111113]/50 border-2 border-dashed border-zinc-800 rounded-[45px] text-center">
          <BookText size={40} className="text-[#ff1e6d] mb-6" />
          <h3 className="text-2xl font-black text-white italic uppercase">No books owned</h3>
          <button onClick={() => router.push('/browse_books')} className="bg-[#ff1e6d] text-white px-10 py-4 rounded-[22px] font-black text-xs uppercase mt-10 flex items-center gap-3">Browse Books <ArrowRight size={16} /></button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
          {books.map(book => (
            <div key={book._id} className="group relative">
              <div className="aspect-[3/4.5] rounded-[28px] md:rounded-[35px] overflow-hidden border border-zinc-800 shadow-2xl relative">
                <img src={book.image} className="w-full h-full object-cover transition-all group-hover:scale-110 duration-700" alt="" />
                <button onClick={() => setDeleteId(book._id)} className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 z-20 transition-all"><Trash2 size={14} /></button>
                <Link href={`/book/${book.bookId}`} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                    <div className="bg-[#ff1e6d] p-4 rounded-full scale-75 group-hover:scale-100 transition-all shadow-pink-500/50 shadow-2xl"><Play fill="white" size={20} /></div>
                </Link>
              </div>
              <h4 className="mt-4 text-white font-bold text-sm italic truncate px-1">"{book.title}"</h4>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
          <DialogTitle className="text-xl font-black uppercase tracking-tighter">Remove from Library?</DialogTitle>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setDeleteId(null)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl h-12 font-bold text-xs uppercase text-zinc-500">Cancel</button>
            <button onClick={confirmRemove} className="flex-1 bg-red-600 rounded-xl h-12 font-black text-xs uppercase shadow-lg shadow-red-600/20 active:scale-95">Remove</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PurchasedEbooksTab;