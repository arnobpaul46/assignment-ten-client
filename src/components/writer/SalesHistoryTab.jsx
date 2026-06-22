"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { Loader2, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

const SalesHistoryTab = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    if (session?.user?.email) {
      // রাইটারের ইমেইল দিয়ে তার সেলস ডাটা ফেচ করা
      fetch(`${SERVER_URL}/api/writer/sales/${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setSales(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Sales fetch error:", err);
          setLoading(false);
        });
    }
  }, [session, SERVER_URL]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Sales Stats Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Sales <span className="text-[#ff1e6d]">History</span></h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[3px] mt-2 ml-1">Track your earnings and readers</p>
        </div>
        
        {/* Total Earnings Card */}
        <div className="bg-[#ff1e6d]/10 border border-[#ff1e6d]/20 px-8 py-4 rounded-[25px] flex items-center gap-4 shadow-xl">
           <div className="bg-[#ff1e6d] p-2 rounded-lg"><TrendingUp className="text-white" size={20} /></div>
           <div>
              <p className="text-[#ff1e6d] text-[9px] font-black uppercase tracking-widest leading-none mb-1">Total Revenue</p>
              <h4 className="text-2xl font-black text-white leading-none">
                ${sales.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
              </h4>
           </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase text-[11px] tracking-widest">Book Title</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] tracking-widest">Buyer Email</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase text-[11px] tracking-widest">Date</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase text-[11px] tracking-widest">Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-zinc-600 font-bold italic">
                   No sales yet. Keep writing masterpieces!
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <tr key={sale._id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-6 font-bold text-white text-base italic leading-tight">
                    {sale.title}
                  </td>
                  <td className="text-zinc-400 font-medium">
                    {sale.userEmail}
                  </td>
                  <td className="text-zinc-500 text-xs font-bold">
                    {new Date(sale.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="text-right px-10 py-6">
                    <span className="text-green-500 font-black text-xl leading-none">
                      +${sale.price}
                    </span>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Net Earnings</p>
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

export default SalesHistoryTab;