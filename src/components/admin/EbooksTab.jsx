"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, AlertTriangle, Loader2, BookImage } from "lucide-react"; // BookImage যোগ করা হয়েছে
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const EbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/all-books`);
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch(`${SERVER_URL}/api/writer/update-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Book is now ${newStatus}`, { id: toastId });
        fetchBooks();
      }
    } catch (err) { toast.error("Failed to update", { id: toastId }); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Global <span className="text-[#ff1e6d]">Moderation</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[850px]">
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-zinc-800 h-16">
                <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] w-[45%] text-left">Book & Writer</TableHead>
                <TableHead className="text-zinc-100 font-black uppercase text-[11px] text-center w-[25%]">Visibility</TableHead>
                <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] w-[30%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <tr key={book._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-6 flex items-center gap-6 text-left">
                    {/* Image Fallback Logic */}
                    <div className="w-14 h-20 rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900 shrink-0 flex items-center justify-center">
                       {book.image ? (
                         <img src={book.image} className="w-full h-full object-cover" alt="" onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'} />
                       ) : (
                         <BookImage className="text-zinc-700" size={24} />
                       )}
                    </div>
                    <div>
                      <p className="text-lg italic font-black text-white leading-tight mb-1">{book.title}</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Writer: {book.writerName || 'Fable Author'}</p>
                    </div>
                  </td>
                  
                  <td className="text-center">
                    <div className="flex justify-center items-center">
                      <Select 
                        onValueChange={(val) => handleStatusChange(book._id, val)} 
                        defaultValue={book.status}
                      >
                        <SelectTrigger 
                          className={`w-[140px] h-10 text-[10px] font-black uppercase rounded-xl border-none transition-all ${
                            book.status === 'Published' 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                            : book.status === 'Pending' 
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
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
                     <button onClick={() => setDeleteId(book._id)} className="h-10 w-10 bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all ml-auto active:scale-95 shadow-lg">
                        <Trash2 size={16}/>
                     </button>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>


      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        
      </Dialog>
    </div>
  );
};
export default EbooksTab;