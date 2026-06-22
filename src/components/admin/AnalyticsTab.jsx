"use client"
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const AnalyticsTab = () => {
  const [stats, setStats] = useState(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/stats`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, [SERVER_URL]);

  if (!stats) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff1e6d]" /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">System <span className="text-[#ff1e6d]">Insights</span></h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-8 bg-[#111113] border border-zinc-800/80 rounded-[40px] shadow-2xl group hover:border-[#ff1e6d]/40 transition-all">
           <div className="bg-[#ff1e6d]/10 h-12 w-12 rounded-2xl flex items-center justify-center mb-4"><Users className="text-[#ff1e6d]" size={24} /></div>
           <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[3px]">Total Users</p>
           <h4 className="text-4xl font-black text-white mt-1">{stats.totalUsers}</h4>
        </div>
        <div className="p-8 bg-[#111113] border border-zinc-800/80 rounded-[40px] shadow-2xl group hover:border-[#ff1e6d]/40 transition-all">
           <div className="bg-[#ff1e6d]/10 h-12 w-12 rounded-2xl flex items-center justify-center mb-4"><BookOpen className="text-[#ff1e6d]" size={24} /></div>
           <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[3px]">Total Ebooks</p>
           <h4 className="text-4xl font-black text-white mt-1">{stats.totalBooks}</h4>
        </div>
        <div className="p-8 bg-[#ff1e6d]/10 border border-[#ff1e6d]/20 rounded-[40px] shadow-2xl">
           <div className="bg-[#ff1e6d] h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg"><DollarSign size={24} /></div>
           <p className="text-[#ff1e6d] font-bold text-[10px] uppercase tracking-[3px]">Total Revenue</p>
           <h4 className="text-4xl font-black text-white mt-1">${stats.totalRevenue.toFixed(2)}</h4>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="bg-[#111113] border border-zinc-800/80 rounded-[45px] p-8 lg:p-12 shadow-2xl">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-white italic tracking-tight">Platform Growth</h3>
            <div className="bg-zinc-900 px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 border border-zinc-800">Last 6 Months</div>
         </div>
         <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff1e6d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff1e6d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#3f3f46" fontSize={12} tickLine={false} axisLine={false} dy={15} />
                <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #27272a', borderRadius: '15px'}} />
                <Area type="monotone" dataKey="sales" stroke="#ff1e6d" strokeWidth={5} fillOpacity={1} fill="url(#colorPink)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </Card>
    </div>
  );
};

export default AnalyticsTab;