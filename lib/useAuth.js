"use client";

import { useEffect, useState, useCallback } from "react";
import { getUser, getProfile, isConfigured } from "./supabaseClient";

/* Shared auth/profile state for client components. */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const configured = isConfigured();

  const refresh = useCallback(async () => {
    if (!configured) { setLoading(false); return; }
    setLoading(true);
    try {
      const u = await getUser();
      setUser(u);
      if (u) setProfile(await getProfile());
      else setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    user,
    profile,
    loading,
    configured,
    unlimited: !!profile?.is_unlimited,
    isAdmin: !!profile?.is_admin,
    refresh,
  };
}
