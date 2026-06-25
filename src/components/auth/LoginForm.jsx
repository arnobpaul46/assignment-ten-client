"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams যোগ করা হয়েছে
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from 'next/link';
import Cookies from 'js-cookie'; // কুকি ইমপোর্ট

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // ইউআরএল চেক করার জন্য
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const redirectTo = searchParams.get('redirectTo');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ১. এই আইডিটি মনে রাখতে হবে
    const toastId = toast.loading("Verifying credentials...");

    try {
      await authClient.signIn.email({ email, password }, {
        onSuccess: async (ctx) => {
          // ২. সাকসেস হলে ঐ নির্দিষ্ট আইডিকে আপডেট করতে হবে
          toast.success("Login Successful!", { id: toastId });

          const loggedUser = { email: ctx.data.user.email };
          const response = await fetch(`${SERVER_URL}/api/jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loggedUser)
          });
          const data = await response.json();
          if (data.token) {
            Cookies.set('access-token', data.token, { expires: 7 });
          }


          if (redirectTo) {
            router.push(redirectTo); 
          } else {
            const role = ctx.data.user.role || "reader";
            if (email === "admin@fable.com" || role === "admin") {
              router.push('/dashboard/admin');
            } else if (role === "writer") {
              router.push('/dashboard/writer');
            } else {
              router.push('/dashboard/reader');
            }
          }
            router.refresh();
          },
          onError: (ctx) => {
            
            toast.error(ctx.error.message || "Invalid email or password", { id: toastId });
            setLoading(false);
          }
        });
    } catch (err) {
      
      toast.dismiss(toastId);
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    try {

      await authClient.signIn.social({
        provider: "google",
        callbackURL:redirectTo|| "/dashboard",
      });
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] py-10 px-4">
      <div className="w-full max-w-[440px] bg-[#111113] border border-zinc-800/50 p-8 rounded-[32px] shadow-2xl">

        <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-zinc-800/50">
          <button type="button" onClick={() => router.push('/login')} className="flex-1 bg-[#ff1e6d] text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-pink-500/20">Login</button>
          <button type="button" onClick={() => router.push('/register')} className="flex-1 text-zinc-500 py-2.5 rounded-xl text-sm font-bold hover:text-white transition-all">Register</button>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
        <p className="text-zinc-500 mb-8 text-sm font-light italic">"Sign in to continue your reading journey."</p>


        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full h-12 bg-black/20 border-zinc-800 hover:bg-black/40 hover:text-white text-white gap-3 rounded-2xl mb-8 font-semibold"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-400 font-medium ml-1">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-zinc-600" size={18} />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/20 border-zinc-800 h-12 pl-12 text-white rounded-2xl focus:border-[#ff1e6d]"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400 font-medium ml-1">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-zinc-600" size={18} />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/20 border-zinc-800 h-12 pl-12 text-white rounded-2xl focus:border-[#ff1e6d]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button disabled={loading} type="submit" className="w-full h-14 bg-[#ff1e6d] hover:bg-[#e61a62] text-white rounded-2xl font-bold text-lg mt-4 shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : "Sign In to Fable"} <ArrowRight size={20} />
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Don't have an account? <Link href="/register" className="text-[#ff1e6d] font-bold hover:underline">Create one free →</Link>
        </p>
      </div>


      <div className="mt-8 p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl text-center max-w-[440px] w-full">
        <p className="text-zinc-500 text-[10px] font-bold mb-3 uppercase tracking-[3px]">Admin Credentials</p>
        <div className="flex justify-center gap-6 text-sm">
          <p className="text-zinc-400 italic">Email: <span className="text-white font-mono ml-1 font-bold">admin@fable.com</span></p>
          <p className="text-zinc-400 italic">Pass: <span className="text-white font-mono ml-1 font-bold">Admin@123</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;