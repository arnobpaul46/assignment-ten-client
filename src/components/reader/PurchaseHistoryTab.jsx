"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { Loader2, ShoppingBag } from "lucide-react";

const PurchaseHistoryTab = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${SERVER_URL}/api/reader/my-library/${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setHistory(data);
          setLoading(false);
        });
    }
  }, [session, SERVER_URL]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Purchase <span className="text-[#ff1e6d]">History</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="text-zinc-100 font-black px-10 uppercase text-[11px]">Ebook Name</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px]">Writer</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px] text-center">Status</TableHead>
              <TableHead className="text-right px-10 font-black uppercase text-[11px]">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-zinc-600 font-bold italic">You haven't purchased anything yet.</TableCell></TableRow>
            ) : (
              history.map((item) => (
                <tr key={item._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-6">
                     <div className="flex items-center gap-4">
                        <img src={item.image} className="w-10 h-14 object-cover rounded-lg border border-zinc-800" />
                        <span className="font-bold text-white text-base italic leading-tight">{item.title}</span>
                     </div>
                  </td>
                  <td className="text-zinc-400 font-medium">{item.writerName || 'Fable Author'}</td>
                  <td className="text-center">
                    <Badge className="bg-green-600 text-white font-black text-[9px] uppercase px-3 py-1 rounded-lg border-none shadow-lg shadow-green-600/10">Completed</Badge>
                    <p className="text-[10px] text-zinc-600 font-bold mt-1 uppercase">{new Date(item.date).toLocaleDateString()}</p>
                  </td>
                  <td className="text-right px-10 font-black text-[#ff1e6d] text-xl">
                    ${item.price}
                  </td>
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default PurchaseHistoryTab;