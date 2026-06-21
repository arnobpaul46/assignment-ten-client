"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, AlertTriangle, Loader2, BookOpen, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MyEbooksTab = ({ setActiveTab }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [deleteId, setDeleteId] = useState(null); 
  const [editBook, setEditBook] = useState(null); 

  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchMyBooks = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/writer/my-books/${session.user.email}`);
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (session) fetchMyBooks(); }, [session]);

  const confirmDelete = async () => {
    const toastId = toast.loading("Removing book...");
    try {
      const res = await fetch(`${SERVER_URL}/api/writer/delete-book/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Book deleted permanently", { id: toastId });
        setBooks(books.filter(b => b._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) { toast.error("Error deleting book", { id: toastId }); }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Saving changes...");
    try {
      const res = await fetch(`${SERVER_URL}/api/writer/update-book/${editBook._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editBook)
      });
      if (res.ok) {
        toast.success("Book updated!", { id: toastId });
        setEditBook(null);
        fetchMyBooks();
      }
    } catch (err) { toast.error("Failed to update", { id: toastId }); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* --- WRITER PROFILE SECTION (Aligned) --- */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            <Avatar className="h-24 w-24 border-4 border-[#ff1e6d] p-1 shadow-lg shadow-pink-500/20">
              <AvatarImage src={session?.user?.image} className="rounded-full object-cover" />
              <AvatarFallback className="bg-zinc-800 text-white font-black text-2xl uppercase">{session?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <button onClick={() => setActiveTab("profile")} className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">
               <Settings size={14} />
            </button>
          </div>
          <div className="text-left">
            <p className="text-[#ff1e6d] text-[10px] font-black uppercase tracking-[5px] mb-1">Authenticated Writer</p>
            <h3 className="text-3xl font-black text-white italic tracking-tighter leading-tight">{session?.user?.name}</h3>
            <p className="text-zinc-500 text-xs mt-2 font-medium italic tracking-wide">{session?.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
           <div className="bg-black/40 border border-zinc-800 px-8 py-3.5 rounded-[22px] text-center min-w-[120px]">
              <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-1">Total Books</p>
              <p className="text-2xl font-black text-white">{books.length}</p>
           </div>
           <button onClick={() => setActiveTab("add-ebook")} className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white px-8 py-4 rounded-[22px] font-black text-xs uppercase shadow-lg shadow-pink-500/10 active:scale-95 transition-all">
             Publish New
           </button>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-2">
         <BookOpen className="text-[#ff1e6d]" size={24} />
         <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">My Publications</h2>
      </div>

      {/* --- BOOKS TABLE (Perfectly Aligned) --- */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[40px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="text-zinc-100 font-black px-10 uppercase text-[11px] w-[50%] text-left">Book & Cover</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px] text-center w-[20%]">Status</TableHead>
              <TableHead className="text-right px-10 font-black uppercase text-[11px] w-[30%]">Actions Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-20 text-zinc-600 italic">No books found in your library.</TableCell></TableRow>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-6 text-left">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-20 rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900 shrink-0">
                        <img src={book.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-bold text-zinc-100 text-lg italic tracking-tight leading-tight">{book.title}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <Badge className={`${book.status === 'Published' ? 'bg-green-600' : 'bg-orange-600'} text-white font-black text-[10px] uppercase px-4 py-1.5 rounded-lg shadow-lg border-none`}>
                      {book.status}
                    </Badge>
                  </td>
                  <td className="text-right px-10 py-6">
                    <div className="flex justify-end gap-3 items-center">
                      <button onClick={() => setEditBook(book)} className="h-11 bg-zinc-100 text-black font-black text-[10px] uppercase rounded-2xl px-6 hover:bg-white transition-all shadow-md active:scale-95">Edit</button>
                      <button onClick={() => setDeleteId(book._id)} className="h-11 w-11 bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all active:scale-95">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- DELETE MODAL (No Change) --- */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[30px] p-8 max-w-sm text-center">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
            <DialogTitle className="text-xl font-black uppercase italic">Delete this Book?</DialogTitle>
            <DialogDescription className="text-zinc-500 mt-2">This ebook will be permanently removed from Fable Store.</DialogDescription>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-zinc-900 rounded-xl h-12 font-bold text-xs">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 rounded-xl h-12 font-black text-xs uppercase shadow-lg">Confirm Delete</button>
            </div>
        </DialogContent>
      </Dialog>

      {/* --- EDIT MODAL (No Change) --- */}
      <Dialog open={!!editBook} onOpenChange={() => setEditBook(null)}>
        {editBook && (
          <DialogContent className="bg-[#111113] border-zinc-800 text-white rounded-[30px] p-10 max-w-lg">
             <DialogHeader><DialogTitle className="text-2xl font-black italic">Edit <span className="text-[#ff1e6d]">Book Details</span></DialogTitle></DialogHeader>
             <form onSubmit={handleEditSave} className="space-y-4 mt-6">
                <div className="space-y-1">
                   <label className="text-zinc-500 text-[10px] font-bold uppercase ml-1">Book Title</label>
                   <Input value={editBook.title} onChange={(e) => setEditBook({...editBook, title: e.target.value})} className="bg-black/40 border-zinc-800 text-white h-12 rounded-xl focus:border-[#ff1e6d]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-zinc-500 text-[10px] font-bold uppercase ml-1">Price ($)</label>
                     <Input type="number" step="0.01" value={editBook.price} onChange={(e) => setEditBook({...editBook, price: e.target.value})} className="bg-black/40 border-zinc-800 text-white h-12 rounded-xl focus:border-[#ff1e6d]" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-zinc-500 text-[10px] font-bold uppercase ml-1">Genre</label>
                     <Input value={editBook.genre} onChange={(e) => setEditBook({...editBook, genre: e.target.value})} className="bg-black/40 border-zinc-800 text-white h-12 rounded-xl focus:border-[#ff1e6d]" />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-zinc-500 text-[10px] font-bold uppercase ml-1">Description</label>
                   <textarea value={editBook.description} onChange={(e) => setEditBook({...editBook, description: e.target.value})} className="w-full bg-black/40 border border-zinc-800 rounded-xl p-4 text-white h-32 focus:border-[#ff1e6d] outline-none" />
                </div>
                <button type="submit" className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white font-black py-4 rounded-xl shadow-lg mt-4 active:scale-95 transition-all italic uppercase">Save Changes</button>
             </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default MyEbooksTab;