"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Book, PenTool, CheckCircle2, Image as ImageIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();
  const [role, setRole] = useState('reader');
  const [imgUrl, setImgUrl] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  const toastId = toast.loading("Creating your profile...");

  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name: `${firstName} ${lastName}`,
    image: imgUrl,
    
    role: role, 
  }, {
    onSuccess: () => {
      toast.success("Account created! Redirecting to login...", { id: toastId });
      router.push('/');
    },
    onError: (ctx) => {
      toast.error(ctx.error.message || "Registration failed", { id: toastId });
    }
  });
  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] py-16 px-4 font-sans">
      <div className="w-full max-w-[500px] bg-[#111113] border border-zinc-800/50 p-10 rounded-[40px] shadow-2xl">
        
        <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-zinc-800/50">
          <button type="button" onClick={() => router.push('/login')} className="flex-1 text-zinc-500 py-2.5 rounded-xl text-sm font-bold hover:text-white transition-all">Login</button>
          <button type="button" onClick={() => router.push('/register')} className="flex-1 bg-[#ff1e6d] text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-pink-500/20">Register</button>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create account</h2>
        <p className="text-zinc-500 mb-8 text-sm">Join Fable as a reader or writer.</p>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="flex items-center gap-4 bg-zinc-900/30 p-4 rounded-3xl border border-zinc-800/40">
            <Avatar className="h-16 w-16 border-2 border-[#ff1e6d] p-0.5 shrink-0">
              <AvatarImage src={imgUrl} className="object-cover rounded-full" />
              <AvatarFallback className="bg-zinc-800 text-zinc-500 text-[10px]">PREVIEW</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <Label className="text-[11px] text-zinc-400 ml-1">Profile Image URL</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 text-zinc-600" size={14} />
                <Input 
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="bg-black/40 border-zinc-800 h-9 pl-9 text-white text-xs rounded-xl focus:border-[#ff1e6d]" 
                  placeholder="https://images.com/photo.jpg" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-white">
              <Label className="text-zinc-300 text-xs ml-1">First Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-zinc-600" size={18} />
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-black/30 border-zinc-800 h-12 pl-12 text-white rounded-2xl focus:border-[#ff1e6d]" placeholder="John" required />
              </div>
            </div>
            <div className="space-y-1.5 text-white">
              <Label className="text-zinc-300 text-xs ml-1">Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-black/30 border-zinc-800 h-12 px-5 text-white rounded-2xl focus:border-[#ff1e6d]" placeholder="Doe"  />
            </div>
          </div>

          <div className="space-y-1.5 text-white">
            <Label className="text-zinc-300 text-xs ml-1 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-zinc-600" size={18} />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/30 border-zinc-800 h-12 pl-12 text-white rounded-2xl focus:border-[#ff1e6d]" placeholder="john@example.com" required />
            </div>
          </div>

          <div className="space-y-1.5 text-white">
            <Label className="text-zinc-300 text-xs ml-1 font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-zinc-600" size={18} />
              <Input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"} 
                className="bg-black/30 border-zinc-800 h-12 pl-12 pr-12 text-white rounded-2xl focus:border-[#ff1e6d]" 
                placeholder="••••••••" 
                required 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-zinc-600 hover:text-white">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-zinc-300 text-xs ml-1">I am joining as a...</Label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setRole('reader')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${role === 'reader' ? 'border-[#ff1e6d] bg-[#ff1e6d]/5' : 'border-zinc-800 bg-black/20'}`}
              >
                <div className="flex justify-between mb-1">
                   <Book size={20} className={role === 'reader' ? 'text-[#ff1e6d]' : 'text-zinc-500'} />
                   {role === 'reader' && <CheckCircle2 size={16} className="text-[#ff1e6d]" />}
                </div>
                <p className="font-bold text-white text-sm">Reader</p>
                <p className="text-[10px] text-zinc-500">Read & buy ebooks</p>
              </div>

              <div 
                onClick={() => setRole('writer')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${role === 'writer' ? 'border-[#ff1e6d] bg-[#ff1e6d]/5' : 'border-zinc-800 bg-black/20'}`}
              >
                <div className="flex justify-between mb-1">
                   <PenTool size={20} className={role === 'writer' ? 'text-[#ff1e6d]' : 'text-zinc-500'} />
                   {role === 'writer' && <CheckCircle2 size={16} className="text-[#ff1e6d]" />}
                </div>
                <p className="font-bold text-white text-sm">Writer</p>
                <p className="text-[10px] text-zinc-500">Publish & sell ebooks</p>
              </div>
            </div>
          </div>

          <Button disabled={loading} type="submit" className="w-full h-14 bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : "Create My Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;