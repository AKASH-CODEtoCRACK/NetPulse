"use client";

import { useState, useEffect } from "react";

export interface TrafficData {
  time: string;
  upload: number;
  download: number;
  cpu: number;
  status: "Normal" | "Warning" | "Critical";
}

// --- SIMPLE CACHE (Global Variable) ---
// This lives outside the hook, so it persists as long as the browser tab is open.
// If user navigates away and comes back, we check this first.
let DATA_CACHE: { history: TrafficData[], realtime: any } | null = null;

export function useTrafficData() {
  const [history, setHistory] = useState<TrafficData[]>([]);
  const [realtime, setRealtime] = useState({
    cpu: 0,
    ram: 0,
    activeIPs: 0,
    threatsBlocked: 0
  });
  
  // New Loading State
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check Cache First (Instant Load)
    if (DATA_CACHE) {
      setHistory(DATA_CACHE.history);
      setRealtime(DATA_CACHE.realtime);
      setIsLoading(false); // No loading needed
    } else {
      // 2. Simulate Initial Network Delay (Cold Start)
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2 seconds "Fake" loading time
    }

    // 3. Start Real-time Updates
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newCpu = Math.min(100, Math.max(5, Math.floor(Math.random() * 40) + 10));
      const newUpload = Math.floor(Math.random() * 30) + 5; 
      const newDownload = Math.floor(Math.random() * 80) + 20;

      const newDataPoint: TrafficData = {
        time: timeString,
        upload: newUpload,
        download: newDownload,
        cpu: newCpu,
        status: newCpu > 80 ? "Critical" : "Normal"
      };

      setHistory((prev) => {
        const newHistory = [...prev, newDataPoint].slice(-20);
        
        // Update Cache
        if (DATA_CACHE) DATA_CACHE.history = newHistory;
        return newHistory;
      });
      
      const newStats = {
        cpu: newCpu,
        ram: Math.floor(Math.random() * 10) + 40,
        activeIPs: Math.floor(Math.random() * 5) + 12,
        threatsBlocked: 124 + Math.floor(Math.random() * 2)
      };
      
      setRealtime(newStats);
      
      // Update Cache
      if (!DATA_CACHE) DATA_CACHE = { history: [], realtime: newStats };
      DATA_CACHE.realtime = newStats;

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { history, realtime, isLoading }; // Return isLoading
}






// // client/app/hooks/useTrafficData.ts
// "use client";

// import { useState, useEffect } from "react";

// export interface TrafficData {
//   time: string;
//   upload: number; // MB/s
//   download: number; // MB/s
//   cpu: number; // %
//   status: "Normal" | "Warning" | "Critical";
// }

// export function useTrafficData() {
//   // 1. History for the Graph (Last 20 points)
//   const [history, setHistory] = useState<TrafficData[]>([]);
  
//   // 2. Real-time Stats for the Cards
//   const [realtime, setRealtime] = useState({
//     cpu: 12,
//     ram: 45,
//     activeIPs: 8,
//     threatsBlocked: 124
//   });

//   useEffect(() => {
//     // --- SIMULATION MODE ---
//     // (Later, we will replace this interval with: socket.on('data', ...))
//     const interval = setInterval(() => {
//       const now = new Date();
//       const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
//       // Generate realistic "jittery" data
//       const newCpu = Math.min(100, Math.max(5, Math.floor(Math.random() * 40) + 10)); // 10-50%
//       const newUpload = Math.floor(Math.random() * 30) + 5; 
//       const newDownload = Math.floor(Math.random() * 80) + 20;

//       const newDataPoint: TrafficData = {
//         time: timeString,
//         upload: newUpload,
//         download: newDownload,
//         cpu: newCpu,
//         status: newCpu > 80 ? "Critical" : "Normal"
//       };

//       setHistory((prev) => {
//         const newHistory = [...prev, newDataPoint];
//         // Keep graph clean: only show last 20 seconds
//         return newHistory.slice(-20); 
//       });
      
//       setRealtime({
//         cpu: newCpu,
//         ram: Math.floor(Math.random() * 10) + 40, // Stable RAM around 40-50%
//         activeIPs: Math.floor(Math.random() * 5) + 12,
//         threatsBlocked: 124 + Math.floor(Math.random() * 2) // Slowly increasing
//       });

//     }, 2000); // Updates every 2 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return { history, realtime };
// }