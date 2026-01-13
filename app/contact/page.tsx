"use client";

import { useState, useRef } from "react";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS LATER
    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formRef.current!, 'YOUR_PUBLIC_KEY')
    
    // Simulating a success for the UI demo
    setTimeout(() => {
      setLoading(false);
      setStatus("success");
      formRef.current?.reset();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        
        {/* Left: Contact Info & Map */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-slate-400 text-lg mb-12">
            Have questions about enterprise integration? Our team in Noida is ready to help.
          </p>

          <div className="space-y-8 mb-12">
            <ContactItem icon={<Mail />} title="Email Us" desc="support@netpulse.dev" />
            <ContactItem icon={<MapPin />} title="Visit Us" desc="Sector 62, Noida, Uttar Pradesh, India" />
            <ContactItem icon={<Phone />} title="Call Us" desc="+91 98765 43210" />
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl filter grayscale hover:grayscale-0 transition-all duration-500">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224136.8770258163!2d77.29170275!3d28.5355161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x1052432d016bd4a9!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Right: The Form */}
        {/* <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div> */}

        <div className="bg-[#151e32] p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
          
          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InputGroup label="Name" name="user_name" placeholder="John Doe" />
              <InputGroup label="Email" name="user_email" type="email" placeholder="john@example.com" />
            </div>
            <InputGroup label="Subject" name="subject" placeholder="Enterprise License Inquiry" />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Message</label>
              <textarea 
                name="message" 
                rows={5} 
                required
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                placeholder="Tell us about your infrastructure..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading || status === 'success'}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : status === 'success' ? 'Message Sent!' : <><Send size={18} /> Send Message</>}
            </button>

            {status === 'success' && (
              <p className="text-green-400 text-center text-sm mt-4">Thank you! We'll get back to you shortly.</p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

function ContactItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-3 bg-slate-800/50 rounded-lg text-cyan-400 border border-slate-700">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, name, type = "text", placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <input 
        type={type} 
        name={name}
        required
        className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
        placeholder={placeholder}
      />
    </div>
  );
}