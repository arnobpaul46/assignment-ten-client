"use client"
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Upload, Loader2, Sparkles, BookOpen, X, ShieldCheck, CreditCard } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation'; // useRouter যোগ করা হয়েছে
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Cookies from 'js-cookie';

const AddEbookTab = ({ setActiveTab }) => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [genre, setGenre] = useState("");

  const router = useRouter(); // রিডাইরেক্টের জন্য
  const searchParams = useSearchParams();
  const verifyStatus = searchParams.get('verify');
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  useEffect(() => {
    if (verifyStatus === 'success' && session?.user?.email) {
      const verifyAccount = async () => {
        const token = Cookies.get('access-token');
        try {
          await fetch(`${SERVER_URL}/api/writer/verify-account/${session.user.email}`, { 
            method: 'PATCH',
            headers: { authorization: `Bearer ${token}` }
          });
          toast.success("Verified! Studio Unlocked.");
          window.location.href = "/dashboard/writer?tab=add-ebook";
        } catch (err) { console.error(err); }
      };
      verifyAccount();
    }
  }, [verifyStatus, session, SERVER_URL]);

  const handlePayVerification = async () => {
    setLoading(true);
    const toastId = toast.loading("Connecting...");
    try {
      const res = await fetch(`${SERVER_URL}/api/create-verification-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${Cookies.get('access-token')}` },
        body: JSON.stringify({ userEmail: session.user.email })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { toast.error("Failed"); }
    finally { setLoading(false); toast.dismiss(toastId); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (loading) return; // --- ডাবল ক্লিক প্রোটেকশন ---

    const token = Cookies.get('access-token');
    if (!selectedFile || !genre) return toast.error("All fields required");

    setLoading(true);
    const toastId = toast.loading("Publishing masterpiece...");

    try {
      const formDataObj = new FormData(e.currentTarget);
      const imgFormData = new FormData();
      imgFormData.append('image', selectedFile);

      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: imgFormData });
      const imgData = await imgRes.json();
      if (!imgData.success) throw new Error("Image upload failed");

      const bookInfo = {
        title: formDataObj.get('title'),
        price: parseFloat(formDataObj.get('price')),
        genre,
        description: formDataObj.get('description'),
        image: imgData.data.url,
        writerEmail: session.user.email,
        writerName: session.user.name,
        status: "Pending",
        createdAt: new Date()
      };

      const res = await fetch(`${SERVER_URL}/api/writer/add-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify(bookInfo)
      });

      if (res.ok) {
        toast.success("Ebook Live!", { id: toastId });
        // --- ফিক্সড রিডাইরেক্ট লজিক ---
        router.push("/dashboard/writer?tab=my-ebooks");
        router.refresh();
      }
    } catch (err) { toast.error(err.message, { id: toastId }); }
    finally { setLoading(false); }
  };

  if (!session?.user?.isVerified) {
    return (
      <div className="max-w-2xl mx-auto py-20 animate-in fade-in">
        <div className="bg-[#111113] border border-zinc-800 rounded-[45px] p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff1e6d]/10 blur-[100px] rounded-full"></div>
          <ShieldCheck className="text-[#ff1e6d] mx-auto mb-8" size={60} />
          <h2 className="text-4xl font-black text-white italic uppercase mb-4">Verification Needed</h2>
          <p className="text-zinc-500 mb-10 italic leading-relaxed">Pay $20.00 one-time fee to unlock publishing studio.</p>
          <button onClick={handlePayVerification} disabled={loading} className="w-full h-16 bg-[#ff1e6d] text-white rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={20} /> Pay & Unlock</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-5 mb-10 text-white italic">
        <div className="bg-[#ff1e6d]/15 p-4 rounded-[22px] shadow-lg"><BookOpen className="text-[#ff1e6d]" size={30} /></div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Writer Studio</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-8 bg-[#111113] p-10 lg:p-14 rounded-[50px] border border-white/5 shadow-2xl">
        <div className="flex flex-col gap-3">
          <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1">Ebook Title</Label>
          <Input name="title" className="bg-black/40 border-zinc-800 h-[70px] text-white font-bold rounded-[22px] focus:border-[#ff1e6d] text-lg" placeholder="Title here..." required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col space-y-4">
            <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1">Price (USD)</Label>
            <div className="relative h-[70px]"><span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#ff1e6d] font-black text-xl z-10">$</span><Input name="price" type="number" step="0.01" className="w-full h-full pl-12 bg-black/40 border-zinc-800 text-white font-black text-xl rounded-[22px] focus:border-[#ff1e6d]" required /></div>
          </div>
          <div className="flex flex-col space-y-4">
            <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1">Select Genre</Label>
            <div className="h-[70px]"><Select onValueChange={setGenre}><SelectTrigger className="w-full h-full bg-black/40 border-zinc-800 text-zinc-100 font-bold rounded-[22px] px-6"><SelectValue placeholder="Genre" /></SelectTrigger><SelectContent className="bg-[#0c0c0e] border-zinc-800 text-white font-bold rounded-2xl">{["Fantasy", "Horror", "Sci-Fi", "Romance", "Mystery", "Biography"].map(g => (<SelectItem key={g} value={g} className="py-3 focus:bg-[#ff1e6d]">{g}</SelectItem>))}</SelectContent></Select></div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1">Cover Art</Label>
          {!preview ? (
            <label htmlFor="book-img" className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-zinc-800 rounded-[35px] cursor-pointer hover:border-[#ff1e6d] bg-black/20 group"><Upload className="text-zinc-600 mb-2 group-hover:scale-110" size={28} /><span className="text-zinc-500 text-[10px] font-black uppercase tracking-[3px]">Select Image</span><input type="file" id="book-img" className="hidden" accept="image/*" onChange={handleImageChange} /></label>
          ) : (
            <div className="relative h-72 w-full rounded-[35px] overflow-hidden border border-zinc-800 shadow-2xl"><img src={preview} className="w-full h-full object-cover" alt="" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center"><button type="button" onClick={() => { setPreview(null); setSelectedFile(null); }} className="bg-red-600 text-white p-4 rounded-full"><X size={24} /></button></div></div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1">Full Description</Label>
          <textarea name="description" className="w-full bg-black/40 border border-zinc-800 rounded-[30px] p-8 text-white font-medium h-48 focus:border-[#ff1e6d] outline-none text-lg leading-relaxed" required></textarea>
        </div>

        <Button disabled={loading} className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-[80px] rounded-[25px] font-black text-2xl shadow-lg active:scale-95 transition-all">
          {loading ? <div className="flex items-center gap-3"><Loader2 className="animate-spin" /> Publishing...</div> : "Publish masterpiece"}
        </Button>
      </form>
    </div>
  );
};

export default AddEbookTab;