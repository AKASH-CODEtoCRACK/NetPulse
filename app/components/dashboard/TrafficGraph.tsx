"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Wifi, Leaf } from "lucide-react";
import { useCarbon } from "../../context/CarbonContext"; // Ensure path is correct

interface TrafficGraphProps {
  data: any[]; // The 'history' data from your hook
}

export function TrafficGraph({ data }: TrafficGraphProps) {
  // 1. Get Carbon Mode State
  const { isCarbonMode } = useCarbon();

  // 2. Define Colors Dynamically based on Mode
  // Normal: Cyan (Down) / Emerald (Up)
  // Carbon: Emerald (Down) / Lime (Up) - Greener theme
  const downColor = isCarbonMode ? "#10b981" : "#06b6d4"; 
  const upColor = isCarbonMode ? "#84cc16" : "#10b981"; 

  return (
    <div className="lg:col-span-2 bg-[#151e32] rounded-xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Wifi size={18} className={isCarbonMode ? "text-green-400" : "text-cyan-400"}/> 
          Network Traffic (I/O)
          
          {/* Carbon Mode Badge */}
          {isCarbonMode && (
             <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-500/30 px-2 py-0.5 rounded flex items-center gap-1 animate-in fade-in">
               <Leaf size={10} /> ECO
             </span>
           )}
        </h2>
        
        {/* Legend - Colors update automatically */}
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ background: downColor }}></div> Download
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ background: upColor }}></div> Upload
          </span>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {/* Dynamic Gradients */}
              <linearGradient id="downGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={downColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={downColor} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="upGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={upColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={upColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickMargin={10} 
              axisLine={false} 
              tickLine={false}
            />
            
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `${val} MB`}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            
            {/* Download Area */}
            <Area 
              type="monotone" 
              dataKey="download" 
              stroke={downColor} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#downGradient)" 
              isAnimationActive={!isCarbonMode} // <--- CPU SAVER
            />
            
            {/* Upload Area */}
            <Area 
              type="monotone" 
              dataKey="upload" 
              stroke={upColor} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#upGradient)" 
              isAnimationActive={!isCarbonMode} // <--- CPU SAVER
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}