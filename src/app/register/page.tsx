"use client";

import { RegisterForm } from "@/components/RegisterForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#c2410c] transition mb-3 sm:mb-4 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="break-words">{t.form.backBtn}</span>
        </Link>

        <div className="bg-white border border-[#e7e5e4] rounded-xl p-4.5 sm:p-8 shadow-xs">
          <span className="text-[10px] font-mono-tag font-semibold uppercase tracking-wider text-[#c2410c] bg-[#faf8f5] px-2.5 py-1 rounded border border-[#e7e5e4] inline-block mb-2.5 sm:mb-3">
            {t.form.badge}
          </span>
          <h1 className="font-serif-heading text-xl sm:text-2xl md:text-3xl font-black text-[#1c1917] tracking-tight break-words">
            {t.form.heading}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#57534e] leading-relaxed break-words">
            {t.form.subheading}
          </p>
        </div>
      </div>

      <RegisterForm />
    </div>
  );
}
