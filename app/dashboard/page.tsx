
"use client";

import { useState } from "react";
import { useTrafficData } from "../hooks/useTrafficData";
import { KpiGrid } from "../components/dashboard/KpiGrid";
import { ThreatIntelligence } from "../components/dashboard/ThreatIntelligence";
import { TrafficGraph } from "../components/dashboard/TrafficGraph";
import { CyberLoader } from "../components/shared/CyberLoader"; // <--- Import
import { ServerMonitorChart } from "./ServerMonitorChart";
import { ConnectServerModal } from "../components/dashboard/ConnectServerModal";
import { Plus } from "lucide-react";
import { NetworkChart } from "../components/dashboard/NetworkChart";

export default function DashboardPage() {
  // Get the new isLoading boolean
  const { history, realtime, isLoading } = useTrafficData();
  const [isInstallModalOpen, setInstallModalOpen] = useState(false);
  // 1. Show Loader if waiting for data
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <CyberLoader text="CONNECTING TO AGENT..." />
      </div>
    );
  }

  // 2. Show Dashboard once loaded
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
   <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
     <div>
       <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
       <p className="text-slate-400">Overview of your infrastructure.</p>
     </div>

     {/* NEW CONNECT BUTTON */}
     <button 
       onClick={() => setInstallModalOpen(true)}
       className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
     >
        <Plus size={18} /> Connect Server
     </button>
   </div>
      <KpiGrid  />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <TrafficGraph data={history} />  */}
        <NetworkChart />
        <ThreatIntelligence />
      </div>
      <div className="mb-8 mt-8  animate-in fade-in slide-in-from-bottom-6 duration-700">
    <ServerMonitorChart />
</div>
{/* <div className="grid md:grid-cols-2 gap-6"></div> */}
{/* MODALS */}
<ConnectServerModal 
     isOpen={isInstallModalOpen} 
     onClose={() => setInstallModalOpen(false)} 
   />
    </div>
    
  );
}