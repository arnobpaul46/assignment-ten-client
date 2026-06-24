"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { Loader2, TrendingUp, DollarSign } from "lucide-react";

const SalesHistoryTab = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${SERVER_URL}/api/writer/sales/${session.user.email}`)
        .then(res => res.json())
        .then(data => { setSales(data); setLoading(false); });
    }
  }, [session, SERVER_URL]);

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Sales <span className="text-[#ff1e6d]">History</span></h2>
        <div className="bg-[#ff1e6d]/10 border border-[#ff1e6d]/20 px-8 py-4 rounded-[25px] flex items-center gap-4 shadow-xl">
           <DollarSign className="text-white" size={24} />
           <div><p className="text-[#ff1e6d] text-[9px] font-black uppercase tracking-widest leading-none mb-1">Total Earnings</p><h4 className="text-2xl font-black text-white leading-none">${totalRevenue.toFixed(2)}</h4></div>
        </div>
      </div>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-zinc-800 h-16 text-left">
                <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] tracking-widest">Book Title</TableHead>
                <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] text-center tracking-widest">Buyer</TableHead>
                <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] tracking-widest">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1,2,3].map(i => <TableRow key={i} className="animate-pulse h-20 bg-zinc-900/10 border-b border-zinc-800"><TableCell colSpan={3}></TableCell></TableRow>)
              ) : sales.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-24 text-zinc-600 font-bold italic text-lg">No sales recorded yet.</TableCell></TableRow>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
                    <td className="px-10 py-6 font-bold text-white text-base italic leading-tight uppercase">{sale.title}</td>
                    <td className="text-zinc-400 font-medium text-center text-sm">{sale.userEmail}</td>
                    <td className="text-right px-10 py-6"><span className="text-green-500 font-black text-xl"> +${sale.price}</span></td>
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
export default SalesHistoryTab;