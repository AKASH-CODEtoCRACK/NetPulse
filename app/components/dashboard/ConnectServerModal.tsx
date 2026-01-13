"use client";

import { useUser } from "@clerk/nextjs"; // Get User ID
import { Copy, Terminal, X, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectServerModal({ isOpen, onClose }: ModalProps) {
  const { user } = useUser(); // Get the logged-in user
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  // Get the current website URL (works for localhost AND production)
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!isOpen) return null;

  // --- THE MAGIC COMMAND ---
  // 1. curl downloads the script from YOUR website
  // 2. bash -s passes two arguments: USER_ID and YOUR_WEBSITE_URL
  const installCommand = `curl -sL ${origin}/install.sh | sudo bash -s -- ${user?.id} ${origin}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-[#1e293b]">
          <div>
            <h2 className="text-xl font-bold text-white">Connect Your Server</h2>
            <p className="text-slate-400 text-sm mt-1">Run this command on your Linux VPS (Ubuntu/Debian)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Command Box */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative bg-[#020617] rounded-lg p-4 border border-slate-800 font-mono text-sm text-slate-300 break-all">
              <span className="text-green-400 select-none">$ </span>
              {installCommand}
            </div>
            <button 
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors border border-slate-700"
              title="Copy Command"
            >
              {copied ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
            </button>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="bg-blue-500/10 w-fit p-2 rounded-lg mb-3">
                <Terminal className="text-blue-400" size={20} />
              </div>
              <h4 className="font-semibold text-white mb-1">1. Open Terminal</h4>
              <p className="text-slate-500">SSH into your server or open your local terminal.</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="bg-purple-500/10 w-fit p-2 rounded-lg mb-3">
                <Copy className="text-purple-400" size={20} />
              </div>
              <h4 className="font-semibold text-white mb-1">2. Run Command</h4>
              <p className="text-slate-500">Paste the command. It installs Node.js & the agent.</p>
            </div>
             <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="bg-green-500/10 w-fit p-2 rounded-lg mb-3">
                <Check className="text-green-400" size={20} />
              </div>
              <h4 className="font-semibold text-white mb-1">3. Live Data</h4>
              <p className="text-slate-500">Dashboard updates automatically in 5 seconds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}