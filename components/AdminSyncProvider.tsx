"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUserToAdmin, syncAllCurrentStateToAdmin } from "@/lib/adminSync";

function useSafeUser() {
  try {
    const { user, isLoaded, isSignedIn } = useUser();
    return { user, isLoaded: Boolean(isLoaded), isSignedIn: Boolean(isSignedIn) };
  } catch {
    return { user: null, isLoaded: true, isSignedIn: false as const };
  }
}

export function AdminSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useSafeUser();
  const hasSyncedUserRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    if (!hasSyncedUserRef.current) {
      hasSyncedUserRef.current = true;
      syncUserToAdmin(user);
      syncAllCurrentStateToAdmin(user);
    }
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
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
