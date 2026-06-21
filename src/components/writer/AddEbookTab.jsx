"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Upload, Loader2, Sparkles, BookOpen, X } from "lucide-react";

const AddEbookTab = ({ setActiveTab }) => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  
  // States for Image Handling
  const [preview, setPreview] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null); 

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  // আপনার দেওয়া লেটেস্ট সচল এপিআই কী
  const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 

  // ইমেজ সিলেক্ট করলে যা হবে
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // ভ্যালিডেশন
    if (!session?.user?.email) return toast.error("Please login first");
    if (!selectedFile) return toast.error("Please select a cover art image");

    setLoading(true);
    const toastId = toast.loading("Connecting to servers...");

    try {
      // ১. ImgBB-তে ইমেজ আপলোড
      toast.loading("Uploading cover art to ImgBB...", { id: toastId });
      const formData = new FormData();
      formData.append('image', selectedFile);

      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: formData
      });
      const imgData = await imgRes.json();

      if (!imgData.success) {
        throw new Error(imgData.error?.message || "ImgBB Upload Failed");
      }

      // ২. সফলভাবে আপলোড হওয়ার পর পাওয়া লিঙ্ক
      const finalImageUrl = imgData.data.url;
      toast.loading("Finalizing and publishing book...", { id: toastId });

      // ৩. আপনার ব্যাকেন্ড ডাটাবেসে সেভ করা
      const bookInfo = {
        title: e.target.title.value,
        price: parseFloat(e.target.price.value),
        genre: e.target.genre.value,
        description: e.target.description.value,
        image: finalImageUrl, // এখানে 'finalImageUrl' ব্যবহার করা হয়েছে
        writerEmail: session.user.email,
        writerName: session.user.name,
        status: "Pending", // রাইটার আপলোড করলে পেন্ডিং থাকবে
        createdAt: new Date()
      };

      const res = await fetch(`${SERVER_URL}/api/writer/add-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookInfo)
      });

      if (res.ok) {
        toast.success("Ebook Published! Waiting for Admin approval.", { id: toastId });
        setActiveTab("my-ebooks"); // সাকসেস হলে লিস্টে ফিরে যাবে
      } else {
        throw new Error("Failed to save to Fable database");
      }

    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4 mb-10 text-white italic">
         <BookOpen className="text-[#ff1e6d]" size={32} />
         <h2 className="text-4xl font-black uppercase tracking-tighter">Writer Studio</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-6 bg-[#111113] p-10 rounded-[45px] border border-zinc-800 shadow-2xl text-white">
        
        <div className="space-y-2">
          <Label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest ml-1">Ebook Title</Label>
          <Input name="title" className="bg-black/40 border-zinc-800 h-14 text-white font-bold rounded-2xl focus:border-[#ff1e6d] focus:ring-0" placeholder="Title here..." required />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest ml-1">Price (USD)</Label>
            <Input name="price" type="number" step="0.01" className="bg-black/40 border-zinc-800 h-14 text-[#ff1e6d] font-black text-xl rounded-2xl focus:border-[#ff1e6d]" placeholder="9.99" required />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest ml-1">Genre</Label>
            <Input name="genre" className="bg-black/40 border-zinc-800 h-14 text-white font-bold rounded-2xl focus:border-[#ff1e6d]" placeholder="Fantasy" required />
          </div>
        </div>

        {/* --- Image Selection with Preview --- */}
        <div className="space-y-2">
          <Label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest ml-1">Book Cover art</Label>
          {!preview ? (
            <label htmlFor="book-img" className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-zinc-800 rounded-[30px] cursor-pointer hover:border-[#ff1e6d] bg-black/20 transition-all group">
              <Upload className="text-zinc-600 mb-2 group-hover:text-[#ff1e6d] transition-colors" size={28} />
              <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Select Cover Image</span>
              <input type="file" id="book-img" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative h-64 w-full rounded-[30px] overflow-hidden border border-zinc-800 shadow-xl">
               <img src={preview} className="w-full h-full object-cover" alt="Preview" />
               <button 
                type="button" 
                onClick={() => { setPreview(null); setSelectedFile(null); }}
                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
               >
                 <X size={16} />
               </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest ml-1">Full Description</Label>
          <textarea name="description" className="w-full bg-black/40 border border-zinc-800 rounded-[25px] p-6 text-white font-medium h-40 focus:border-[#ff1e6d] outline-none transition-all" placeholder="Enter book content..." required></textarea>
        </div>

        <Button disabled={loading} className="w-full bg-[#ff1e6d] hover:bg-[#e61a62] text-white h-16 rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(255,30,109,0.3)] active:scale-95 transition-all">
          {loading ? (
            <div className="flex items-center gap-3 italic"><Loader2 className="animate-spin" /> Processing...</div>
          ) : (
            <div className="flex items-center gap-3 uppercase italic">Publish Masterpiece <Sparkles size={20} /></div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddEbookTab;