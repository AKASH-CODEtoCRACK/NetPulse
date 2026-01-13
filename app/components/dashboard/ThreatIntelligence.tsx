"use client";

import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Lock, Activity, Eye } from "lucide-react";
import { SecurityAuditModal } from "./SecurityAuditModal"; // Import the new modal

export function ThreatIntelligence() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  // Poll for latest threats (Standard 5 items)
  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch("/api/user/security");
        const data = await res.json();
        setEvents(data);
      } catch (e) { console.error("Failed to load threats"); } 
      finally { setLoading(false); }
    };
    fetchThreats();
    const interval = setInterval(fetchThreats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* --- Main Card --- */}
      <div className="bg-[#151e32] p-6 rounded-xl border border-slate-800 shadow-lg h-[350px] flex flex-col"> {/* Fixed Height 350px */}
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Lock size={18} className="text-amber-400" /> Threat Intelligence
          </h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </div>

        {/* Scrollable List Area */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
          {loading ? (
             <div className="text-slate-500 text-xs text-center py-10">Scanning logs...</div>
          ) : events.length === 0 ? (
             <div className="text-slate-500 text-sm text-center flex flex-col items-center justify-center h-full">
                <Shield size={32} className="mb-2 opacity-20" />
                <p>System Secure</p>
             </div>
          ) : (
            events.map((event: any, i) => (
              <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-bold ${event.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                    {event.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                  <Activity size={10} /> SRC: {event.sourceIp}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Button */}
        <div className="pt-4 mt-auto border-t border-slate-800/50 flex-shrink-0">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/30 hover:bg-slate-800 rounded-lg transition-colors border border-dashed border-slate-700 flex items-center justify-center gap-2"
            >
                <Eye size={12} /> View Full Audit Logs
            </button>
        </div>
      </div>

      {/* --- The Modal --- */}
      <SecurityAuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}