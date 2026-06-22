"use client"
import React, { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { 
  User, Mail, Shield, Camera, Edit3, 
  Loader2, CheckCircle2, Globe 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserProfileTab = () => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // Form States (সেশন থেকে ডিফল্ট ভ্যালু নিচ্ছে)
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating your profile...");

    try {
      // ১. আপনার এক্সপ্রেস সার্ভারে আপডেট করা
      const res = await fetch(`${SERVER_URL}/api/user/update-profile/${session.user.email}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image })
      });

      if (res.ok) {
        // ২. BetterAuth সেশন ডাইনামিকভাবে আপডেট করা
        await authClient.updateUser({
           name: name,
           image: image
        });

        toast.success("Profile updated successfully!", { id: toastId });
        setOpen(false); // মোডাল বন্ধ হবে
      } else {
        throw new Error("Failed to update on server");
      }
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-700 pb-20">
      <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-12">
        My <span className="text-[#ff1e6d]">Profile</span>
      </h2>

      {/* --- প্রোফাইল ডিসপ্লে কার্ড --- */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[45px] p-10 lg:p-16 shadow-2xl relative overflow-hidden group">
        {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ff1e6d]/10 blur-[120px] rounded-full group-hover:bg-[#ff1e6d]/20 transition-all duration-700"></div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          {/* প্রোফাইল ইমেজ */}
          <div className="relative shrink-0">
             <Avatar className="h-40 w-40 border-4 border-[#ff1e6d] p-1.5 shadow-2xl shadow-pink-500/20">
                <AvatarImage src={session?.user?.image} className="rounded-full object-cover" />
                <AvatarFallback className="bg-zinc-900 text-5xl text-white font-black uppercase">
                   {session?.user?.name?.charAt(0)}
                </AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-2 -right-2 bg-green-500 h-8 w-8 rounded-full border-4 border-[#111113] shadow-lg"></div>
          </div>

          {/* তথ্য সেকশন */}
          <div className="flex-1 text-center md:text-left space-y-6">
             <div>
                <p className="text-[#ff1e6d] text-[10px] font-black uppercase tracking-[5px] mb-2 flex items-center justify-center md:justify-start gap-2">
                   <Shield size={12} /> Verified {session?.user?.role || 'User'}
                </p>
                <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none uppercase">
                  {session?.user?.name}
                </h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-zinc-400 bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                   <Mail size={18} className="text-[#ff1e6d]" />
                   <span className="text-sm font-bold truncate">{session?.user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                   <Globe size={18} className="text-[#ff1e6d]" />
                   <span className="text-sm font-bold uppercase tracking-widest">Language: English</span>
                </div>
             </div>

             {/* --- এডিট মোডাল ট্রিগার --- */}
             <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                   <button className="flex items-center justify-center gap-3 bg-white text-black px-15 py-5 rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">
                      <Edit3 size={16} /> Edit My Profile
                   </button>
                </DialogTrigger>
                <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[35px] p-10 max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                   <DialogHeader>
                      <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">
                        Update <span className="text-[#ff1e6d]">Profile</span>
                      </DialogTitle>
                   </DialogHeader>

                   <form onSubmit={handleUpdate} className="space-y-6 mt-6">
                      <div className="space-y-2">
                         <Label className="text-zinc-500 font-bold uppercase text-[10px] ml-1 tracking-widest text-zinc-100">Display Name</Label>
                         <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="bg-black/40 border-zinc-800 h-14 text-white font-bold rounded-2xl focus:border-[#ff1e6d] focus:ring-0" 
                            required
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-zinc-500 font-bold uppercase text-[10px] ml-1 tracking-widest text-zinc-100">Avatar URL (ImgBB/Unsplash)</Label>
                         <div className="relative">
                            <Camera className="absolute left-4 top-4 text-zinc-600" size={18} />
                            <Input 
                               value={image} 
                               onChange={(e) => setImage(e.target.value)}
                               className="bg-black/40 border-zinc-800 h-14 pl-12 text-white font-medium rounded-2xl focus:border-[#ff1e6d] focus:ring-0 text-xs" 
                               placeholder="https://images.com/photo.jpg"
                            />
                         </div>
                      </div>

                      <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-16 rounded-2xl font-black text-lg uppercase italic shadow-lg shadow-pink-500/20 transition-all active:scale-95"
                      >
                         {loading ? <Loader2 className="animate-spin mx-auto" /> : "Save Profile"}
                      </button>
                   </form>
                </DialogContent>
             </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileTab;