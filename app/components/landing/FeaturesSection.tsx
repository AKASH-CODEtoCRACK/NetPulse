"use client";

import {
  Lock,
  Shield,
  Zap,
  Globe,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Dummy Threat Data for the Animation
const THREATS = [
  { id: 1, msg: "Port Scan Detected", ip: "45.33.22.11", type: "warning" },
  { id: 2, msg: "SQL Injection Attempt", ip: "192.168.1.5", type: "critical" },
  { id: 3, msg: "SSH Brute Force", ip: "10.0.0.88", type: "error" },
];

export function FeaturesSection() {
  const [activeThreat, setActiveThreat] = useState(0);
  // NEW: Start with 3, but we will change it dynamically
  const [threatCount, setThreatCount] = useState(3);



  //Animation: Cycle through threats every 3 seconds to show activity and to change the threat count dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Cycle the card
      setActiveThreat((prev) => (prev + 1) % THREATS.length);

      // 2. Randomize the "Critical Threats" count (Between 2 and 12)
      setThreatCount(Math.floor(Math.random() * 10) + 2);
    }, 5000); // Updates every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 bg-[#0B1120] overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Advanced Threat Intelligence
        </h2>
        <p className="text-slate-400 text-lg">
          NetPulse doesn't just watch traffic. It analyzes patterns to detect
          attacks before they breach your firewall.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Feature List */}
        <div className="space-y-8">
          <FeatureItem
            icon={<Shield className="text-emerald-400" />}
            title="DDoS Mitigation"
            desc="Automatically blocks IPs that exceed request thresholds within 500ms."
          />
          <FeatureItem
            icon={<Zap className="text-amber-400" />}
            title="Latency Heatmaps"
            desc="Visualize global latency to route traffic to the fastest healthy node."
          />
          <FeatureItem
            icon={<Globe className="text-blue-400" />}
            title="Geo-Fencing"
            desc="Restrict access to your infrastructure by country or region instantly."
          />
        </div>

        {/* Right Side: The "Locked" Threat Feed */}
        <div className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-cyan-500/20 to-transparent">
          {/* THE LOCKED OVERLAY - Improved Visibility */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl transition-all duration-500 cursor-pointer">
            {/* The Blur Layer: We use 'backdrop-blur-[2px]' instead of 'sm' so users can SEE the data behind it */}
            <div className="absolute inset-0 bg-[#0B1120]/40 backdrop-blur-[2px] group-hover:backdrop-blur-none group-hover:bg-[#0B1120]/80 transition-all duration-500 rounded-2xl"></div>

            {/* The Content sitting ON TOP of the blur */}
            <div className="relative z-30 transform transition-transform duration-300 group-hover:scale-105">
              <div className="bg-slate-900 p-4 rounded-full border border-cyan-500/30 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.2)] mx-auto w-16 h-16 flex items-center justify-center group-hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                <Lock size={28} className="text-cyan-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                Live Threat Feed
              </h3>

              <p className="text-slate-200 mb-6 font-medium text-sm max-w-[250px] mx-auto drop-shadow-md">
                {/* The number now changes automatically! */}
                <span className="text-cyan-400 font-bold">
                  {threatCount} Critical Threats
                </span>{" "}
                detected in your region. Unlock to view details.
              </p>
              {/* <p className="text-slate-200 mb-6 font-medium text-sm max-w-[250px] mx-auto drop-shadow-md">
                <span className="text-cyan-400 font-bold">
                  3 Critical Threats
                </span>{" "}
                detected in your region. Unlock to view details.
              </p> */}

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Unlock Access <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* The Content BEHIND the blur (Make it brighter so it shines through) */}
          <div className="bg-[#151e32] rounded-2xl border border-slate-700/50 p-8 shadow-2xl relative z-10">
            <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2 font-mono text-sm text-cyan-400">
                <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
                LIVE FEED
              </div>
              <div className="text-xs text-slate-500">Real-time</div>
            </div>

            {/* Animated Cards - Brighter Text */}
            <div className="space-y-4">
              {THREATS.map((threat, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border border-slate-700 bg-slate-800 flex items-center gap-4 transition-all duration-500 ${
                    idx === activeThreat
                      ? "scale-105 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-slate-800"
                      : "opacity-40"
                  }`}
                >
                  <AlertTriangle
                    className={`
              ${threat.type === "critical" ? "text-red-500" : "text-amber-500"}
            `}
                    size={20}
                  />
                  <div>
                    <div className="font-bold text-sm text-white">
                      {threat.msg}
                    </div>{" "}
                    {/* Changed to white for better visibility through blur */}
                    <div className="text-xs font-mono text-slate-400">
                      SRC: {threat.ip}
                    </div>
                  </div>
                  {idx === activeThreat && (
                    <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold animate-pulse">
                      DETECTED
                    </span>
                  )}
                </div>
              ))}

              {/* Fake extra items to fill space */}
              <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 opacity-30">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper Component for the Left List
function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-900/50 transition-colors border border-transparent hover:border-slate-800">
      <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
