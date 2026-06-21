"use client"
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SalesHistoryTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black italic uppercase tracking-tighter">
        Sales <span className="text-[#ff1e6d]">History</span>
      </h2>
      
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase tracking-widest text-[11px]">Ebook Title</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Buyer Name</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Date</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase tracking-widest text-[11px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
            <TableRow className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
              <TableCell className="px-10 py-6 font-bold text-white italic">The Hollow Archive</TableCell>
              <TableCell className="text-zinc-400 font-medium">John Doe</TableCell>
              <TableCell className="text-zinc-500 text-xs">Mar 12, 2025</TableCell>
              <TableCell className="text-right px-10 py-6 font-black text-green-500">+$8.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default SalesHistoryTab;