
import { FeaturesSection } from "./components/landing/FeaturesSection";
import { GuidelinesSection } from "./components/landing/GuidelinesSection";
import { Hero } from "./components/landing/Hero";
import { PricingSection } from "./components/landing/PricingSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar and Footer are automatically added by layout.tsx */}
      <Hero />
      {/* <FeaturesSection /> */}
      <div id="features"><FeaturesSection /></div>
      <GuidelinesSection />
      <PricingSection />
      {/* You can add more sections here (Features, Pricing, etc.) later */}
    </div>
  );
}



// // client/app/page.tsx
// "use client";

// import { useTrafficData } from "./hooks/useTrafficData";
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
// } from 'recharts';
// import { Shield, Activity, Wifi, Server, Zap, Globe, Lock } from "lucide-react";

// export default function Dashboard() {
//   const { history, realtime } = useTrafficData();

//   return (
//     // Main Container - Dark Theme
//     <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-cyan-500/30">
      
//       {/* 1. TOP NAVIGATION */}
//       <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
//               <Activity className="text-cyan-400" size={24} />
//             </div>
//             <h1 className="text-2xl font-bold tracking-tight text-white">
//               Net<span className="text-cyan-400">Pulse</span>
//             </h1>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span className="text-xs font-semibold text-green-400">NODE ACTIVE</span>
//             </div>
//             <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
//               <span className="text-xs font-bold">R</span>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 py-8">
        
//         {/* 2. STATUS OVERVIEW (KPI CARDS) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <KpiCard 
//             title="CPU Load" 
//             value={`${realtime.cpu}%`} 
//             icon={<Zap className="text-amber-400" />} 
//             trend={realtime.cpu > 80 ? "critical" : "normal"}
//             footer="4 Cores Active"
//           />
//           <KpiCard 
//             title="Memory Usage" 
//             value={`${realtime.ram}%`} 
//             icon={<Server className="text-purple-400" />} 
//             footer="8GB / 16GB Used"
//           />
//           <KpiCard 
//             title="Live Connections" 
//             value={realtime.activeIPs.toString()} 
//             icon={<Globe className="text-blue-400" />} 
//             footer="TCP/UDP Mixed"
//           />
//           <KpiCard 
//             title="Security Events" 
//             value={realtime.threatsBlocked.toString()} 
//             icon={<Shield className="text-emerald-400" />} 
//             footer=" threats mitigated"
//           />
//         </div>

//         {/* 3. MAIN VISUALIZATION AREA */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Main Traffic Graph */}
//           <div className="lg:col-span-2 bg-[#151e32] rounded-xl border border-slate-800 p-6 shadow-xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 <Wifi size={18} className="text-cyan-400"/> Network Traffic (I/O)
//               </h2>
//               <div className="flex gap-4 text-xs text-slate-400">
//                 <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-500 rounded-sm"></div> Download</span>
//                 <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> Upload</span>
//               </div>
//             </div>

//             <div className="h-[350px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={history}>
//                   <defs>
//                     <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
//                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
//                     </linearGradient>
//                     <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
//                   <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickMargin={10} axisLine={false} tickLine={false}/>
//                   <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(val) => `${val} MB`}/>
//                   <Tooltip 
//                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
//                     itemStyle={{ fontSize: '12px' }}
//                   />
//                   <Area type="monotone" dataKey="download" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#cyanGradient)" />
//                   <Area type="monotone" dataKey="upload" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#emeraldGradient)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Side Panel: Security Logs */}
//           <div className="bg-[#151e32] rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col">
//             <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//               <Lock size={18} className="text-amber-400"/> Threat Intelligence
//             </h2>
            
//             <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
//               {/* Dummy Logs that look real */}
//               <LogItem type="warning" msg="Port Scan Detected" ip="45.33.22.11" time="Just now" />
//               <LogItem type="success" msg="Firewall Blocked ICMP" ip="192.168.0.105" time="2m ago" />
//               <LogItem type="info" msg="New Device Connected" ip="192.168.0.12" time="15m ago" />
//               <LogItem type="error" msg="SSH Auth Failure (Root)" ip="10.0.0.55" time="1h ago" />
//               <LogItem type="info" msg="System Update Check" ip="Localhost" time="3h ago" />
//             </div>

//             <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-700">
//               View Full Audit Logs
//             </button>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

// // --- REUSABLE COMPONENTS ---

// function KpiCard({ title, value, icon, trend, footer }: any) {
//   const isCritical = trend === 'critical';
  
//   return (
//     <div className={`p-5 rounded-xl border bg-[#151e32] transition-all hover:scale-[1.02] ${isCritical ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-slate-800 shadow-lg'}`}>
//       <div className="flex justify-between items-start mb-4">
//         <div className="p-2 bg-slate-800/50 rounded-lg">{icon}</div>
//         {isCritical && <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-full uppercase tracking-wider">High Load</span>}
//       </div>
//       <div>
//         <div className="text-slate-400 text-sm font-medium mb-1">{title}</div>
//         <div className="text-3xl font-bold text-white mb-2 tracking-tight">{value}</div>
//         <div className="text-xs text-slate-500 font-mono border-t border-slate-800 pt-2 mt-2">{footer}</div>
//       </div>
//     </div>
//   );
// }

// function LogItem({ type, msg, ip, time }: any) {
//   const styles: any = {
//     warning: "border-amber-500/20 bg-amber-500/5 text-amber-200",
//     error: "border-red-500/20 bg-red-500/5 text-red-200",
//     success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-200",
//     info: "border-blue-500/20 bg-blue-500/5 text-blue-200",
//   };

//   return (
//     <div className={`p-3 rounded-lg border ${styles[type]} text-sm flex flex-col gap-1`}>
//       <div className="flex justify-between font-medium">
//         <span>{msg}</span>
//         <span className="opacity-60 text-xs">{time}</span>
//       </div>
//       <div className="text-xs font-mono opacity-50 flex items-center gap-1">
//         SRC: {ip}
//       </div>
//     </div>
//   );
// }

