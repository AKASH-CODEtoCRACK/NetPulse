"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X, Clock } from "lucide-react";

interface WarningProps {
  plan: string;
  daysLeft: number;
  credits: number;
}

export function SubscriptionWarning({ plan, daysLeft, credits }: WarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"warning" | "info">("info");

  useEffect(() => {
    // LOGIC: When to show warning?
    
    // 1. Pro Plan Expiring Soon (Day 28, 29, 30)
    if (plan === "pro" && daysLeft <= 2) {
      setMessage(`Your Pro subscription renews in ${daysLeft} days.`);
      setType("warning");
      setIsVisible(true);
    }
    // 2. Low Credits Warning (Below 20%)
    else if (credits < 20) {
      setMessage(`Running low on credits (${credits} left).`);
      setType("warning");
      setIsVisible(true);
    }
    
  }, [plan, daysLeft, credits]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className={`p-4 rounded-xl shadow-2xl border flex items-start gap-4 max-w-sm backdrop-blur-md ${
        type === "warning" 
          ? "bg-amber-900/80 border-amber-500/50 text-amber-100" 
          : "bg-slate-900/90 border-slate-700 text-slate-200"
      }`}>
        <div className={`p-2 rounded-full ${type === "warning" ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"}`}>
          {type === "warning" ? <AlertTriangle size={20} /> : <Clock size={20} />}
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-1">Subscription Update</h4>
          <p className="text-xs opacity-90 leading-relaxed">
            {message}
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}