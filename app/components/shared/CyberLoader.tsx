"use client";

import { Loader2 } from "lucide-react";

interface CyberLoaderProps {
  text?: string;
  fullscreen?: boolean;
}

export function CyberLoader({ text = "INITIALIZING SYSTEM...", fullscreen = false }: CyberLoaderProps) {
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 relative">
      {/* Outer Rotating Ring */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
        
        {/* Inner Pulsing Core */}
        <div className="absolute inset-4 bg-cyan-500/10 rounded-full animate-pulse flex items-center justify-center border border-cyan-500/30">
           <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
        </div>
      </div>

      {/* Loading Text with "Glitch" vibe */}
      <div className="flex flex-col items-center">
        <div className="text-cyan-400 font-bold tracking-[0.2em] text-sm animate-pulse">
          {text}
        </div>
        <div className="text-slate-500 text-[10px] font-mono mt-1">
          ESTABLISHING SECURE CONNECTION
        </div>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-[#0B1120]/90 backdrop-blur-sm z-[9999] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="p-12 flex items-center justify-center">{content}</div>;
}