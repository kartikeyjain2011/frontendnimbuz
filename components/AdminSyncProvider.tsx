"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUserToAdmin, syncAllCurrentStateToAdmin } from "@/lib/adminSync";

export function AdminSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasSyncedUserRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    if (!hasSyncedUserRef.current) {
      hasSyncedUserRef.current = true;
      // Perform initial user & dataset sync to Admin Console
      syncUserToAdmin(user);
      syncAllCurrentStateToAdmin(user);
    }
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    // Listen for custom trigger events from purchasing components
    const handleCustomSync = (event: any) => {
      if (user && event.detail) {
        syncAllCurrentStateToAdmin(user);
      }
    };

    window.addEventListener("nimbus:sync", handleCustomSync);
    return () => {
      window.removeEventListener("nimbus:sync", handleCustomSync);
    };
  }, [user]);

  return <>{children}</>;
}
