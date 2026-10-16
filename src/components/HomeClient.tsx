// src/components/HomeClient.tsx
'use client';

import Link from "next/link";
import { UserPlus, ShieldCheck, Search } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { DirectoryClient } from "@/components/DirectoryClient";
import type { Profile } from "@/lib/schema";

interface HomeClientProps { 
  initialProfiles: Profile[];
}

export default function HomeClient({ initialProfiles }: HomeClientProps) {
  const { t } = useLanguage();

  return (
    <div className="py-6 sm:py-12 md:py-14 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Editorial Hero Header */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-5 sm:p-8 md:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-md bg-[#faf8f5] border border-[#e7e5e4] text-[#c2410c] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 font-mono-tag max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] flex-shrink-0"></span>
            <span className="break-words leading-tight">{t.home.badge}</span>
          </div>

          <h1 className="font-serif-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#1c1917] tracking-tight leading-[1.2] break-words">
            {t.home.heroTitle}
          </h1>

          <p className="mt-2.5 sm:mt-3.5 text-sm sm:text-base lg:text-lg text-[#57534e] leading-relaxed break-words">
            {t.home.heroSubtitle}
          </p>

          <div className="mt-5 sm:mt-6 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3">
            <Link
              href="/register"
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold text-xs sm:text-sm shadow-xs transition"
            >
              <UserPlus className="w-4 h-4 flex-shrink-0" />
              <span>{t.home.registerBtn}</span>
            </Link>
            <a
              href="#directory-section"
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg border border-[#d6d3d1] bg-white hover:bg-[#faf8f5] text-[#1c1917] font-semibold text-xs sm:text-sm transition"
            >
              <Search className="w-4 h-4 text-[#78716c] flex-shrink-0" />
              <span>{t.home.exploreBtn}</span>
            </a>
          </div>
        </div>

        {/* Community Trust Stats Strip */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#f5f5f4] grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
          <div>
            <span className="text-[#a8a29e] block font-mono-tag uppercase text-[10px]">
              {t.home.statusLabel}
            </span>
            <span className="font-bold text-[#1c1917] flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {t.home.statusValue}
            </span>
          </div>
          <div>
            <span className="text-[#a8a29e] block font-mono-tag uppercase text-[10px]">
              {t.home.totalLabel}
            </span>
            <span className="font-bold text-[#1c1917] mt-0.5 block font-mono-tag">
              {initialProfiles.length} {t.home.totalSuffix}
            </span>
          </div>
          <div className="xs:col-span-2 sm:col-span-1">
            <span className="text-[#a8a29e] block font-mono-tag uppercase text-[10px]">
              {t.home.instantLabel}
            </span>
            <span className="font-bold text-[#1c1917] mt-0.5 block">
              {t.home.instantValue}
            </span>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <section id="directory-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-heading text-lg xs:text-xl sm:text-2xl font-bold text-[#1c1917] break-words">
              {t.home.directoryHeading}
            </h2>
            <p className="text-xs text-[#78716c] mt-0.5 break-words">
              {t.home.directorySubtitle}
            </p>
          </div>
        </div>

        <DirectoryClient initialProfiles={initialProfiles} />
      </section>
    </div>
  );
}