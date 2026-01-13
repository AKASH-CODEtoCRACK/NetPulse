"use client";

import { useEffect, useState } from "react";
import { Zap, Server, Activity, ShieldCheck } from "lucide-react";

export function KpiGrid() {
  const [stats, setStats] = useState({
    cpu: 0,
    ram: 0,
    activeConnections: 12, // Still mock for now
    threats: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to load stats");
      }
    };

    fetchStats();
    // Refresh every 2 seconds to match the graphs
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: "CPU Load",
      value: `${stats.cpu}%`, // Real Data
      sub: "4 Cores Active", // Static (Agent doesn't send core count yet)
      icon: Zap,
      color: "text-amber-400",
      border: "border-amber-400/20",
      glow: "shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)]",
    },
    {
      label: "Memory Usage",
      value: `${stats.ram}%`, // Real Data
      sub: "Real-time utilization",
      icon: Server,
      color: "text-purple-400",
      border: "border-purple-400/20",
      glow: "shadow-[0_0_20px_-5px_rgba(192,132,252,0.3)]",
    },
    {
      label: "Network Status", // Renamed from "Live Connections"
      value: "Active",
      sub: "Data flowing",
      icon: Activity,
      color: "text-blue-400",
      border: "border-blue-400/20",
      glow: "shadow-[0_0_20px_-5px_rgba(96,165,250,0.3)]",
    },
    {
      label: "Security Events",
      value: stats.threats, // Real Data
      sub: "Threats detected",
      icon: ShieldCheck,
      color: "text-emerald-400",
      border: "border-emerald-400/20",
      glow: "shadow-[0_0_20px_-5px_rgba(52,211,153,0.3)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <div key={i} className={`bg-[#151e32] p-6 rounded-xl border border-slate-800 ${card.glow} relative overflow-hidden group hover:border-slate-600 transition-all`}>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-slate-900/50 ${card.color} border ${card.border}`}>
                <card.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                 {/* Blinking Dot for Live Status */}
                 <span className="flex h-3 w-3 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${card.color.replace('text-', 'bg-')}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${card.color.replace('text-', 'bg-')}`}></span>
                 </span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-400 text-sm font-medium">{card.label}</h3>
              <p className="text-3xl font-bold text-white tracking-tight">{card.value}</p>
              <p className="text-xs text-slate-500">{card.sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}