"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { DirectoryClient } from "@/components/DirectoryClient";
import type { Profile } from "@/lib/schema";

interface DirectoryPageClientProps {
  initialProfiles: Profile[];
}

export function DirectoryPageClient({ initialProfiles }: DirectoryPageClientProps) {
  const { t } = useLanguage();

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#1c1917] tracking-tight">
          {t.directory.pageTitle}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#78716c]">
          {t.directory.pageSubtitle}
        </p>
      </div>

      <DirectoryClient initialProfiles={initialProfiles} />
    </div>
  );
}
