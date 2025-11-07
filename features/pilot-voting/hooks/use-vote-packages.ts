"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VotePackage } from "../types/voting.types";

export function useVotePackages() {
  const [packages, setPackages] = useState<VotePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchPackages() {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from("vote_packages")
          .select("*")
          .eq("active", true)
          .order("votes", { ascending: true });

        if (fetchError) throw fetchError;

        const formattedPackages: VotePackage[] = (data || []).map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          votes: pkg.votes,
          price: parseFloat(pkg.price),
          currency: pkg.currency,
          discount: pkg.discount ? parseFloat(pkg.discount) : undefined,
          popular: pkg.popular || false,
          savings: pkg.savings ? parseFloat(pkg.savings) : undefined,
        }));

        setPackages(formattedPackages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch packages"));
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  return { packages, loading, error };
}
