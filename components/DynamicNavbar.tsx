"use client";

/**
 * DynamicNavbar — drop-in replacement navbar for the marketing site.
 *
 * Purpose: reads the Supabase auth session and renders different actions:
 *   - Logged out  → "Login" + "Sign Up" links
 *   - Logged in   → "Dashboard" button + profile avatar menu (with Logout)
 *
 * It reuses the project's existing Supabase browser client and shadcn/ui
 * DropdownMenu, so nothing new is invented — only wired together.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import ProfileModal from "@/components/ProfileModal";

type SessionUser = {
  id: string;
  email?: string;
  name?: string;
};

export default function DynamicNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:5173";

  // Navigate to dashboard with auth tokens for cross-origin session sharing
  const handleGoToDashboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const url = new URL(DASHBOARD_URL);
      url.searchParams.set("access_token", session.access_token);
      url.searchParams.set("refresh_token", session.refresh_token);
      window.location.href = url.toString();
    } else {
      window.location.href = DASHBOARD_URL;
    }
  };
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Read the current session and subscribe to auth changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(
        u
          ? {
              id: u.id,
              email: u.email ?? undefined,
              name:
                (u.user_metadata?.full_name as string | undefined) ??
                (u.user_metadata?.name as string | undefined),
            }
          : null
      );
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(
        u
          ? {
              id: u.id,
              email: u.email ?? undefined,
              name:
                (u.user_metadata?.full_name as string | undefined) ??
                (u.user_metadata?.name as string | undefined),
            }
          : null
      );
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Sync the theme toggle with the site's boot script (layout.tsx) key.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("takaflow-theme");
      if (saved === "light") setTheme("light");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("takaflow-theme", next);
    } catch {
      /* ignore */
    }
  };

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch {
      /* network failure — still clear local state below */
    }
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const initials =
    (user?.name || user?.email || "A")
      .trim()
      .slice(0, 2)
      .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 sm:px-8 lg:px-10">
        {/* Brand — left */}
        <Link href="/" className="flex items-center gap-3 justify-self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-black text-white shadow-lg shadow-emerald-500/20">
            A
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Aureus
          </span>
        </Link>

        {/* Center links — optically centered between logo and controls */}
        <nav className="hidden items-center gap-8 justify-self-center md:flex">
          <a href="#features" className="text-sm font-medium text-slate-400 transition hover:text-white">Features</a>
          <a href="#about" className="text-sm font-medium text-slate-400 transition hover:text-white">About</a>
          <a href="#faq" className="text-sm font-medium text-slate-400 transition hover:text-white">FAQ</a>
        </nav>

        {/* Actions — right */}
        <div className="flex items-center gap-3 justify-self-end">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:border-emerald-500/30 hover:text-emerald-400"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-white/[0.06]" />
          ) : user ? (
            <>
              <button
                onClick={handleGoToDashboard}
                className="hidden items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:inline-flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/25 to-emerald-600/10 text-sm font-black text-emerald-300 transition hover:border-emerald-400/60"
                  aria-label="Account menu"
                >
                  {initials}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="truncate text-sm font-bold">{user.name || "Account"}</p>
                      {user.email && <p className="truncate text-xs font-normal text-slate-400">{user.email}</p>}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                      <User className="h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-400 focus:text-rose-300">
                      <LogOut className="h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-slate-400 transition hover:text-white sm:block">
                Login
              </Link>
              <Link href="/register" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.08] bg-slate-950/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-3">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
              Features
            </a>
            <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
              About
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
              FAQ
            </a>
            {user ? (
              <>
                <button onClick={(e) => { handleGoToDashboard(e); setMobileOpen(false); }} className="text-left text-sm font-bold text-emerald-400 hover:text-emerald-300">
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="text-left text-sm font-medium text-rose-400 hover:text-rose-300"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            )}
          </nav>
        </div>
      )}

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
