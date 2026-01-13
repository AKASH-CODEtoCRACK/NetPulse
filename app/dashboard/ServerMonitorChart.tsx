"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

export function ServerMonitorChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/user/logs");
      const logs = await res.json();
      
      // Format time for X-Axis (e.g., "10:45:01")
      const formattedData = logs.map((log: any) => ({
        ...log,
        time: new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })
      }));
      
      setData(formattedData);
    } catch (err) {
      console.error("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Auto-refresh every 5 seconds (Live Monitoring effect)
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-500">Loading metrics...</div>;
  if (data.length === 0) return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-900/50">
          <Activity size={32} className="mb-2 opacity-50" />
          <p>No data received yet.</p>
          <p className="text-xs mt-1">Run the agent script to see live metrics.</p>
      </div>
  );

  return (
    <div className="w-full h-[300px] bg-[#151e32] p-6 rounded-xl border border-slate-800 shadow-lg overflow-hidden flex flex-col min-w-0">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
         <Activity size={18} className="text-cyan-400" /> Live Server Performance
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {/* Gradient for CPU */}
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            {/* Gradient for RAM */}
            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickMargin={10} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
            itemStyle={{ fontSize: '12px' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="cpu" 
            stroke="#06b6d4" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCpu)" 
            name="CPU %"
          />
          <Area 
            type="monotone" 
            dataKey="ram" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRam)" 
            name="RAM %"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}