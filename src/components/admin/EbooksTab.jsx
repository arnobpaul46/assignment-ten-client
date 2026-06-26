"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Cookies from 'js-cookie';

const EbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchBooks = async () => {
    const token = Cookies.get('access-token');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/all-books`, {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBooks(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    const token = Cookies.get('access-token');
    const toastId = toast.loading("Updating visibility...");
    try {
      const res = await fetch(`${SERVER_URL}/api/writer/update-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Book is now ${newStatus}`, { id: toastId });
        fetchBooks();
      }
    } catch (err) { toast.error("Update failed", { id: toastId }); }
  };

  const confirmDelete = async () => {
    const token = Cookies.get('access-token');
    const toastId = toast.loading("Deleting book...");
    try {
      const res = await fetch(`${SERVER_URL}/api/writer/delete-book/${deleteId}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Book removed", { id: toastId });
        setBooks(books.filter(b => b._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) { toast.error("Delete failed", { id: toastId }); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none px-2">Global <span className="text-[#ff1e6d]">Moderation ({books.length})</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-zinc-800 h-16 text-left">
                <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] w-[45%]">Book & Writer</TableHead>
                <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] text-center w-[25%]">Visibility</TableHead>
                <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] w-[30%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <tr key={book._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-6 flex items-center gap-6 text-left">
                    <img src={book.image} className="w-14 h-20 object-cover rounded-xl border border-zinc-800 shadow-xl" />
                    <div><p className="text-lg italic font-black text-white">{book.title}</p><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Writer: {book.writerName}</p></div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center">
                      <Select onValueChange={(val) => handleStatusChange(book._id, val)} defaultValue={book.status}>
                        <SelectTrigger 
                          className={`w-[140px] h-10 text-[10px] font-black uppercase rounded-xl border-none ${
                            book.status === 'Published' ? 'bg-green-600 text-white' : 
                            book.status === 'Pending' ? 'bg-orange-500 text-white' : 
                            'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111113] border-zinc-800 text-white font-bold uppercase text-[10px]">
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
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center shadow-2xl">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-white">Permanently Delete?</DialogTitle>
            <DialogDescription className="text-zinc-500 mt-2 text-sm leading-relaxed">This book will be removed from Fable Store forever. You cannot undo this action.</DialogDescription>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl h-12 font-bold text-xs uppercase text-zinc-400 hover:text-white transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 rounded-xl h-12 font-black text-xs uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all">Delete Now</button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default EbooksTab;