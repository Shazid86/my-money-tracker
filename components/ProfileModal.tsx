"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const meta = (user?.user_metadata ?? {}) as Record<string, string>;

  const [displayName, setDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");

  const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20";

  useEffect(() => {
    if (open && user) {
      setDisplayName(meta?.name ?? meta?.full_name ?? "");
      setNewEmail("");
      setNewPassword("");
      setError("");
    }
  }, [open, user]);

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({ data: { name: displayName } });
    setSavingName(false);
    if (error) { setError(error.message); return; }
    toast.success("Display name updated");
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.includes("@")) { setError("Enter a valid email"); return; }
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setSavingEmail(false);
    if (error) { setError(error.message); return; }
    toast.success("Email update sent — check your inbox to confirm.");
    setNewEmail("");
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) { setError(error.message); return; }
    toast.success("Password updated");
    setNewPassword("");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-black text-white">Profile</DialogTitle>
          <DialogDescription className="text-slate-400">Manage your Aureus account.</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-slate-500">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{email}</p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display name</label>
          <div className="flex gap-2">
            <input className={inputCls} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
            <button disabled={savingName || !displayName.trim()} onClick={handleSaveName}
              className="shrink-0 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50">
              {savingName ? "..." : "Save"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Change email</label>
          <div className="flex gap-2">
            <input type="email" className={inputCls} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email address" />
            <button disabled={savingEmail} onClick={handleUpdateEmail}
              className="shrink-0 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50">
              {savingEmail ? "..." : "Update"}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">You may need to confirm the change from your inbox.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Change password</label>
          <div className="flex gap-2">
            <input type="password" className={inputCls} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (min 6 characters)" />
            <button disabled={savingPassword} onClick={handleUpdatePassword}
              className="shrink-0 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50">
              {savingPassword ? "..." : "Update"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}