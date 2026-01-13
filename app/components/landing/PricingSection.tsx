"use client";

import { Check, Star } from "lucide-react";

export function PricingSection() {
  return (
    <section className="py-24 bg-[#0B1120] relative overflow-hidden" id="pricing">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Transparent Pricing</h2>
          <p className="text-slate-400">Start for free. Upgrade for power.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* FREE PLAN - Glass Effect */}
          <div className="p-8 rounded-3xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl hover:border-slate-500 transition-all duration-300 flex flex-col group">
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">Hobby</span>
            </div>
            <div className="text-5xl font-bold text-white mb-2">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <p className="text-slate-400 mb-8">Perfect for students and home labs.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              <Feature text="Monitor up to 3 Nodes" />
              <Feature text="24-hour Data Retention" />
              <Feature text="Basic CPU/RAM Metrics" />
              <Feature text="Community Support" />
            </ul>

            <button className="w-full py-4 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-white hover:text-black transition-all">
              Get Started Free
            </button>
          </div>

          {/* PRO PLAN - Glass Effect + Glow */}
          <div className="relative p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur-xl flex flex-col group hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            {/* "Popular" Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Star size={12} fill="white" /> POPULAR
            </div>

            <div className="mb-4 mt-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">Pro</span>
            </div>
            <div className="text-5xl font-bold text-white mb-2">$19<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <p className="text-slate-400 mb-8">For serious developers and production.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              <Feature text="Unlimited Nodes" highlighted />
              <Feature text="30-Day Data Retention" highlighted />
              <Feature text="AI Threat Detection" highlighted />
              <Feature text="SMS & Email Alerts" highlighted />
            </ul>

            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg group-hover:shadow-cyan-500/50 transition-all">
              Upgrade to Pro
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

function Feature({ text, highlighted = false }: { text: string, highlighted?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <div className={`p-1 rounded-full ${highlighted ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
        <Check size={14} strokeWidth={3} />
      </div>
      <span className={highlighted ? 'text-white font-medium' : 'text-slate-400'}>{text}</span>
    </li>
  );
}