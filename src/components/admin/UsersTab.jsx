"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus } from "lucide-react";

const UsersTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Manage <span className="text-[#ff1e6d]">Users</span></h2>
        <button className="bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-xl h-11 px-6 font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
          <UserPlus size={18} /> Add New Admin
        </button>
      </div>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[35px] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-100 font-black px-10 h-16 uppercase tracking-widest text-[11px]">User Profile</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Email Address</TableHead>
              <TableHead className="text-zinc-100 font-black h-16 uppercase tracking-widest text-[11px]">Role</TableHead>
              <TableHead className="text-right px-10 h-16 font-black uppercase tracking-widest text-[11px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all group">
                <td className="px-10 py-6 font-bold text-white text-base">Rena Voss</td>
                <td className="text-zinc-400 font-mono text-xs italic">rena@fable.io</td>
                <td className="py-6">
                  <Badge className="bg-blue-600 text-white font-black px-3 py-1 rounded-lg text-[10px] uppercase border-none shadow-lg shadow-blue-600/10">Writer</Badge>
                </td>
                <td className="text-right px-10 py-6 flex justify-end gap-3">
                  <button className="h-10 bg-zinc-100 text-black hover:bg-white font-black text-[10px] uppercase rounded-xl px-5 transition-all shadow-lg active:scale-95">
                    Edit Role
                  </button>
                  <button className="h-10 bg-zinc-900 border border-zinc-700 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-3 transition-all flex items-center justify-center">
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
export default UsersTab;