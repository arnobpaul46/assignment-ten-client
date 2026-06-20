"use client"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";

const data = [{n:'Jan', s:4000}, {n:'Feb', s:3000}, {n:'Mar', s:5000}, {n:'Apr', s:4500}, {n:'May', s:6000}, {n:'Jun', s:7000}];

const AnalyticsTab = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-4xl font-black text-white italic tracking-tighter">System <span className="text-[#ff1e6d]">Insights</span></h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#111113] border border-zinc-800/60 rounded-[40px] p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-8 italic">Platform Revenue Growth</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff1e6d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff1e6d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="n" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #27272a', borderRadius: '12px'}} />
                <Area type="monotone" dataKey="s" stroke="#ff1e6d" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Right Small Stats */}
        <div className="space-y-6">
          <div className="p-8 bg-zinc-900/30 border border-zinc-800/60 rounded-[35px]">
             <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[3px] mb-2">Active Users</p>
             <h4 className="text-4xl font-black text-white">12.4k</h4>
          </div>
          <div className="p-8 bg-[#ff1e6d]/10 border border-[#ff1e6d]/20 rounded-[35px]">
             <p className="text-[#ff1e6d] font-bold text-[10px] uppercase tracking-[3px] mb-2">Total Earnings</p>
             <h4 className="text-4xl font-black text-white">$84,200</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsTab;