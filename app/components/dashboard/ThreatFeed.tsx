"use client";

import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Lock, Activity } from "lucide-react";

export function ThreatFeed() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Poll the API every 2 seconds to get the latest alerts
  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch("/api/user/security"); // <--- This calls your new API
        const data = await res.json();
        setEvents(data);
      } catch (e) {
        console.error("Failed to load threats");
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#151e32] p-6 rounded-xl border border-slate-800 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Lock size={18} className="text-amber-400" /> Threat Intelligence
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
           <div className="text-slate-500 text-sm text-center">Scanning logs...</div>
        ) : events.length === 0 ? (
           // Show this if NO threats are found
           <div className="text-slate-500 text-sm text-center flex flex-col items-center justify-center h-32">
              <Shield size={32} className="mb-2 opacity-20" />
              <p>No recent threats detected.</p>
              <p className="text-xs">System is secure.</p>
           </div>
        ) : (
          // Show this if threats ARE found
          events.map((event: any, i) => (
            <div key={i} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-bold ${event.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                  {event.type.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2 break-all">{event.message}</p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-slate-950/50 p-1.5 rounded w-fit">
                <Activity size={10} /> SRC: {event.sourceIp}
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-dashed border-slate-700">
        View Full Audit Logs
      </button>
    </div>
  );
}