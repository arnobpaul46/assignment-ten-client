"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { ShoppingBag, Loader2 } from "lucide-react";

const PurchaseHistoryTab = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${SERVER_URL}/api/reader/my-library/${session.user.email}`)
        .then(res => res.json())
        .then(data => { setHistory(data); setLoading(false); });
    }
  }, [session]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter px-2">Order <span className="text-[#ff1e6d]">History</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar"> {/* Responsive Wrapper */}
          <Table className="min-w-[800px]">
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-zinc-800 h-16">
                <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] tracking-widest">Ebook</TableHead>
                <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] tracking-widest">Writer</TableHead>
                <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] text-center tracking-widest">Status</TableHead>
                <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] tracking-widest">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1,2,3].map(i => <TableRow key={i} className="animate-pulse h-20 bg-zinc-900/10"><TableCell colSpan={4}></TableCell></TableRow>)
              ) : history.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-20 text-zinc-600 font-bold italic">No orders found.</TableCell></TableRow>
              ) : (
                history.map((item) => (
                  <tr key={item._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <img src={item.image} className="w-10 h-14 object-cover rounded-lg border border-zinc-800" alt="" />
                          <span className="font-bold text-white text-base italic">{item.title}</span>
                       </div>
                    </td>
                    <td className="text-zinc-400 font-medium">{item.writerName}</td>
                    <td className="text-center">
                      <Badge className="bg-green-600 text-white font-black text-[9px] uppercase px-3 py-1 rounded-lg border-none shadow-lg">Completed</Badge>
                      <p className="text-[10px] text-zinc-600 font-bold mt-1">{new Date(item.date).toLocaleDateString()}</p>
                    </td>
                    <td className="text-right px-10 font-black text-[#ff1e6d] text-xl">${item.price}</td>
                  </tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
export default PurchaseHistoryTab;