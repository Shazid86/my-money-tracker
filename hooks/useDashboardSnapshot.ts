"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface DashboardSnapshot {
  period: string;
  period_label: string;
  income: number;
  expense: number;
  budget_limit: number;
  budget_spent: number;
  net_worth: number;
  updated_at: string;
}

/**
 * Read-only fetch of the signed-in user's latest dashboard snapshot
 * (mirrored by the Vite dashboard into `dashboard_snapshots`).
 * Display-only — never mutates anything; errors degrade to null.
 */
export function useDashboardSnapshot(userId: string | null | undefined) {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setSnapshot(null);
      return;
    }
    let cancelled = false;
    setLoading(true);

    supabase
      .from("dashboard_snapshots")
      .select("period, period_label, income, expense, budget_limit, budget_spent, net_worth, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .then(
        ({ data }: { data: DashboardSnapshot[] | null }) => {
          if (cancelled) return;
          setSnapshot(data && data.length > 0 ? data[0] : null);
          setLoading(false);
        },
        () => {
          if (cancelled) return;
          setSnapshot(null);
          setLoading(false);
        }
      );

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { snapshot, loading };
}
