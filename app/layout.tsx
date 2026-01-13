// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./components/shared/Navbar";
import { Footer } from "./components/shared/Footer";
import "./globals.css";
import { CyberCursor } from "./components/shared/CyberCursor";
import { ParticleNetwork } from "./components/shared/PraticleNetwork";
import { ChatBot } from "./components/shared/ChatBot";
import { UserSync } from "./components/shared/UserSync";
import { CarbonProvider } from "./context/CarbonContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#0B1120] text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
        <UserSync />
        <CarbonProvider>
          {/* 1. Background: The Neural Network */}
          <ParticleNetwork />

          {/* 2. Cursor Layer (Top of everything) */}
          <CyberCursor />
          
          <ChatBot />

          {/* 3. Main Content */}
          <Navbar />
          <main className="flex-grow relative z-10">{children}</main>
          <Footer />
          </CarbonProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

