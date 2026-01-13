"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function UserSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // Call the sync API in the background
      fetch("/api/auth/sync", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            // Optional: You can log this to verify it works
            // console.log("Sync Status:", data.message);
        })
        .catch(err => console.error("Sync failed", err));
    }
  }, [isSignedIn, user]);

  return null; // This component renders nothing, it just works in the background
}