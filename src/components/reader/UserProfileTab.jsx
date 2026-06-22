"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserProfileTab = ({ setActiveTab }) => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [name, setName] = useState(session?.user?.name || "");
  const [img, setImg] = useState(session?.user?.image || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const res = await fetch(`${SERVER_URL}/api/user/update-profile/${session.user.email}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image: img })
      });

      if (res.ok) {
        await authClient.updateUser({ name, image: img });
        toast.success("Success! Profile Updated.", { id: toastId });
        if (setActiveTab) setActiveTab("my-library");
      }
    } catch (err) { toast.error("Failed", { id: toastId }); }
    setLoading(false);
  };

  return (
    <div className="max-w-xl animate-in fade-in duration-500 pb-20">
      <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-10 leading-none">
        Account <span className="text-[#ff1e6d]">Settings</span>
      </h2>
      
      <form onSubmit={handleUpdate} className="space-y-8 bg-[#111113] p-10 rounded-[45px] border border-zinc-800 shadow-2xl">
         
         <div className="space-y-3">
            {/* এখানে text-zinc-100 এবং font-black দেওয়া হয়েছে */}
            <Label className="text-zinc-100 font-black uppercase text-[11px] tracking-[4px] ml-1">Your Full Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="bg-black/40 border-zinc-800 h-14 text-white font-bold rounded-2xl focus:border-[#ff1e6d] focus:ring-0 text-lg" 
              required
            />
         </div>

         <div className="space-y-3">
            <Label className="text-zinc-100 font-black uppercase text-[11px] tracking-[4px] ml-1">Profile Image URL</Label>
            <Input 
              value={img} 
              onChange={(e) => setImg(e.target.value)} 
              className="bg-black/40 border-zinc-800 h-14 text-white font-medium rounded-2xl focus:border-[#ff1e6d] focus:ring-0 text-xs" 
              placeholder="https://images.com/photo.jpg"
            />
         </div>

         <Button disabled={loading} className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] h-16 rounded-2xl font-black text-xl uppercase italic shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
         </Button>
      </form>
    </div>
  );
};

export default UserProfileTab;