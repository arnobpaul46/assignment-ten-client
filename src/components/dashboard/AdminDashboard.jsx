"use client"
import React from 'react';
import { Search, Filter, Trash2, Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] text-[#ff1e6d] font-bold uppercase tracking-[3px] mb-2">System Control</p>
          <h2 className="text-3xl lg:text-4xl font-black text-white italic">Manage <span className="text-[#ff1e6d]">Users</span></h2>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 text-zinc-500" size={16} />
            <Input className="bg-[#111113] border-zinc-800 w-full pl-10 h-11 rounded-xl text-white focus:border-[#ff1e6d]" placeholder="Search..." />
          </div>
          <Button variant="outline" className="border-zinc-800 bg-[#111113] h-11 rounded-xl"><Filter size={18} /></Button>
        </div>
      </div>

      {/* Stats - Slick Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <div className="bg-[#ff1e6d] text-white px-6 py-2.5 rounded-xl text-[11px] font-black shadow-lg shadow-pink-500/20 whitespace-nowrap">All Users 12,480</div>
        <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-6 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap hover:text-white transition-all cursor-pointer">Writers 1,842</div>
        <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-6 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap hover:text-white transition-all cursor-pointer">Readers 10,394</div>
      </div>

      {/* Responsive Table with Custom Scrollbar */}
      <div className="bg-[#111113] border border-zinc-800/50 rounded-[32px] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800/50 text-zinc-500 text-[10px] uppercase tracking-[3px] bg-white/[0.01]">
                <th className="px-8 py-6 font-black">User Profile</th>
                <th className="px-6 py-6 font-black">Email</th>
                <th className="px-6 py-6 font-black text-center">Status</th>
                <th className="px-8 py-6 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3].map((u) => (
                <tr key={u} className="border-b border-zinc-800/30 hover:bg-[#ff1e6d]/5 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-800"><AvatarFallback className="bg-zinc-800 text-white font-bold text-xs uppercase">RV</AvatarFallback></Avatar>
                      <span className="font-bold text-white">Rena Voss</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-zinc-500 font-medium text-xs">rena@fable.io</td>
                  <td className="px-6 py-5 text-center"><Badge className="bg-green-600/10 text-green-500 border border-green-600/20 font-bold px-3 py-1 rounded-lg text-[9px]">Active</Badge></td>
                  <td className="px-8 py-5 text-right flex justify-end gap-2">
                    <Button variant="outline" className="h-9 border-zinc-700 bg-white text-black hover:bg-zinc-100 text-[10px] font-black uppercase rounded-lg px-4">Edit Role</Button>
                    <Button variant="outline" className="h-9 border-zinc-700 bg-zinc-900 text-red-500 rounded-lg px-3"><Trash2 size={14}/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global CSS for Custom Scrollbar (Add this to your globals.css or at the end of this file) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0c0c0e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff1e6d;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;