"use client";

import { useState, useTransition } from "react";
import { adminLogin } from "@/lib/actions";
import { toast } from "sonner";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function AdminLoginForm() {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await adminLogin(password);
        if (res.success) {
          toast.success("Admin authenticated successfully!");
          // Use full document navigation to bypass any stale client router cache
          window.location.href = "/admin/dashboard";
        } else {
          setError(res.error || "Invalid secret password.");
          toast.error("Authentication failed.");
        }
      } catch (err: any) {
        setError(err?.message || "An unexpected error occurred during login.");
        toast.error("Login failed.");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-[#e7e5e4] p-8 shadow-xs">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#faf8f5] text-[#c2410c] border border-[#e7e5e4] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-serif-heading text-xl font-bold text-[#1c1917]">
          {t.admin.loginTitle}
        </h1>
        <p className="text-xs text-[#78716c] mt-1 leading-relaxed">
          {t.admin.loginSubtitle}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#44403c] mb-1.5 font-mono-tag">
            {t.admin.passwordLabel}
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.admin.passwordPlaceholder}
            className="w-full h-11 px-3.5 rounded-xl border border-[#e7e5e4] bg-[#faf8f5]/60 text-sm text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {t.admin.verifying}
            </>
          ) : (
            <>
              {t.admin.signInBtn} <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
