"use client"
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Cookies from 'js-cookie'; 

const AnalyticsTab = () => {
  const [stats, setStats] = useState(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchStats = async () => {
      const token = Cookies.get('access-token');
      if (!token) return;

      try {
        const res = await fetch(`${SERVER_URL}/api/admin/stats`, {
          headers: { authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setStats(data);
      } catch (err) { console.error(err); }
    };
    if (SERVER_URL) fetchStats();
  }, [SERVER_URL]);

  if (!stats) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" size={40} /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase px-2">System <span className="text-[#ff1e6d]">Insights</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-8 bg-[#111113] border border-zinc-800/80 rounded-[40px] shadow-2xl">
           <div className="bg-[#ff1e6d]/10 h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-[#ff1e6d]"><Users size={24} /></div>
           <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[3px]">Total Users</p>
           <h4 className="text-4xl font-black text-white mt-1">{stats.totalUsers || 0}</h4>
        </div>
        <div className="p-8 bg-[#111113] border border-zinc-800/80 rounded-[40px] shadow-2xl">
           <div className="bg-[#ff1e6d]/10 h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-[#ff1e6d]"><BookOpen size={24} /></div>
           <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[3px]">Total Ebooks</p>
           <h4 className="text-4xl font-black text-white mt-1">{stats.totalBooks || 0}</h4>
        </div>
        <div className="p-8 bg-[#111113] border border-zinc-800/80 rounded-[40px] shadow-2xl">
           <div className="bg-[#ff1e6d]/10 h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-[#ff1e6d]"><DollarSign size={24} /></div>
           <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[3px]">Total Revenue</p>
           <h4 className="text-4xl font-black text-white mt-1">${(stats.totalRevenue || 0).toFixed(2)}</h4>
        </div>
      </div>

      <Card className="bg-[#111113] border border-zinc-800/80 rounded-[45px] p-6 shadow-2xl">
         <h3 className="text-2xl font-black text-white italic tracking-tight mb-10 ml-4 mt-4 uppercase">Platform Growth</h3>
         <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData || []}>
                <defs><linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff1e6d" stopOpacity={0.4}/><stop offset="95%" stopColor="#ff1e6d" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="name" stroke="#3f3f46" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #27272a', borderRadius: '15px'}} />
                <Area type="monotone" dataKey="sales" stroke="#ff1e6d" strokeWidth={5} fillOpacity={1} fill="url(#colorP)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </Card>
    </div>
  );
};
export default AnalyticsTab;