"use client";
 
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User, Session, Profile } from "../types/auth.types";
 
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const supabase = createClient();
 
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
 
      if (session?.user) {
        // Fetch user profile
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
 
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
 
      if (session?.user) {
        // Fetch updated profile
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
          });
      } else {
        setProfile(null);
      }
    });
 
    return () => {
      subscription.unsubscribe();
    };
  }, []);
 
  return {
    user,
    profile,
    session,
    loading,
  };
}