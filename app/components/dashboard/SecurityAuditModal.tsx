"use client";

import { useEffect, useState } from "react";
import { X, ShieldAlert, Clock, Globe, Terminal } from "lucide-react";

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityAuditModal({ isOpen, onClose }: SecurityAuditModalProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch full history when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchAllLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/security?all=true");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    };

    fetchAllLogs();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] w-full max-w-4xl max-h-[80vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-[#1e293b]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="text-red-500" /> Security Audit Log
            </h2>
            <p className="text-slate-400 text-sm mt-1">Full history of detected threats and mitigation events.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
             <div className="text-center py-20 text-slate-500">Loading audit history...</div>
          ) : (
            <div className="w-full text-left border-collapse">
                <table className="w-full text-sm text-slate-300">
                    <thead className="text-slate-500 font-medium border-b border-slate-700">
                        <tr>
                            <th className="pb-3 pl-2">TIMESTAMP</th>
                            <th className="pb-3">SEVERITY</th>
                            <th className="pb-3">EVENT TYPE</th>
                            <th className="pb-3">SOURCE IP</th>
                            <th className="pb-3">DETAILS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {logs.map((log, i) => (
                            <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 pl-2 font-mono text-xs text-slate-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                        log.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                        {log.severity}
                                    </span>
                                </td>
                                <td className="py-3 font-medium text-white">{log.type}</td>
                                <td className="py-3 font-mono text-xs text-slate-400">{log.sourceIp}</td>
                                <td className="py-3 text-slate-400 max-w-xs truncate" title={log.message}>
                                    {log.message}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-[#1e293b] flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
            Close Log
          </button>
        </div>
      </div>
    </div>
  );
}