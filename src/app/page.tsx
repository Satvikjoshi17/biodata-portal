import { getDirectoryProfiles } from "@/lib/actions";
import { DirectoryClient } from "@/components/DirectoryClient";
import Link from "next/link";
import { UserPlus, ShieldCheck, Search, Users, Sparkles, Building2 } from "lucide-react";

export default async function HomePage() {
  const profiles = await getDirectoryProfiles();

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Editorial Hero Header */}
      <div className="bg-white border border-[#e7e5e4] rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#faf8f5] border border-[#e7e5e4] text-[#c2410c] text-xs font-semibold uppercase tracking-wider mb-4 font-mono-tag">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]"></span>
            अखिल भारतीय समाज डिजिटल अभिलेख
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1c1917] tracking-tight leading-[1.15]">
            सामूहिक बायोडाटा एवं पारिवारिक निर्देशिका
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-[#57534e] leading-relaxed">
            A trusted community directory linking native roots, verified educational &amp; professional profiles, and shareable digital QR biodatas.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold text-xs sm:text-sm shadow-xs transition"
            >
              <UserPlus className="w-4 h-4" /> नया बायोडाटा जोड़ें (Register)
            </Link>
            <a
              href="#directory-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d6d3d1] bg-white hover:bg-[#faf8f5] text-[#1c1917] font-semibold text-xs sm:text-sm transition"
            >
              <Search className="w-4 h-4 text-[#78716c]" /> Explore Directory
            </a>
          </div>
        </div>

        {/* Community Trust Stats Strip */}
        <div className="mt-8 pt-6 border-t border-[#f5f5f4] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[#a8a29e] block font-mono-tag uppercase text-[10px]">Registry Status</span>
            <span className="font-bold text-[#1c1917] flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Verified
            </span>
          </div>
          <div>
            <span className="text-[#a8a29e] block font-mono-tag uppercase text-[10px]">Total Published</span>
            <span className="font-bold text-[#1c1917] mt-0.5 block font-mono-tag">
              {profiles.length} Active Records
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[#a8a29e] block font-mono-tag uppercase text-[10px]">Instant Access</span>
            <span className="font-bold text-[#1c1917] mt-0.5 block">
              Scan &amp; Share via QR
            </span>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <section id="directory-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#1c1917]">
              सत्यापित निर्देशिका (Directory)
            </h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Filter by native village, metropolitan area, or search by career.
            </p>
          </div>
        </div>

        <DirectoryClient initialProfiles={profiles} />
      </section>
    </div>
  );
}
