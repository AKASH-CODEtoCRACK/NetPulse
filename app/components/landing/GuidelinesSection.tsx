import { ShieldCheck, Lock, Terminal } from "lucide-react";

export function GuidelinesSection() {
  return (
    <section className="py-24 bg-[#0f1623] border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Security First Architecture</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              NetPulse isn't just a monitoring tool; it's a security compliance assistant. 
              We follow strict guidelines to ensure your infrastructure remains impenetrable while being monitored.
            </p>
            
            <div className="space-y-6">
              <Guideline 
                icon={<ShieldCheck />} 
                title="End-to-End Encryption" 
                desc="All data sent from the Python Agent to our servers is encrypted using TLS 1.3 standards." 
              />
              <Guideline 
                icon={<Lock />} 
                title="Zero-Trust Access" 
                desc="Dashboard access is protected by OAuth 2.0. No raw passwords are ever stored on our servers." 
              />
              <Guideline 
                icon={<Terminal />} 
                title="Open Source Agent" 
                desc="Our collection script is 100% open source. Audit the code yourself before running it on your root server." 
              />
            </div>
          </div>

          {/* Visual Filler - A "Code" Box */}
          <div className="bg-[#0B1120] rounded-xl border border-slate-800 p-6 font-mono text-sm relative shadow-2xl">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2 text-slate-400">
              <p><span className="text-purple-400">def</span> <span className="text-blue-400">encrypt_payload</span>(data):</p>
              <p className="pl-4">key = <span className="text-amber-400">os.getenv</span>('API_KEY')</p>
              <p className="pl-4">cipher = <span className="text-cyan-400">AES</span>.new(key, AES.MODE_EAX)</p>
              <p className="pl-4">ciphertext, tag = cipher.encrypt(data)</p>
              <p className="pl-4"><span className="text-purple-400">return</span> ciphertext</p>
              <p className="text-slate-600 mt-4"># Verified secure by NetPulse Security Team</p>
            </div>
            
            {/* Stamp Overlay */}
            <div className="absolute bottom-6 right-6 border-2 border-green-500 text-green-500 px-4 py-2 font-bold text-xl uppercase -rotate-12 opacity-80">
              Audited
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Guideline({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-cyan-400">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-white mb-1">{title}</h3>
        <p className="text-slate-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}