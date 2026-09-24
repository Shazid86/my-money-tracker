"use client";

/**
 * ============================================================
 * AUTH GATE MODAL
 * ============================================================
 *
 * Auth-gating dialog for the marketing page's interactive demo.
 *
 * The Monthly Wallet / Transaction Logger sections are a preview.
 * When a visitor submits the demo form, this modal opens and the
 * variant is chosen from the live Supabase auth listener (useAuth):
 *
 *   - Guest      → "Log in or Sign Up for the full experience"
 *                  with Login (/login) + Sign Up (/register) CTAs.
 *   - Signed-in  → "Go to Dashboard for real experience" with a
 *                  "Go to Dashboard" CTA that performs the same
 *                  token hand-off as DynamicNavbar.
 * ============================================================
 */

import Link from "next/link";
import {
  LayoutDashboard,
  LogIn,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:5173";

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthGateModal({
  open,
  onClose,
}: AuthGateModalProps) {
  const { user } = useAuth();

  /*
   * Same cross-origin session hand-off the navbar uses:
   * forward the Supabase tokens to the Vite dashboard.
   */

  const handleGoToDashboard = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const url = new URL(DASHBOARD_URL);

      url.searchParams.set("access_token", session.access_token);
      url.searchParams.set("refresh_token", session.refresh_token);

      window.location.href = url.toString();
    } else {
      window.location.href = DASHBOARD_URL;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <DialogHeader>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              user
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {user ? (
              <LayoutDashboard className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>

          {user ? (
            <>
              <DialogTitle className="mt-3 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                Go to Dashboard for real experience
              </DialogTitle>

              <DialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                You are signed in — this page is only the marketing
                demo. Your real wallet, transactions, and analytics
                live in your dashboard.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="mt-3 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                Log in or Sign Up for the full experience
              </DialogTitle>

              <DialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                You are interacting with the demo. Create a free
                account to save real transactions, sync your monthly
                wallet, and unlock the full dashboard.
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {user ? (
          <button
            type="button"
            onClick={handleGoToDashboard}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            <LayoutDashboard className="h-4 w-4" />

            Go to Dashboard
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/login"
              onClick={onClose}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}