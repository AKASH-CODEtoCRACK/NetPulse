"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, X, Send, Bot, Minimize2, MoreHorizontal, User, Sparkles, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";

// Types remain the same...
type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
  type?: "text" | "action"; 
  actionLink?: string;
  timestamp: Date;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [input, setInput] = useState("");
  // New state for the floating welcome bubble
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  
  const { user, isSignedIn } = useUser();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I am NetBot AI 🤖. Select an option below or ask me anything!",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Effect to show welcome bubble after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowWelcomeBubble(true);
    }, 2000); // Show after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // MENU OPTIONS & LOCAL RESPONSES (Keep existing logic)
  const QUICK_ACTIONS = [
    { label: "Pricing Info 💰", query: "What are the pricing plans?" },
    { label: "Installation Guide ⬇️", query: "How do I install the agent?" },
    { label: "Features 🚀", query: "What features does NetPulse offer?" },
    { label: "Contact Human 👨‍💻", query: "I need to speak to support" }
  ];

  const LOCAL_RESPONSES: Record<string, string> = {
    "pricing": "💰 **Pricing Plans:**\n\n• **Free Tier:** Basic monitoring (24h retention).\n• **Pro Plan ($19/mo):** Unlimited history, AI alerts, and Carbon Mode.",
    "install": "⬇️ **Installation:**\n\nRun this command in your terminal:\n`git clone https://github.com/netpulse/agent && python agent.py`\n\nSee the [Installation Page](/install) for more details.",
    "features": "🚀 **Key Features:**\n\n• Real-time Dashboard (1s latency)\n• AI Threat Detection\n• Carbon Mode (Green IT)\n• Telegram/WhatsApp Alerts",
    "contact": "👨‍💻 **Support:**\n\nClick the button below to open a ticket with our engineering team."
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowWelcomeBubble(false); // Hide bubble instantly on open
  };

  const handleSend = async (textOverride?: string) => {
    // (Keep your exact existing handleSend logic here - copy paste from previous version if needed)
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setShowMenu(false); 
    setIsTyping(true);

    const lowerText = textToSend.toLowerCase();
    let localReply = null;

    if (lowerText.includes("pric")) localReply = LOCAL_RESPONSES["pricing"];
    else if (lowerText.includes("install") || lowerText.includes("setup")) localReply = LOCAL_RESPONSES["install"];
    else if (lowerText.includes("feature")) localReply = LOCAL_RESPONSES["features"];
    else if (lowerText.includes("support") || lowerText.includes("contact") || lowerText.includes("human")) localReply = LOCAL_RESPONSES["contact"];

    if (localReply) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: localReply!,
          sender: "bot",
          type: lowerText.includes("support") ? "action" : "text",
          actionLink: lowerText.includes("support") ? "/contact" : undefined,
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    if (!isSignedIn) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "🔒 **Login Required**\n\nI'd love to help with that, but my AI brain is reserved for logged-in users.\n\nPlease sign in to access advanced support features.",
          sender: "bot",
          type: "action",
          actionLink: "/sign-in", // Link to Clerk sign in
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 500);
      return;
   }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.reply,
        sender: "bot",
        timestamp: new Date()
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "System is offline. Please check the About page.",
        sender: "bot",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  

  return (
    <>
      {/* --- THE NEW FLOATING ROBOT CONTAINER --- */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center">
          
          {/* 1. The Floating Welcome Message Bubble */}
          {showWelcomeBubble && (
            <div className="mr-4 animate-in slide-in-from-right-4 fade-in duration-700 hidden md:block">
               <div className="bg-[#151e32] border border-cyan-500/30 p-4 rounded-2xl shadow-lg shadow-cyan-500/10 relative animate-bounce">
                  {/* CSS Arrow pointing right */}
                  <div className="absolute top-1/2 -right-2 -mt-1.5 w-4 h-4 rotate-45 bg-[#151e32] border-t border-r border-cyan-500/30"></div>
                  <div className="flex items-center gap-2">
                     <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                     </span>
                     <p className="text-sm font-bold text-white whitespace-nowrap">
                        Need help? <span className="text-cyan-400">Chat with NetBot!</span> 👋
                     </p>
                  </div>
               </div>
            </div>
          )}

          {/* 2. The Robotic Button Head */}
          <button
            onClick={handleOpen}
            className="relative group"
          >
            {/* Outer glowing energy field pulsing */}
            <div className="absolute inset-0 bg-cyan-500/40 rounded-full animate-ping opacity-50 scale-110 group-hover:bg-cyan-400/60 transition-all"></div>
            
            {/* The main robot head container */}
            <div className="relative z-10 bg-gradient-to-br from-slate-900 to-black border-2 border-cyan-500/50 p-4 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:border-cyan-400">
               {/* The Bot Icon designed to look like a face */}
               <Bot size={32} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] relative z-20" />
               
               {/* The glowing "Cyber Eye" */}
               <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_15px_cyan] z-30"></div>
               
               {/* Scanline effect overlay */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 rounded-full z-10 pointer-events-none"></div>
            </div>
          </button>
        </div>
      )}

      {/* --- CHAT WINDOW (Existing Code) --- */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] bg-[#151e32] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
          
          {/* HEADER */}
          <div className="bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-slate-900 z-10"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1">
                  NetBot AI <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-[10px] text-cyan-400 border border-cyan-500/30">BETA</span>
                </h3>
                <p className="text-xs text-slate-400">Powered by Gemini</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                 <MoreHorizontal size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                 <Minimize2 size={18} />
              </button>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0B1120] relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900" 
            ref={scrollRef}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-2 mt-1 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    <Bot size={14} className="text-cyan-400" />
                  </div>
                )}

                <div className="flex flex-col max-w-[80%]">
                  <div 
                    className={`p-3.5 text-sm leading-relaxed shadow-md whitespace-pre-wrap ${
                      msg.sender === "user" 
                        ? "bg-cyan-600 text-white rounded-2xl rounded-tr-sm" 
                        : "bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-slate-700"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.type === "action" && msg.actionLink && (
                    <Link href={msg.actionLink} className="mt-2 self-start">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg hover:shadow-cyan-500/25">
                         <Phone size={14} /> Connect with Team
                      </button>
                    </Link>
                  )}
                  
                  <span className={`text-[10px] text-slate-500 mt-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-800 flex items-center justify-center ml-2 mt-1 shrink-0">
                    <User size={14} className="text-cyan-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    <Bot size={14} className="text-cyan-400" />
                  </div>
                 <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 flex gap-1.5 items-center h-10">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          {/* MENU CHIPS */}
          {showMenu && !isTyping && (
            <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.query)}
                  className="whitespace-nowrap px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-full text-xs text-cyan-400 font-medium transition-all flex items-center gap-1 group"
                >
                  {action.label} <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          )}

          {/* INPUT AREA */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 items-center">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-colors ${showMenu ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
            >
              <MoreHorizontal size={20} />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask NetBot..."
              className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-slate-700 placeholder:text-slate-500"
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/20"
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}