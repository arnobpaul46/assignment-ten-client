"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const PurchaseHistoryTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Purchase <span className="text-[#ff1e6d]">History</span></h2>
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="text-zinc-100 font-black px-10 uppercase text-[11px]">Ebook Name</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px]">Writer</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px]">Price</TableHead>
              <TableHead className="text-zinc-100 font-black uppercase text-[11px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-zinc-800/50 hover:bg-white/[0.02]">
              <td className="px-10 py-6 font-bold text-white text-base italic">The Crimson Letter</td>
              <td className="text-zinc-400 font-medium">Elias Thorne</td>
              <td className="text-[#ff1e6d] font-black">$12.99</td>
              <td className="text-center"><Badge className="bg-green-600 text-white font-black text-[9px] uppercase">Success</Badge></td>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default PurchaseHistoryTab;