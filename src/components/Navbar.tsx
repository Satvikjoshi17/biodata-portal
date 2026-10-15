"use client";

import Link from "next/link";
import { UserPlus, ShieldCheck, BookOpen } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/LanguageContext";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#c2410c] flex items-center justify-center text-white shadow-sm transition group-hover:bg-[#9a3412]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-heading text-lg sm:text-xl font-bold tracking-tight text-[#1c1917] group-hover:text-[#c2410c] transition">
                {t.navbar.title}
              </span>
              <span className="text-[11px] font-medium text-[#78716c] -mt-0.5 tracking-wider uppercase">
                {t.navbar.subtitle}
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs sm:text-sm font-semibold text-[#44403c] hover:text-[#c2410c] px-3 py-2 rounded-lg transition"
            >
              {t.navbar.directory}
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs sm:text-sm font-semibold shadow-xs transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.navbar.register}</span>
            </Link>

            {/* Language Switcher Toggle */}
            <LanguageToggle />

            <Link
              href="/admin/dashboard"
              className="p-2 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4] transition"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-[#e7e5e4] bg-[#f5f5f4] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716c]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            <span className="font-medium text-[#44403c]">
              Official Community Verification Hub • अखिल भारतीय समाज परिषद
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#1c1917] transition">{t.navbar.directory}</Link>
            <Link href="/register" className="hover:text-[#1c1917] transition">{t.navbar.register}</Link>
            <Link href="/admin/login" className="hover:text-[#1c1917] transition">Admin Portal</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-[#e7e5e4] text-center text-[11px] text-[#a8a29e]">
          &copy; 2026 Samaj Biodata Portal. All verified records are maintained under strict community privacy guidelines.
        </div>
      </div>
    </footer>
  );
}
