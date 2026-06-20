"use client"
import React from 'react';
import { Search, Filter, Trash2, Edit, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AdminPanel = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold tracking-tighter italic">Manage <span className="text-[#ff1e6d]">Users</span></h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={18} />
            <Input className="bg-[#111113] border-zinc-800 w-72 pl-10 h-11 rounded-xl text-white" placeholder="Search users..." />
          </div>
          <Button variant="outline" className="border-zinc-800 bg-[#111113] h-11 px-5 rounded-xl text-zinc-400 gap-2"><Filter size={16} /> All Roles</Button>
        </div>
      </div>

      {/* Stats Badges */}
      <div className="flex flex-wrap gap-3">
        <Badge className="bg-[#ff1e6d] hover:bg-[#ff1e6d] px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-pink-500/20">All Users 12,480</Badge>
        <Badge variant="outline" className="border-zinc-800 bg-[#111113] text-zinc-400 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-900 transition-all">Writers 1,842</Badge>
        <Badge variant="outline" className="border-zinc-800 bg-[#111113] text-zinc-400 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-900 transition-all">Readers 10,394</Badge>
      </div>

      {/* Users Table */}
      <div className="bg-[#111113] border border-zinc-800/60 rounded-[32px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-[3px] bg-zinc-900/30">
              <th className="px-8 py-5">User</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Joined</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[1, 2, 3].map((u) => (
              <tr key={u} className="border-b border-zinc-800/30 hover:bg-zinc-900/50 transition-all group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-800"><AvatarImage src="" /><AvatarFallback className="bg-zinc-800">U</AvatarFallback></Avatar>
                    <span className="font-bold text-zinc-200">Rena Voss</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">rena@fable.io</td>
                <td className="px-6 py-4"><Badge className="bg-blue-500/10 text-blue-400 border-none px-3 py-1 text-[10px]">Writer</Badge></td>
                <td className="px-6 py-4 text-zinc-500 text-xs">Jan 12, 2025</td>
                <td className="px-6 py-4"><Badge className="bg-green-500/10 text-green-500 border-none px-3 py-1 text-[10px]">Active</Badge></td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" className="h-8 border-zinc-800 text-[10px] font-bold uppercase rounded-lg hover:border-[#ff1e6d] hover:text-[#ff1e6d]">Edit Role</Button>
                    <Button variant="outline" className="h-8 border-zinc-800 text-red-500 rounded-lg px-2 hover:bg-red-500/10"><Trash2 size={12}/></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Moderation Section */}
      <div className="pt-10">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-2xl font-bold tracking-tight italic">All Ebooks <span className="text-zinc-600 not-italic">— Moderation</span></h3>
           <Button className="bg-[#ff1e6d]/10 text-[#ff1e6d] border border-[#ff1e6d]/20 hover:bg-[#ff1e6d] hover:text-white h-9 px-6 rounded-xl text-[10px] font-bold uppercase">Flag Selected</Button>
        </div>

        <div className="bg-[#111113] border border-zinc-800/60 rounded-[32px] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-[3px] bg-zinc-900/30">
                <th className="px-8 py-5">Title</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Genre</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-zinc-800/30 hover:bg-zinc-900/50">
                <td className="px-8 py-5 text-white font-bold italic">The Hollow Archive</td>
                <td className="px-6 py-5 text-[#ff1e6d] font-bold">$8.99</td>
                <td className="px-6 py-5"><Badge variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] px-3">Fantasy</Badge></td>
                <td className="px-6 py-5"><Badge className="bg-green-500 text-white border-none text-[9px] px-2 py-0.5 font-bold">Published</Badge></td>
                <td className="px-8 py-5 text-right flex justify-end gap-2">
                  <Button variant="outline" className="h-8 border-zinc-800 text-[9px] font-black uppercase rounded-lg px-3">Edit</Button>
                  <Button className="h-8 bg-[#ff1e6d] hover:bg-[#e61a62] text-[9px] font-black uppercase rounded-lg px-3">Publish</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;