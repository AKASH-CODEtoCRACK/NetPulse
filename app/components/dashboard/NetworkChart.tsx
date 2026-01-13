"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wifi } from "lucide-react";

export function NetworkChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Re-use your existing logs API (it now returns networkIn/networkOut automatically!)
        const res = await fetch("/api/user/logs"); 
        const logs = await res.json();
        
        const formatted = logs.map((log: any) => ({
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' }),
          download: log.networkIn || 0,
          upload: log.networkOut || 0
        }));
        setData(formatted);
      } catch (err) { console.error(err); }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#151e32] p-6 rounded-xl border border-slate-800 shadow-lg flex flex-col h-[350px]"> {/* Fixed Height */}
    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
       <Wifi size={18} className="text-green-400" /> Network Traffic (KB/s)
    </h3>
    
    <div className="flex-1 w-full min-h-0"> {/* Flex container ensures chart fills space */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={12} 
              tick={{fill: '#64748b'}}
              tickLine={false}
              axisLine={false}
          />
          <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} KB`} // Format Y-axis text
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
            itemStyle={{ fontSize: '12px' }} 
          />
          
          <Area 
              type="monotone" 
              dataKey="download" 
              stroke="#10b981" 
              fill="url(#colorDown)" 
              strokeWidth={3} 
              name="Download" 
              animationDuration={1000}
          />
          <Area 
              type="monotone" 
              dataKey="upload" 
              stroke="#3b82f6" 
              fill="url(#colorUp)" 
              strokeWidth={3} 
              name="Upload" 
              animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
}