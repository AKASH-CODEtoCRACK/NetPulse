"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

// Define the shape of our context
type CarbonContextType = {
  isCarbonMode: boolean;
  toggleCarbonMode: () => Promise<void>;
};

const CarbonContext = createContext<CarbonContextType | undefined>(undefined);

export function CarbonProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser();
  const [isCarbonMode, setIsCarbonMode] = useState(false);

  // 1. Load setting from DB on startup
  useEffect(() => {
    if (!isSignedIn) return;

    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.isCarbonMode !== undefined) setIsCarbonMode(data.isCarbonMode);
      })
      .catch(err => console.error("Failed to load carbon settings", err));
  }, [isSignedIn]);

  // 2. Toggle Function
  const toggleCarbonMode = async () => {
    const newState = !isCarbonMode;
    setIsCarbonMode(newState); // Instant UI update (Optimistic)

    try {
      await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCarbonMode: newState }),
      });
    } catch (error) {
      console.error("Failed to save setting");
      setIsCarbonMode(!newState); // Revert if server fails
    }
  };

  return (
    <CarbonContext.Provider value={{ isCarbonMode, toggleCarbonMode }}>
      {children}
    </CarbonContext.Provider>
  );
}

// Helper hook to use this context easily
export function useCarbon() {
  const context = useContext(CarbonContext);
  if (context === undefined) {
    throw new Error("useCarbon must be used within a CarbonProvider");
  }
  return context;
}