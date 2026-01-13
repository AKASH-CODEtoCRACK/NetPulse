"use client";

import { useState, useEffect } from "react";
import { Bell, Send, CheckCircle, Smartphone, Copy, Lock, Zap, RefreshCw ,Trash2} from "lucide-react";

interface TelegramProps {
  isPro: boolean;
  isConnected: boolean; // <--- NEW PROP
}

export function TelegramConnect({ isPro, isConnected }: TelegramProps) {
  // Initialize state based on the Database Status!
  const [step, setStep] = useState<"idle" | "connecting" | "connected">(
    isConnected ? "connected" : "idle"
  );
  const [connectCode, setConnectCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  // If the parent says we are connected, update UI instantly
  useEffect(() => {
    if (isConnected) setStep("connected");
  }, [isConnected]);

  const generateCode = async () => {
    if (!isPro) return;
    setLoading(true);
    try {
       const res = await fetch("/api/user/telegram/code", { method: "POST" });
       const data = await res.json();
       if (data.code) {
           setConnectCode(data.code);
           setStep("connecting");
       }
    } catch (err) {
        alert("Failed to generate code");
    } finally {
        setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`/connect ${connectCode}`);
    alert("Code copied!");
  };

  // NEW: Button to check if bot worked
  const checkConnection = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/user/telegram/status");
        const data = await res.json();
        
        if (data.connected) {
            setStep("connected");
        } else {
            alert("Not connected yet. Did you send the code to the bot?");
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const sendTestAlert = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/telegram/test", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        alert("✅ Alert sent! Check your Telegram.");
      } else {
        alert(`❌ Error: ${data.error}`);
        // If error is "No ID found", force UI to disconnect
        if (res.status === 404) setStep("idle");
      }
    } catch (e) {
      alert("Failed to send alert.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if(!confirm("Are you sure you want to disconnect Telegram alerts?")) return;
    setLoading(true);
    try {
      await fetch("/api/user/telegram/disconnect", { method: "POST" });
      setStep("idle");
      setCode("");
    } catch (e) {
      alert("Failed to disconnect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151e32] p-6 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group">
      
      {/* PRO LOCK OVERLAY */}
      {!isPro && (
        <div className="absolute inset-0 z-50 bg-[#151e32]/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 border border-amber-500/20 rounded-xl">
           <div className="p-3 bg-slate-800 rounded-full mb-3 shadow-lg border border-slate-700">
              <Lock size={24} className="text-amber-400" />
           </div>
           <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <Zap size={16} className="text-amber-400" fill="currentColor" /> Pro Feature
           </h3>
           <p className="text-slate-400 text-sm mb-4">
              Upgrade to Pro to get instant Telegram alerts on your phone.
           </p>
           <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg text-sm">
              Unlock Alerts
           </button>
        </div>
      )}

      {/* Background Icon */}
      <Send className={`absolute -right-4 -bottom-4 text-slate-800/50 w-32 h-32 rotate-12 transition-opacity ${!isPro ? 'opacity-20' : 'opacity-100'}`} />

      <div className={`relative z-10 ${!isPro ? 'blur-[1px] opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-2">
           <Smartphone className="text-blue-400" /> Telegram Alerts
        </h3>
        
        {/* STEP 1: IDLE */}
        {step === "idle" && (
            <>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                Get instant notifications on your phone when your server goes offline.
                </p>
                <button 
                onClick={generateCode}
                disabled={loading}
                className="px-4 py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                {loading ? <RefreshCw size={16} className="animate-spin"/> : <Send size={16} />} 
                {loading ? "Generating..." : "Connect Telegram"}
                </button>
            </>
        )}

        {/* STEP 2: CONNECTING */}
        {step === "connecting" && (
            <div className="bg-slate-900/80 p-4 rounded-lg border border-blue-500/30 animate-in fade-in slide-in-from-bottom-2">
               <div className="text-sm text-slate-300 mb-2">
                  1. Open <a href="https://t.me/YourBotName_Bot" target="_blank" className="text-blue-400 font-bold hover:underline">@NetPulseBot</a>
               </div>
               <div className="text-sm text-slate-300 mb-3">
                  2. Send this command:
               </div>
               
               <div className="flex items-center gap-2 mb-4">
                 <code className="bg-black/50 px-3 py-2 rounded border border-slate-700 text-green-400 font-mono text-sm flex-1">
                    /connect {connectCode}
                 </code>
                 <button onClick={handleCopy} className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-400">
                    <Copy size={16} />
                 </button>
               </div>

               {/* NEW: CHECK STATUS BUTTON */}
               <button 
                 onClick={checkConnection}
                 disabled={loading}
                 className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs text-white flex items-center justify-center gap-2 transition-colors"
               >
                 {loading ? <RefreshCw size={14} className="animate-spin" /> : null}
                 I've sent the message, Verify now
               </button>
            </div>
        )}

        {/* STEP 3: CONNECTED */}
        {step === "connected" && (
            <div className="space-y-3 animate-in zoom-in-95">
               <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30 flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                      <CheckCircle size={20} />
                  </div>
                  <div>
                      <div className="text-green-400 font-bold text-sm">Active & Connected</div>
                      <div className="text-green-400/70 text-xs">Alerts configured for this device.</div>
                  </div>
               </div>
                  <button 
                onClick={handleDisconnect}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition-colors"
            >
                <Trash2 size={14} /> Disconnect / Switch Account
            </button>

               {/* NEW TEST BUTTON */}
               <button 
                 onClick={sendTestAlert}
                 disabled={loading}
                 className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded text-xs text-white flex items-center justify-center gap-2 transition-all"
               >
                 <Bell size={14} className={loading ? "animate-swing" : ""} />
                 {loading ? "Sending..." : "Send Test Alert"}
               </button>
            </div>
        )}
      </div>
    </div>
  );
}