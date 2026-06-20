"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const EbooksTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic tracking-tighter">Manage <span className="text-[#ff1e6d]">Ebooks</span></h2>
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase tracking-widest text-[11px]">Book Title</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Writer</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Price</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Status</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase tracking-widest text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <tr className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all">
              <td className="px-10 py-6 font-bold text-white text-base italic">The Hollow Archive</td>
              <td className="text-zinc-400 font-medium py-6">Rena Voss</td>
              <td className="text-[#ff1e6d] font-black py-6">$8.99</td>
              <td className="py-6">
                <Badge className="bg-green-600 text-white font-black px-3 py-1 rounded-lg text-[9px] uppercase">Published</Badge>
              </td>
              <td className="text-right px-10 py-6 flex justify-end gap-3">
                <button className="h-9 bg-zinc-100 text-black hover:bg-white font-black text-[10px] uppercase rounded-lg px-4">
                  Unpublish
                </button>
                <button className="h-9 bg-zinc-900 border border-zinc-700 text-red-600 hover:bg-red-600 hover:text-white rounded-lg px-3 flex items-center justify-center">
                  <Trash2 size={16}/>
                </button>
              </td>
            </tr>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default EbooksTab;