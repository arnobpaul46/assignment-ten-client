"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const EbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchBooks = async () => {
    const res = await fetch(`${SERVER_URL}/api/admin/all-books`);
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    const res = await fetch(`${SERVER_URL}/api/writer/update-status/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) { toast.success(`Status updated to ${newStatus}`); fetchBooks(); }
  };

  const confirmDelete = async () => {
    const res = await fetch(`${SERVER_URL}/api/admin/delete-book/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success("Ebook removed permanently");
      setBooks(books.filter(b => b._id !== deleteId));
      setDeleteId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter uppercase leading-none">Global <span className="text-[#ff1e6d]">Moderation</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] w-[40%] text-left">Cover & Title</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px] text-center w-[30%]">Visibility</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] w-[30%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <tr key={book._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02]">
                <td className="px-10 py-6 flex items-center gap-6 text-left">
                  <img src={book.image} className="w-14 h-20 object-cover rounded-xl border border-zinc-800 shadow-xl" />
                  <div><p className="text-lg italic font-black text-white">{book.title}</p><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Writer: {book.writerName}</p></div>
                </td>
                <td className="text-center">
                  <div className="flex justify-center items-center h-full">
                    <Select onValueChange={(val) => handleStatusChange(book._id, val)} defaultValue={book.status}>
                      <SelectTrigger className={`w-[140px] h-10 text-[10px] font-black uppercase rounded-xl border-none ${book.status === 'Published' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
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
                   <button onClick={() => setDeleteId(book._id)} className="h-10 w-10 bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all ml-auto active:scale-95 shadow-lg"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- EBOOK DELETE MODAL --- */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Permanently Delete?</DialogTitle>
            <DialogDescription className="text-zinc-500 mt-2">This ebook will be removed from Fable Store forever. This action is irreversible.</DialogDescription>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-zinc-900 rounded-xl h-12 font-bold text-xs uppercase">Keep Book</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 rounded-xl h-12 font-black text-xs uppercase shadow-lg shadow-red-500/20">Delete Now</button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default EbooksTab;