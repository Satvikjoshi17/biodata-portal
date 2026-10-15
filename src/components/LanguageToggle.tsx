"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center p-0.5 rounded-lg border border-[#e7e5e4] bg-[#faf8f5]">
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
          language === "en"
            ? "bg-[#1c1917] text-white shadow-xs"
            : "text-[#78716c] hover:text-[#1c1917]"
        }`}
      >
        ENG
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
          language === "hi"
            ? "bg-[#c2410c] text-white shadow-xs"
            : "text-[#78716c] hover:text-[#1c1917]"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
