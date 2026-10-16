"use client";

import Link from "next/link";
import { UserPlus, ShieldCheck, BookOpen } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/LanguageContext";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 flex-shrink">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#c2410c] flex items-center justify-center text-white shadow-xs transition group-hover:bg-[#9a3412] flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif-heading text-base sm:text-xl font-bold tracking-tight text-[#1c1917] group-hover:text-[#c2410c] transition truncate">
                {t.navbar.title}
              </span>
              <span className="hidden md:block text-[11px] font-medium text-[#78716c] -mt-0.5 tracking-wider uppercase truncate">
                {t.navbar.subtitle}
              </span>
            </div>
          </Link>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className="hidden md:inline-flex text-xs sm:text-sm font-semibold text-[#44403c] hover:text-[#c2410c] px-2.5 py-1.5 rounded-lg transition"
            >
              {t.navbar.directory}
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs sm:text-sm font-semibold shadow-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden xs:inline">{t.navbar.register}</span>
            </Link>

            {/* Language Switcher Toggle */}
            <LanguageToggle />

            <Link
              href="/admin/dashboard"
              className="p-1.5 sm:p-2 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4] transition flex-shrink-0"
              title={t.navbar.admin}
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
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
    <footer className="mt-auto border-t border-[#e7e5e4] bg-[#f5f5f4] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716c] text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse flex-shrink-0"></span>
            <span className="font-medium text-[#44403c] leading-normal break-words">
              {t.navbar.footerCommunity}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
            <Link href="/" className="hover:text-[#1c1917] transition">{t.navbar.directory}</Link>
            <Link href="/register" className="hover:text-[#1c1917] transition">{t.navbar.register}</Link>
            <Link href="/admin/login" className="hover:text-[#1c1917] transition">{t.navbar.admin}</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-[#e7e5e4] text-center text-[11px] text-[#a8a29e] leading-relaxed break-words">
          {t.navbar.footerCopyright}
        </div>
      </div>
    </footer>
  );
}
