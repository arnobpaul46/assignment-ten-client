"use client"
import React, { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { 
  User, Mail, Shield, Camera, Edit3, 
  Loader2, CheckCircle2, BookText 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WriterProfileTab = () => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // Form States
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating your writer profile...");

    try {
      // ১. এক্সপ্রেস সার্ভারে আপডেট পাঠানো
      const res = await fetch(`${SERVER_URL}/api/user/update-profile/${session.user.email}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image })
      });

      if (res.ok) {
        // ২. BetterAuth সেশন আপডেট করা
        await authClient.updateUser({
           name: name,
           image: image
        });

        toast.success("Writer Profile Updated!", { id: toastId });
        setOpen(false); // মোডাল বন্ধ হবে
      } else {
        throw new Error("Update failed on server");
      }
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-700 pb-20 font-sans">
      <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-12">
        Writer <span className="text-[#ff1e6d]">Profile</span>
      </h2>

      {/* --- প্রোফাইল ডিসপ্লে কার্ড (Reader Design Match) --- */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded-[45px] p-10 lg:p-16 shadow-2xl relative overflow-hidden group">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ff1e6d]/10 blur-[120px] rounded-full group-hover:bg-[#ff1e6d]/20 transition-all duration-700"></div>

        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* প্রোফাইল ইমেজ ফিক্সড */}
          <div className="relative shrink-0">
             <Avatar className="h-44 w-44 border-4 border-[#ff1e6d] p-1.5 shadow-2xl shadow-pink-500/20 bg-zinc-900">
                <AvatarImage src={session?.user?.image} className="rounded-full object-cover" />
                <AvatarFallback className="bg-zinc-800 text-5xl text-white font-black uppercase">
                   {session?.user?.name?.charAt(0)}
                </AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-1 -right-1 bg-green-500 h-8 w-8 rounded-full border-4 border-[#111113] shadow-lg"></div>
          </div>

          {/* তথ্য সেকশন */}
          <div className="flex-1 text-center md:text-left space-y-6">
             <div>
                <p className="text-[#ff1e6d] text-[10px] font-black uppercase tracking-[5px] mb-3 flex items-center justify-center md:justify-start gap-2">
                   <Shield size={12} /> Verified Author
                </p>
                <h3 className="text-5xl font-black text-white italic tracking-tighter leading-none uppercase">
                  {session?.user?.name}
                </h3>
                <p className="text-zinc-500 text-xs mt-4 font-mono italic tracking-wide">{session?.user?.email}</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-zinc-400 bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                   <BookText size={18} className="text-[#ff1e6d]" />
                   <span className="text-sm font-bold uppercase tracking-widest">Writer Dashboard</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                   <CheckCircle2 size={18} className="text-[#ff1e6d]" />
                   <span className="text-sm font-bold uppercase tracking-widest">Status: Active</span>
                </div>
             </div>

             {/* --- EDIT MODAL TRIGGER --- */}
             <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                   <button className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-zinc-200 active:scale-95 transition-all mt-4">
                      <Edit3 size={16} /> Edit Writer Details
                   </button>
                </DialogTrigger>
                <DialogContent className="bg-[#0c0c0e] border-zinc-800 text-white rounded-[35px] p-10 max-w-lg shadow-2xl">
                   <DialogHeader>
                      <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">
                        Update <span className="text-[#ff1e6d]">Writer Profile</span>
                      </DialogTitle>
                   </DialogHeader>

                   <form onSubmit={handleUpdate} className="space-y-6 mt-6">
                      <div className="space-y-2">
                         <Label className="text-zinc-100 font-black uppercase text-[10px] tracking-[4px] ml-1">Author Name</Label>
                         <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="bg-black/40 border-zinc-800 h-14 text-white font-bold rounded-2xl focus:border-[#ff1e6d] focus:ring-0 text-lg" 
                            placeholder="Full Name"
                            required
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-zinc-100 font-black uppercase text-[10px] tracking-[4px] ml-1">Profile Image URL</Label>
                         <div className="relative">
                            <Camera className="absolute left-4 top-4 text-zinc-600" size={18} />
                            <Input 
                               value={image} 
                               onChange={(e) => setImage(e.target.value)}
                               className="bg-black/40 border-zinc-800 h-14 pl-12 text-white font-medium rounded-2xl focus:border-[#ff1e6d] focus:ring-0 text-xs" 
                               placeholder="https://images.com/author.jpg"
                            />
                         </div>
                      </div>

                      <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-16 rounded-2xl font-black text-lg uppercase italic shadow-lg shadow-pink-500/20 transition-all active:scale-95"
                      >
                         {loading ? <Loader2 className="animate-spin mx-auto text-white" /> : "Save Changes"}
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

export default WriterProfileTab;