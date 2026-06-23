"use client"
import React, { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import { Trash2, Play, BookText, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useSearchParams } from 'next/navigation';

const PurchasedEbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams.get('purchase');

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

  useEffect(() => { 
    if (purchaseStatus === 'success' && session?.user?.email) {
      const savePurchase = async () => {
        toast.success("Order Successful! Welcome to your library.");
      };
      savePurchase();
    } fetchLibrary();
  }, [purchaseStatus,session]);

  
  const confirmRemove = async () => {
    if (!deleteId) return;
    const toastId = toast.loading("Removing book from library...");
    try {
      const res = await fetch(`${SERVER_URL}/api/reader/delete-purchase/${deleteId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Book removed", { id: toastId });
        setBooks(books.filter(b => b._id !== deleteId));
        setDeleteId(null); // মোডাল বন্ধ
      }
    } catch (err) { toast.error("Error deleting book", { id: toastId }); }
  };

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
          <Link href="/browse_books">
            <button className="bg-[#ff1e6d] text-white px-10 py-4 rounded-[22px] font-black text-xs uppercase shadow-lg shadow-pink-500/20 active:scale-95 transition-all flex items-center gap-3">
              Browse Books <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {books.map(book => (
            <div key={book._id} className="group relative">
              <div className="aspect-[3/4.5] rounded-[30px] overflow-hidden border border-zinc-800 shadow-2xl relative">
                <img src={book.image} className="w-full h-full object-cover transition-all group-hover:scale-110 duration-700" alt="" />


                <button
                  onClick={() => setDeleteId(book._id)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 p-2.5 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl z-10"
                >
                  <Trash2 size={14} />
                </button>

                <Link href={`/book/${book.bookId}`}>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                    <div className="bg-[#ff1e6d] p-4 rounded-full shadow-2xl shadow-pink-500/50 scale-75 group-hover:scale-100 transition-all"><Play fill="white" size={24} /></div>
                  </div>
                </Link>
              </div>
              <h4 className="mt-4 text-white font-bold text-sm italic truncate">"{book.title}"</h4>
            </div>
          ))}
        </div>
      )}

      
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center">
          <div className="bg-red-500/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Remove Book?</DialogTitle>
          <DialogDescription className="text-zinc-500 mt-2 text-sm">You will lose access to read this book from your library.</DialogDescription>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setDeleteId(null)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl h-12 font-bold text-xs uppercase text-zinc-400">Cancel</button>
            <button onClick={confirmRemove} className="flex-1 bg-red-600 rounded-xl h-12 font-black text-xs uppercase shadow-lg shadow-red-600/20 active:scale-95">Remove</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchasedEbooksTab;