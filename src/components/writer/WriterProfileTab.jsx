"use client"
import React, { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Camera, Edit3, Loader2, Shield, BookText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from 'js-cookie'; // ইমপোর্ট করা হলো

const WriterProfileTab = () => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = Cookies.get('access-token'); // টোকেন নেওয়া হলো
    
    setLoading(true);
    const toastId = toast.loading("Updating profile...");
    try {
      const res = await fetch(`${SERVER_URL}/api/user/update-profile/${session.user.email}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}` // হেডার পাঠানো হলো
        },
        body: JSON.stringify({ name, image })
      });
      if (res.ok) {
        await authClient.updateUser({ name, image });
        toast.success("Profile Updated!", { id: toastId });
        setOpen(false);
      }
    } catch (err) { toast.error("Error updating profile", { id: toastId }); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-700 pb-20">
      <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter mb-12 leading-none px-2">Author <span className="text-[#ff1e6d]">Profile</span></h2>

      <div className="bg-[#111113] border border-zinc-800/80 rounded-[45px] p-8 lg:p-16 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ff1e6d]/5 blur-[120px] rounded-full transition-all duration-700"></div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-white">
          <Avatar className="h-32 w-32 md:h-44 md:w-44 border-4 border-[#ff1e6d] p-1.5 shadow-2xl shadow-pink-500/20 bg-zinc-900 shrink-0">
            <AvatarImage src={session?.user?.image} className="rounded-full object-cover" />
            <AvatarFallback className="bg-zinc-800 text-5xl text-white font-black uppercase">{session?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-6">
             <div>
                <p className="text-[#ff1e6d] text-[10px] font-black uppercase tracking-[5px] mb-2 flex items-center justify-center md:justify-start gap-2 italic"><Shield size={12} /> Verified Author</p>
                <h3 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter leading-none uppercase">{session?.user?.name}</h3>
                <p className="text-zinc-500 text-xs mt-3 font-medium italic">{session?.user?.email}</p>
             </div>

             <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><button className="bg-white text-black px-10 py-4 rounded-[20px] font-black text-[10px] uppercase shadow-xl hover:bg-zinc-200 active:scale-95 transition-all">Edit Author Details</button></DialogTrigger>
                <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[35px] p-10 max-w-lg shadow-2xl">
                   <DialogHeader><DialogTitle className="text-2xl font-black italic uppercase text-white">Update <span className="text-[#ff1e6d]">Writer Info</span></DialogTitle></DialogHeader>
                   <form onSubmit={handleUpdate} className="space-y-6 mt-6">
                      <div className="space-y-2"><Label className="text-zinc-100 font-black uppercase text-[10px] tracking-[4px] ml-1">Author Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="bg-black/40 border-zinc-800 h-14 text-white font-bold rounded-2xl focus:border-[#ff1e6d] focus:ring-0" required /></div>
                      <div className="space-y-2"><Label className="text-zinc-100 font-black uppercase text-[10px] tracking-[4px] ml-1">Avatar URL</Label><div className="relative"><Camera className="absolute left-4 top-4 text-zinc-600" size={18} /><Input value={image} onChange={(e) => setImage(e.target.value)} className="bg-black/40 border-zinc-800 h-14 pl-12 text-white font-medium rounded-2xl focus:border-[#ff1e6d] focus:ring-0 text-xs" /></div></div>
                      <button disabled={loading} type="submit" className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-16 rounded-2xl font-black text-lg uppercase italic shadow-lg shadow-pink-500/20 active:scale-95 transition-all leading-none">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Save Profile"}</button>
                   </form>
                </DialogContent>
             </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WriterProfileTab;