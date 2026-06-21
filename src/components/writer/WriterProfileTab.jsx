"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Camera } from "lucide-react";

const WriterProfileTab = ({ setActiveTab }) => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // Form States
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating your profile...");

    try {
      // ১. ডাটাবেসে আপডেট করা
      const res = await fetch(`${SERVER_URL}/api/user/update-profile/${session.user.email}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image })
      });

      if (res.ok) {
        // ২. BetterAuth সেশন আপডেট করা (যাতে নেভবারেও নাম পাল্টে যায়)
        await authClient.updateUser({
           name: name,
           image: image
        });

        toast.success("Profile Updated!", { id: toastId });
        
        // ৩. আপডেট হওয়ার পর "My Ebooks" ট্যাবে ফিরে যাওয়া
        setActiveTab("my-ebooks"); 
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
    <div className="max-w-xl animate-in slide-in-from-left-5 duration-500 pb-20">
      {/* Back Button */}
      <button 
        onClick={() => setActiveTab("my-ebooks")} 
        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors font-bold uppercase text-[10px] tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10">
        Account <span className="text-[#ff1e6d]">Settings</span>
      </h2>

      <form onSubmit={handleUpdate} className="space-y-8 bg-[#111113] p-10 rounded-[45px] border border-zinc-800 shadow-2xl">
        
        <div className="space-y-2">
           <Label className="text-zinc-400 font-black text-[11px] uppercase ml-1 tracking-widest">Full Display Name</Label>
           <Input 
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="bg-black/40 border-zinc-800 h-14 text-white font-bold rounded-2xl focus:border-[#ff1e6d] focus:ring-0" 
             placeholder="Your Name"
             required
           />
        </div>

        <div className="space-y-2">
           <Label className="text-zinc-400 font-black text-[11px] uppercase ml-1 tracking-widest">Profile Image (URL)</Label>
           <div className="relative">
             <Camera className="absolute left-4 top-4 text-zinc-600" size={18} />
             <Input 
               value={image}
               onChange={(e) => setImage(e.target.value)}
               className="bg-black/40 border-zinc-800 h-14 pl-12 text-white font-bold rounded-2xl focus:border-[#ff1e6d] focus:ring-0 text-xs" 
               placeholder="Paste image URL here..." 
             />
           </div>
           <p className="text-[10px] text-zinc-600 ml-1 italic">* Use a direct link from ImgBB or Unsplash</p>
        </div>

        <Button disabled={loading} className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-16 rounded-2xl font-black text-lg shadow-lg shadow-pink-500/10 transition-all active:scale-95 uppercase italic">
           {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Saving...</div> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default WriterProfileTab;