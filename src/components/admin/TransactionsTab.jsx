"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, DollarSign } from "lucide-react";

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/transactions`)
      .then(res => res.json())
      .then(data => { setTransactions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [SERVER_URL]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Global <span className="text-[#ff1e6d]">Transactions</span></h2>
        <div className="bg-[#ff1e6d]/10 border border-[#ff1e6d]/20 px-6 py-3 rounded-2xl flex items-center gap-3">
           <DollarSign className="text-[#ff1e6d]" size={20} />
           <span className="text-white font-black text-sm md:text-lg italic">${transactions.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)} Total Revenue</span>
        </div>
      </div>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] tracking-widest">Buyer Email</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] tracking-widest text-center">Book Title</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] tracking-widest">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-20 text-zinc-500 italic font-bold">No transactions found.</TableCell></TableRow>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-6 font-mono text-zinc-400 text-xs">{tx.userEmail}</td>
                  <td className="text-center font-bold text-white italic text-base">"{tx.title}"</td>
                  <td className="text-right px-10">
                    <p className="text-green-500 font-black text-xl leading-none">+${tx.price}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{new Date(tx.date).toLocaleDateString()}</p>
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

export default TransactionsTab;