"use client";

import { Activity, Zap, ShieldCheck, Server, Target, Lightbulb, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] pb-24 text-slate-200">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-800 text-cyan-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Activity size={14} /> Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Monitoring shouldn't require <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">a PhD to setup.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            We built NetPulse because we were tired of clunky, enterprise-grade tools that took weeks to configure. We wanted something that just works—instantly, securely, and beautifully.
          </p>
        </div>
      </section>

      {/* --- VISION & MISSION (Replaces Developer Card) --- */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* VISION CARD */}
          <div className="relative group overflow-hidden p-1 rounded-3xl bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-[#151e32] rounded-[22px] p-8 h-full relative z-10">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 text-cyan-400">
                <Lightbulb size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                To democratize infrastructure observability. We envision a world where every developer—from students in dorm rooms to CTOs in boardrooms—has access to elite-level monitoring tools without the elite-level price tag.
              </p>
            </div>
          </div>

          {/* MISSION CARD */}
          <div className="relative group overflow-hidden p-1 rounded-3xl bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-[#151e32] rounded-[22px] p-8 h-full relative z-10">
              <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                <Target size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                To build the fastest, most intuitive monitoring agent in the world. We are committed to open-source transparency, carbon-efficient code, and ensuring that user data privacy is never compromised for profit.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- CORE VALUES (Mission Grid) --- */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Why Developers Choose Us</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <MissionCard 
            icon={<Zap size={24} className="text-amber-400" />}
            title="Real-Time Clarity"
            desc="We moved beyond 5-minute interval logs. NetPulse streams data second-by-second for instant situational awareness."
          />
          <MissionCard 
            icon={<ShieldCheck size={24} className="text-cyan-400" />}
            title="Security First"
            desc="Built with a zero-trust architecture. Agent data is encrypted end-to-end, ensuring your infrastructure remains secure."
          />
          <MissionCard 
            icon={<Server size={24} className="text-purple-400" />}
            title="Developer Centric"
            desc="Open-source agents, clean APIs, and a CLI-first approach make integration seamless for modern DevOps workflows."
          />
        </div>
      </section>

      {/* --- FUTURE ROADMAP (Transparency) --- */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-800 text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Building for the Future</h3>
        <p className="text-slate-400 mb-8">
          We are just getting started. Here is what we are working on next:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <RoadmapItem status="In Progress" label="Carbon Mode (Green IT)" />
          <RoadmapItem status="Planned" label="User Testimonials & Community Hub" />
          <RoadmapItem status="Planned" label="WhatsApp/Telegram Alerts" />
          <RoadmapItem status="Researching" label="AI-Powered Threat Detection" />
        </div>
      </section>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function MissionCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 bg-[#151e32]/50 border border-slate-800 rounded-2xl hover:bg-[#151e32] transition-colors hover:border-slate-700 group">
      <div className="mb-6 p-4 bg-slate-900 rounded-xl inline-block group-hover:scale-110 transition-transform shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function RoadmapItem({ status, label }: any) {
  let colorClass = "bg-slate-800 text-slate-400 border-slate-700"; // Default
  if (status === "In Progress") colorClass = "bg-cyan-900/20 text-cyan-400 border-cyan-800";
  if (status === "Researching") colorClass = "bg-purple-900/20 text-purple-400 border-purple-800";

  return (
    <div className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 ${colorClass}`}>
      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
      {label}
    </div>
  );
}