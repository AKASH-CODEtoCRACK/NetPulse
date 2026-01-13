"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Copy, Check, ArrowLeft, Terminal, Server, 
  ShieldCheck, AlertTriangle, Monitor, Cpu, 
  BookOpen, HelpCircle, Github, Network 
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function InstallGuide() {
  const { user, isLoaded } = useUser();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // --- LOGIC: HANDLE "UNDEFINED" USER ID ---
  // If user is loading, show "Loading...". 
  // If not logged in, show a placeholder "YOUR_USER_ID".
  // If logged in, show their actual ID.
  const userIdDisplay = isLoaded && user?.id ? user.id : "YOUR_USER_ID";
  
  // The Command
  const installCommand = `curl -sL ${origin || "https://netpulse.vercel.app"}/install.sh | sudo bash -s -- ${userIdDisplay} ${origin || "https://netpulse.vercel.app"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-800 transition-colors group" title="Back to Dashboard">
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-2">
                <Terminal className="text-cyan-400" size={20} />
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    NetPulse Docs
                </h1>
            </div>
          </div>
          <a 
            href="https://github.com/AKASH-CODEtoCRACK/NetPulse" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <Github size={18} />
            <span className="hidden sm:inline">GitHub Support</span>
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <BookOpen size={12} />
            Official Installation Guide v1.0
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            One Command. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Complete Visibility.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            NetPulse Agent is a lightweight, open-source Node.js background service. 
            It collects CPU, RAM, Network, and Security metrics and streams them securely to your dashboard.
          </p>
        </div>

        {/* --- INSTALLATION BLOCK --- */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-16 relative group">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500"></div>
          
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Terminal className="text-emerald-400" size={24} /> 
                    Installation Command
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                    Copy and run this on your <strong>Ubuntu / Debian / CentOS</strong> server.
                </p>
              </div>
              
              {!user && (
                 <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-2">
                    <AlertTriangle size={12} />
                    You are not logged in. Replace 'YOUR_USER_ID' manually.
                 </div>
              )}
            </div>
            
            {/* The Code Box */}
            <div className="relative bg-black/50 rounded-xl border border-slate-800 p-6 font-mono text-sm md:text-base break-all text-slate-300 shadow-inner group-hover:border-slate-700 transition-colors">
              <div className="flex gap-2 select-none mb-2 opacity-50">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <div className="pl-2 border-l-2 border-slate-700">
                <span className="text-green-400 select-none mr-3">$</span>
                {installCommand}
              </div>
              
              <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700 shadow-lg group-hover:scale-105 active:scale-95"
                title="Copy to Clipboard"
              >
                {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- SYSTEM REQUIREMENTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-[#1e293b]/30 rounded-xl border border-slate-800">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Server className="text-blue-400" size={20} />
                </div>
                <h4 className="font-bold text-white mb-2">Supported OS</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Ubuntu 18.04+, Debian 10+, CentOS 7+.<br/>
                    (Works on WSL2 for Windows).
                </p>
            </div>
            <div className="p-6 bg-[#1e293b]/30 rounded-xl border border-slate-800">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Cpu className="text-purple-400" size={20} />
                </div>
                <h4 className="font-bold text-white mb-2">Hardware</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Minimal Impact.<br/>
                    Requires ~50MB RAM and <br/>&lt; 1% CPU usage.
                </p>
            </div>
            <div className="p-6 bg-[#1e293b]/30 rounded-xl border border-slate-800">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Network className="text-green-400" size={20} />
                </div>
                <h4 className="font-bold text-white mb-2">Network</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Outbound HTTPS (Port 443) access to this dashboard URL.
                </p>
            </div>
            <div className="p-6 bg-[#1e293b]/30 rounded-xl border border-slate-800">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="text-amber-400" size={20} />
                </div>
                <h4 className="font-bold text-white mb-2">Permissions</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Requires <code className="bg-slate-800 px-1 rounded">sudo</code> to create systemd service and read logs.
                </p>
            </div>
        </div>

        {/* --- WINDOWS WARNING --- */}
        <div className="mb-16 p-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20">
            <div className="bg-[#0f172a] rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Monitor size={100} />
                </div>
                <h3 className="text-amber-400 font-bold text-xl mb-4 flex items-center gap-3">
                    <Monitor size={24} /> Important for Windows Users
                </h3>
                <div className="space-y-4 text-slate-300 text-sm leading-relaxed max-w-3xl">
                    <p>
                        NetPulse Agent is optimized for Linux environments. To run it on Windows, you must use 
                        <strong> WSL (Windows Subsystem for Linux)</strong>.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400 ml-2">
                        <li>
                            If using <strong>Localhost</strong>: Ensure your Agent uses your machine's LAN IP (e.g., <code>192.168.x.x</code>), not <code>localhost</code>.
                        </li>
                        <li>
                            Native PowerShell support is currently in <strong>Beta</strong>. Check GitHub for updates.
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* --- TROUBLESHOOTING (FAQ) --- */}
        <div className="border-t border-slate-800 pt-12">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <HelpCircle className="text-blue-400" /> Troubleshooting Guide
          </h3>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <details className="group bg-[#1e293b]/30 rounded-xl border border-slate-800 open:border-slate-600 transition-colors">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-slate-200 group-hover:text-white">
                <span>Error: "Connection Refused" or "ETIMEDOUT"</span>
                <span className="transform group-open:rotate-180 transition-transform text-slate-500">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                This is common when testing locally. Your Linux environment (WSL/VM) cannot see "localhost" on your Windows Host.<br/><br/>
                <strong>Solution:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                    <li>Find your Windows LAN IP (Run <code>ipconfig</code> in PowerShell).</li>
                    <li>Update the installation command URL to use that IP instead of localhost.</li>
                    <li>Or better yet: <strong>Deploy to Vercel</strong> so you have a public URL.</li>
                </ol>
              </div>
            </details>

             {/* FAQ Item 2 */}
             <details className="group bg-[#1e293b]/30 rounded-xl border border-slate-800 open:border-slate-600 transition-colors">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-slate-200 group-hover:text-white">
                <span>Why is my CPU/Network usage 0%?</span>
                <span className="transform group-open:rotate-180 transition-transform text-slate-500">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                The agent is accurate! If your server is idle, usage will be near 0%.<br/><br/>
                <strong>To test it:</strong> Run a load test command like <code>stress --cpu 4</code> or download a large file to see the graphs spike in real-time.
              </div>
            </details>

             {/* FAQ Item 3 */}
             <details className="group bg-[#1e293b]/30 rounded-xl border border-slate-800 open:border-slate-600 transition-colors">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-slate-200 group-hover:text-white">
                <span>Where are the logs stored?</span>
                <span className="transform group-open:rotate-180 transition-transform text-slate-500">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                The agent installation directory is <code>/opt/netpulse</code>.
                <br/>You can view the agent's background service status by running: <code>sudo systemctl status netpulse</code>.
              </div>
            </details>
          </div>
        </div>

              {/* --- VERIFY INSTALLATION SECTION (STRESS TEST) --- */}
        <div className="mb-16">
            {/* <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Activity className="text-pink-500" /> Verify Installation
            </h3> */}
            <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-6 md:p-8">
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Once the agent is running, your dashboard might show 0% CPU if the server is idle. 
                    Run this <strong>Stress Test</strong> to force a spike in data and confirm everything is connected.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step 1 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-700">1</span>
                            <h4 className="text-white font-medium">Install Stress Tool</h4>
                        </div>
                        <div className="bg-black/50 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                             sudo apt-get install stress
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-700">2</span>
                            <h4 className="text-white font-medium">Run 30-Second Load Test</h4>
                        </div>
                        <div className="bg-black/50 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 relative group">
                             stress --cpu 4 --timeout 30s
                             <Copy size={14} className="absolute top-3 right-3 text-slate-500 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText("stress --cpu 4 --timeout 30s")} />
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-4 items-center">
                    {/* <div className="p-2 bg-blue-500/20 rounded-full">
                        <Activity size={20} className="text-blue-400" />
                    </div> */}
                    <p className="text-sm text-blue-200">
                        <strong>Watch your Dashboard!</strong> You should see the CPU graph spike to 100% instantly.
                    </p>
                </div>
            </div>
        </div>

        {/* --- FOOTER CTA --- */}
        <div className="mt-20 text-center border-t border-slate-800 pt-10">
            <p className="text-slate-500 mb-4">Still facing issues?</p>
            <a 
                href="https://github.com/AKASH-CODEtoCRACK/NetPulse/issues" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600"
            >
                <Github size={20} />
                Open an Issue on GitHub
            </a>
        </div>

      </main>
    </div>
  );
}