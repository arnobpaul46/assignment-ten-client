"use client"
import React from 'react';
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // এই লাইনটি মিসিং ছিল

const UserProfileTab = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className="max-w-2xl animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10">My <span className="text-[#ff1e6d]">Profile</span></h2>
      
      <div className="bg-[#111113] border border-zinc-800 rounded-[45px] p-12 text-center shadow-2xl relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff1e6d]/10 blur-[100px] rounded-full"></div>
        
        <Avatar className="h-32 w-32 border-4 border-[#ff1e6d] p-1 mx-auto mb-6 shadow-lg shadow-pink-500/20 relative z-10">
          <AvatarImage src={session?.user?.image} className="rounded-full object-cover" />
          <AvatarFallback className="bg-zinc-900 text-4xl text-white uppercase font-black">
             {session?.user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <h3 className="text-3xl font-black text-white italic mb-2 relative z-10">{session?.user?.name}</h3>
        <p className="text-zinc-500 font-medium tracking-wide mb-8 relative z-10">{session?.user?.email}</p>
        
        <div className="bg-black/40 border border-zinc-800 p-8 rounded-[30px] grid grid-cols-2 gap-8 relative z-10">
           <div className="space-y-2">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[3px]">Account Role</p>
              <Badge className="bg-[#ff1e6d] hover:bg-[#ff1e6d] text-white px-4 py-1 rounded-lg font-black uppercase text-[10px]">
                 {session?.user?.role || 'Reader'}
              </Badge>
           </div>
           <div className="space-y-2 border-l border-zinc-800">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[3px]">Member Since</p>
              <p className="text-white font-black text-sm italic uppercase">Jan 2025</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileTab;