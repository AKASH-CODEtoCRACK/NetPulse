import Link from "next/link";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0B1120] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              Net<span className="text-cyan-400">Pulse</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              The next-generation infrastructure monitoring platform. 
              Built for developers who care about performance and aesthetics.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Github size={20}/>} href="https://github.com/yourusername" />
              <SocialIcon icon={<Twitter size={20}/>} href="https://twitter.com/yourusername" />
              <SocialIcon icon={<Linkedin size={20}/>} href="https://linkedin.com/in/yourusername" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="/#features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
              <li><Link href="/install" className="hover:text-cyan-400 transition-colors">Installation</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Live Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>© 2026 NetPulse Inc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            Developed with <Heart size={14} className="text-red-500 fill-red-500" /> by 
            <a href="https://yourportfolio.com" className="text-cyan-400 hover:underline">Akash</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: any) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-black transition-all">
      {icon}
    </a>
  );
}

