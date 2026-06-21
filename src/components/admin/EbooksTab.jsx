"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const EbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // যে বই ডিলিট হবে তার আইডি
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // সব বই ফেচ করার ফাংশন
  const fetchBooks = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/all-books`);
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load ebooks");
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  // স্ট্যাটাস পরিবর্তনের ফাংশন
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/writer/update-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Book is now ${newStatus}`);
        fetchBooks();
      }
    } catch (err) { toast.error("Status update failed"); }
  };

  // ডিলিট কনফার্ম করার আসল ফাংশন (এটিই আপনার সমস্যা ছিল)
  const confirmDelete = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("Deleting ebook permanently...");
    try {
      // ব্যাকেন্ড এপিআই কল (আপনার সার্ভার কোড অনুযায়ী পাথ /api/writer/delete-book/:id)
      const res = await fetch(`${SERVER_URL}/api/writer/delete-book/${deleteId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Ebook removed from Fable Store", { id: toastId });
        // ডিলিট হওয়ার পর UI থেকে ঐ বইটি সরিয়ে দেওয়া
        setBooks(prevBooks => prevBooks.filter(book => book._id !== deleteId));
        setDeleteId(null); // মোডাল বন্ধ করা
      } else {
        throw new Error("Failed to delete from server");
      }
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Global <span className="text-[#ff1e6d]">Moderation</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] w-[45%] text-left">Book & Writer</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px] text-center w-[25%]">Visibility</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] w-[30%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
               <TableRow><TableCell colSpan={3} className="text-center py-20 text-zinc-600 italic font-bold">No books found in database.</TableCell></TableRow>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-6 flex items-center gap-6">
                    <img src={book.image} className="w-14 h-20 object-cover rounded-xl border border-zinc-800 shadow-xl" alt="" />
                    <div>
                      <p className="text-lg italic font-black text-white leading-tight mb-1">{book.title}</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Writer: {book.writerName || 'Fable Writer'}</p>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <Select onValueChange={(val) => handleStatusChange(book._id, val)} defaultValue={book.status}>
                        <SelectTrigger className={`w-[140px] h-10 text-[10px] font-black uppercase rounded-xl border-none ${book.status === 'Published' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111113] border-zinc-800 text-white font-bold">
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Unpublished">Unpublished</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="text-right px-10">
                     {/* এখানে ডিলিট আইডি সেট করা হচ্ছে */}
                     <button onClick={() => setDeleteId(book._id)} className="h-11 w-11 bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all ml-auto active:scale-95 shadow-lg">
                        <Trash2 size={18}/>
                     </button>
                  </td>
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- EBOOK DELETE MODAL (Fixed) --- */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center">
            <div className="bg-red-500/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
               <AlertTriangle className="text-red-500" size={32} />
            </div>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Permanently Delete?</DialogTitle>
            <DialogDescription className="text-zinc-500 mt-2 text-sm">This book will be removed from the store front forever. You cannot undo this action.</DialogDescription>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl h-12 font-bold text-xs uppercase text-zinc-400 hover:text-white transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 rounded-xl h-12 font-black text-xs uppercase shadow-lg shadow-red-600/20 active:scale-95 transition-all">Confirm Delete</button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EbooksTab;