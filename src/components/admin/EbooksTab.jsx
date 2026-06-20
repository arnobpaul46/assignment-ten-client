"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EbooksTab = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/all-books`);
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (err) { toast.error("Failed to load books"); }
  };

  useEffect(() => { fetchBooks(); }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Manage <span className="text-[#ff1e6d]">Ebooks</span></h2>
      
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px]">Book Title</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px]">Price</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px]">Status</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <tr key={book._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                <td className="px-10 py-6 font-bold text-white text-base italic">{book.title}</td>
                <td className="text-[#ff1e6d] font-black py-6">${book.price}</td>
                <td className="py-6">
                  <Badge className="bg-green-600 text-white font-black px-3 py-1 rounded-lg text-[9px] uppercase">Published</Badge>
                </td>
                <td className="text-right px-10 py-6 flex justify-end gap-3">
                  <button className="h-9 bg-zinc-100 text-black hover:bg-white font-black text-[10px] uppercase rounded-lg px-4">Unpublish</button>
                  <button className="h-9 bg-zinc-900 border border-zinc-700 text-red-600 hover:bg-red-600 hover:text-white rounded-lg px-3 flex items-center justify-center">
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default EbooksTab;