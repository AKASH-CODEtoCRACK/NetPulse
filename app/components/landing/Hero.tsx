import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LivePreview } from "./LivePreview";

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-800 text-cyan-400 text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Real-time Monitoring v2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Your Infra, <br/>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Visually Alive.</span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
            Stop reading boring logs. NetPulse visualizes your traffic, blocks threats, and monitors server health in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/dashboard" className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group">
              Start Monitoring 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>

          <div className="flex gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> No Lag</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Secure</div>
          </div>
        </div>

        {/* Right: The Live Preview Component */}
        <div className="relative">
           {/* Glow Effect */}
           <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 animate-pulse"></div>
           <LivePreview />
        </div>

      </div>
    </section>
  );
}