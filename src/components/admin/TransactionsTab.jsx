"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Loader2 } from "lucide-react";
import Cookies from 'js-cookie';

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const token = Cookies.get('access-token');
    fetch(`${SERVER_URL}/api/admin/transactions`, { headers: { authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setTransactions(data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1.5">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Global <span className="text-[#ff1e6d]">Transactions ({transactions.length})</span></h2>
        <div className="bg-[#111113] border border-[#ff1e6d]/20 px-6 py-4 rounded-3xl flex items-center gap-4 shadow-xl">
           <div className="bg-[#ff1e6d] p-2 rounded-lg text-white"><DollarSign size={20} /></div>
           <div><p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Total Revenue</p><h4 className="text-2xl font-black text-white leading-none italic">${transactions.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</h4></div>
        </div>
      </div>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-zinc-800 h-16 text-left">
                <TableHead className="text-zinc-100 font-black px-10 uppercase text-[11px] tracking-widest">Buyer Email</TableHead>
                <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] tracking-widest text-center">Book Title</TableHead>
                <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] tracking-widest">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => {
                // চেক করুন এটি ভেরিফিকেশন ট্রানজেকশন কিনা
                const isVerification = tx.type === 'verification';
                return (
                  <tr 
                    key={tx._id} 
                    className={`border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all ${
                      isVerification ? 'bg-pink-500/5' : ''
                    }`}
                  >
                    <td className="px-10 py-6 font-mono text-zinc-400 text-xs">{tx.userEmail}</td>
                    <td className="text-center font-bold text-white italic text-base uppercase">
                      {isVerification ? (
                        <span className="text-pink-400">"{tx.title}"</span>
                      ) : (
                        <span>"{tx.title}"</span>
                      )}
                    </td>
                    <td className="text-right px-10">
                      <p className={`font-black text-xl leading-none italic ${
                        isVerification ? 'text-green-400' : 'text-green-500'
                      }`}>
                        {isVerification ? '' : '+'}${tx.price}
                      </p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTab;