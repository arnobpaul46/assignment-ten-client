"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Book, PenTool, CheckCircle2 } from "lucide-react";
import Link from 'next/link';

const RegisterForm = () => {
  const [role, setRole] = useState('reader');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] py-16">
      <div className="w-full max-w-[500px] bg-[#111113] border border-zinc-800/50 p-10 rounded-[40px] shadow-2xl">
        
        <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
        <p className="text-zinc-500 mb-10 text-sm">Join Fable as a reader or writer.</p>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">First Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-zinc-600" size={18} />
                <Input className="bg-black/20 border-zinc-800 h-12 pl-12 rounded-2xl" placeholder="Lyra" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Last Name</Label>
              <Input className="bg-black/20 border-zinc-800 h-12 px-5 rounded-2xl" placeholder="Chen" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-zinc-600" size={18} />
              <Input className="bg-black/20 border-zinc-800 h-12 pl-12 rounded-2xl" placeholder="lyra@fable.io" />
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-3">
            <Label className="text-zinc-400">I am joining as a...</Label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setRole('reader')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${role === 'reader' ? 'border-[#ff1e6d] bg-[#ff1e6d]/5' : 'border-zinc-800 bg-black/20'}`}
              >
                <div className="flex justify-between mb-2">
                   <Book size={20} className={role === 'reader' ? 'text-[#ff1e6d]' : 'text-zinc-500'} />
                   {role === 'reader' && <CheckCircle2 size={16} className="text-[#ff1e6d]" />}
                </div>
                <p className="font-bold text-white text-sm">Reader</p>
                <p className="text-[10px] text-zinc-500">Discover & buy ebooks</p>
              </div>

              <div 
                onClick={() => setRole('writer')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${role === 'writer' ? 'border-[#ff1e6d] bg-[#ff1e6d]/5' : 'border-zinc-800 bg-black/20'}`}
              >
                <div className="flex justify-between mb-2">
                   <PenTool size={20} className={role === 'writer' ? 'text-[#ff1e6d]' : 'text-zinc-500'} />
                   {role === 'writer' && <CheckCircle2 size={16} className="text-[#ff1e6d]" />}
                </div>
                <p className="font-bold text-white text-sm">Writer</p>
                <p className="text-[10px] text-zinc-500">Publish & sell ebooks</p>
              </div>
            </div>
          </div>

          <Button className="w-full h-14 bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-500/10">
            Create My Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;