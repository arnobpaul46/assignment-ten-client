"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Upload, Loader2, Sparkles, BookOpen, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const AddEbookTab = ({ setActiveTab }) => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [genre, setGenre] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // ১. ভ্যালিডেশন চেক
    if (!session?.user?.email) return toast.error("Please login first");
    if (!selectedFile) return toast.error("Select a cover image");
    if (!genre) return toast.error("Select a genre");

    setLoading(true);
    const toastId = toast.loading("Publishing masterpiece...");

    try {
      // ২. Form থেকে ডেটা নেওয়া (Safe Method)
      const formDataObj = new FormData(e.currentTarget);
      const title = formDataObj.get('title');
      const price = formDataObj.get('price');
      const description = formDataObj.get('description');

      // ৩. ImgBB ইমেজ আপলোড
      const imgFormData = new FormData();
      imgFormData.append('image', selectedFile);
      
      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { 
        method: 'POST', 
        body: imgFormData 
      });
      const imgData = await imgRes.json();
      
      if (!imgData.success) throw new Error("Image Upload Failed");

      // ৪. ব্যাকেন্ড ডাটাবেসে সেভ করা
      const bookInfo = {
        title,
        price: parseFloat(price),
        genre, // স্টেট থেকে নেওয়া জেনরা
        description,
        image: imgData.data.url,
        writerEmail: session.user.email,
        writerName: session.user.name,
        status: "Pending",
        createdAt: new Date()
      };

      const res = await fetch(`${SERVER_URL}/api/writer/add-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookInfo)
      });

      if (res.ok) {
        toast.success("Ebook Live!", { id: toastId });
        if (setActiveTab) setActiveTab("my-ebooks");
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (err) { 
      console.error(err);
      toast.error(err.message, { id: toastId }); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-5 mb-10 text-white italic">
        <div className="bg-[#ff1e6d]/15 p-4 rounded-[22px] shadow-lg"><BookOpen className="text-[#ff1e6d]" size={30} /></div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Writer Studio</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-8 bg-[#111113] p-10 lg:p-14 rounded-[50px] border border-white/5 shadow-2xl">

        {/* Title */}
        <div className="flex flex-col gap-3">
          <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1 leading-none">Ebook Title</Label>
          <Input name="title" className="bg-black/40 border-zinc-800 h-[70px] text-white font-bold rounded-[22px] focus:border-[#ff1e6d] focus:ring-0 text-lg" placeholder="Title here..." required />
        </div>

        {/* --- PRICE & GENRE ROW (EXACT SAME LEVEL FIXED) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Price Section */}
          <div className="flex flex-col space-y-4">
            <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1">
              Price (USD)
            </Label>
            <div className="relative h-[70px]"> 
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#ff1e6d] font-black text-xl z-10">$</span>
              <Input
                name="price"
                type="number"
                step="0.01"
                className="w-full h-full pl-12 bg-black/40 border-zinc-800 text-white font-black text-xl rounded-[22px] focus:border-[#ff1e6d] focus:ring-0"
                placeholder="9.99"
                required
              />
            </div>
          </div>

          {/* Genre Section */}
          <div className="flex flex-col space-y-4">
            <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1">
              Select Genre
            </Label>
            <div className="h-[70px]"> 
              <Select onValueChange={setGenre}>
                <SelectTrigger className="w-full h-full bg-black/40 border-zinc-800 text-zinc-100  font-bold rounded-[22px] focus:ring-0 focus:border-[#ff1e6d] px-6 py-8.5">
                  <SelectValue placeholder="Choose Genre" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c0e] border-zinc-800 text-white font-bold rounded-2xl">
                  {["Fantasy", "Horror", "Sci-Fi", "Romance", "Mystery", "Biography"].map(g => (
                    <SelectItem key={g} value={g} className="py-3 focus:bg-[#ff1e6d] focus:text-white cursor-pointer uppercase text-xs font-black tracking-widest">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

        {/* Cover Art Box */}
        <div className="flex flex-col gap-3">
          <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1 leading-none">Cover Art</Label>
          {!preview ? (
            <label htmlFor="book-img" className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-zinc-800 rounded-[35px] cursor-pointer hover:border-[#ff1e6d] bg-black/30 transition-all group overflow-hidden shadow-inner">
              <Upload className="text-zinc-600 mb-2 group-hover:scale-110 transition-transform" size={28} />
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[3px]">Select Image</span>
              <input type="file" id="book-img" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative h-72 w-full rounded-[35px] overflow-hidden border border-zinc-800 shadow-2xl">
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button type="button" onClick={() => { setPreview(null); setSelectedFile(null); }} className="bg-red-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <Label className="text-zinc-100 font-black text-[11px] uppercase tracking-[4px] ml-1 leading-none">Full Description</Label>
          <textarea name="description" className="w-full bg-black/40 border border-zinc-800 rounded-[30px] p-8 text-white font-medium h-48 focus:border-[#ff1e6d] outline-none text-lg leading-relaxed" placeholder="Tell your story..." required></textarea>
        </div>

        <Button disabled={loading} className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-[80px] rounded-[25px] font-black text-2xl shadow-[0_15px_40px_rgba(255,30,109,0.3)] active:scale-95 transition-all">
          {loading ? <div className="flex items-center gap-3"><Loader2 className="animate-spin" /> Publishing...</div> : "Publish masterpiece"}
        </Button>
      </form>
    </div>
  );
};

export default AddEbookTab;