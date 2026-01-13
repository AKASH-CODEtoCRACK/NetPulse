"use client";

import { useTrafficData } from "../../hooks/useTrafficData";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Terminal, Activity, Leaf } from "lucide-react";
import { CyberLoader } from "../shared/CyberLoader";
import { useCarbon } from "../../context/CarbonContext";

export function LivePreview() {
  const { history, realtime, isLoading } = useTrafficData();
  const { isCarbonMode } = useCarbon();

  // Dynamic Color based on mode
  const chartColor = isCarbonMode ? "#10b981" : "#06b6d4"; // Emerald-500 vs Cyan-500

  return (
    <div className="relative bg-[#151e32] border border-slate-800 rounded-xl p-6 shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-500 min-h-[300px] flex flex-col group">
      
      {/* Decorative Blur - Changes color with mode */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none transition-colors duration-500 ${isCarbonMode ? 'bg-green-500/10' : 'bg-cyan-500/10'}`}></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500' : (isCarbonMode ? 'bg-green-500' : 'bg-cyan-500')} animate-pulse`}></div>
           <span className={`text-xs font-mono ${isLoading ? 'text-amber-400' : (isCarbonMode ? 'text-green-400' : 'text-cyan-400')}`}>
             {isLoading ? 'INITIALIZING...' : (isCarbonMode ? 'ECO MODE ACTIVE' : 'LIVE DEMO PREVIEW')}
           </span>
        </div>
        <div className="text-xs text-slate-500 font-mono">US-EAST-1</div>
      </div>

    
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        
        {/* CPU ITEM */}
        <div>
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">CPU Load</div>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-800/50 rounded animate-pulse"></div>
          ) : (
            <div className="text-3xl font-bold text-white animate-in fade-in slide-in-from-bottom-2">{realtime.cpu}%</div>
          )}
        </div>

        {/* MEMORY ITEM */}
        <div>
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">Memory</div>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-800/50 rounded animate-pulse"></div>
          ) : (
            <div className="text-3xl font-bold text-white animate-in fade-in slide-in-from-bottom-2">{realtime.ram}%</div>
          )}
        </div>

        {/* REQ/SEC ITEM */}
        <div>
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">Req/Sec</div>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-800/50 rounded animate-pulse"></div>
          ) : (
            <div className={`text-3xl font-bold animate-in fade-in slide-in-from-bottom-2 ${isCarbonMode ? 'text-green-400' : 'text-cyan-400'}`}>
                {realtime.activeIPs * 4}
            </div>
          )}
        </div>
      </div>

      {/* Graph Area */}
      <div className="h-40 w-full relative -ml-2"> 
        
        {/* Eco Mode Badge */}
        {isCarbonMode && (
          <div className="absolute top-0 right-4 z-20 flex items-center gap-1 bg-green-900/40 border border-green-500/30 text-green-400 px-2 py-1 rounded text-[10px] font-bold animate-in fade-in backdrop-blur-sm">
            <Leaf size={10} /> SAVING ENERGY
          </div>
        )}

        {isLoading ? (
           // Graph Loading State
           <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-50">
             <div className="scale-50">
                <CyberLoader text="" />
             </div>
           </div>
        ) : (
           // Real Graph
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={history}>
               <defs>
                 <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                   <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Area 
                 type="monotone" 
                 dataKey="download" 
                 stroke={chartColor} 
                 strokeWidth={3} 
                 fillOpacity={1} 
                 fill="url(#chartGradient)" 
                 // THE CARBON FEATURE: Disable animation if mode is ON
                 isAnimationActive={!isCarbonMode}
                 animationDuration={1500}
               />
             </AreaChart>
           </ResponsiveContainer>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="mt-auto bg-[#0B1120] rounded-lg p-3 font-mono text-[10px] text-slate-400 border border-slate-800/50 shadow-inner">
        {isLoading ? (
          <div className="flex items-center gap-2">
             <Activity size={12} className="text-amber-500 animate-spin" />
             <span className="text-amber-500/80">Connecting to agent...</span>
          </div>
        ) : (
          <>
            <div className={`flex items-center gap-2 mb-1 ${isCarbonMode ? 'text-green-400' : 'text-emerald-400'}`}>
                <Terminal size={12} /> {isCarbonMode ? 'Optimized Mode' : 'System Normal'}
            </div>
            <div className="opacity-70 animate-pulse">
                {isCarbonMode ? 'Polling rate reduced. Animations paused.' : 'Scanning packets... OK'}
            </div>
          </>
        )}
      </div>

    </div>
  );
}