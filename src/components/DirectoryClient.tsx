"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, QrCode, UserPlus, Filter, X, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Profile } from "@/lib/schema";

interface DirectoryClientProps {
  initialProfiles: Profile[];
}

export function DirectoryClient({ initialProfiles }: DirectoryClientProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGaon, setSelectedGaon] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "age_asc" | "age_desc">("newest");

  // Dynamically extract unique gaons and areas
  const uniqueGaons = useMemo(() => {
    const list = Array.from(new Set(initialProfiles.map((p) => p.gaon).filter(Boolean)));
    return list.sort();
  }, [initialProfiles]);

  const uniqueAreas = useMemo(() => {
    const list = Array.from(new Set(initialProfiles.map((p) => p.area).filter(Boolean)));
    return list.sort();
  }, [initialProfiles]);

  // Filter and sort profiles
  const filteredProfiles = useMemo(() => {
    return initialProfiles
      .filter((profile) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (profile.occupation && profile.occupation.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (profile.education && profile.education.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesGaon = selectedGaon === "all" || profile.gaon === selectedGaon;
        const matchesArea = selectedArea === "all" || profile.area === selectedArea;

        return matchesSearch && matchesGaon && matchesArea;
      })
      .sort((a, b) => {
        if (sortBy === "age_asc") return a.age - b.age;
        if (sortBy === "age_desc") return b.age - a.age;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [initialProfiles, searchQuery, selectedGaon, selectedArea, sortBy]);

  const hasActiveFilters = searchQuery !== "" || selectedGaon !== "all" || selectedArea !== "all" || sortBy !== "newest";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGaon("all");
    setSelectedArea("all");
    setSortBy("newest");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#a8a29e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.directory.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-sm text-[#1c1917] bg-[#faf8f5]/60 placeholder:text-[#a8a29e]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Native Gaon Selector */}
          <div className="relative">
            <select
              value={selectedGaon}
              onChange={(e) => setSelectedGaon(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-sm text-[#1c1917] bg-[#faf8f5]/60 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">{t.directory.allGaon}</option>
              {uniqueGaons.map((gaon) => (
                <option key={gaon} value={gaon}>
                  {gaon}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] text-xs">
              ▼
            </div>
          </div>

          {/* Current Area / City Selector */}
          <div className="relative">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-sm text-[#1c1917] bg-[#faf8f5]/60 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">{t.directory.allAreas}</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] text-xs">
              ▼
            </div>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-11 px-3.5 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-sm text-[#1c1917] bg-[#faf8f5]/60 appearance-none pr-8 cursor-pointer"
            >
              <option value="newest">{t.directory.sortRecent}</option>
              <option value="age_asc">{t.directory.sortAgeAsc}</option>
              <option value="age_desc">{t.directory.sortAgeDesc}</option>
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Filter State Footer */}
        <div className="mt-3.5 pt-3 border-t border-[#f5f5f4] flex items-center justify-between text-xs text-[#78716c]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1c1917]">{filteredProfiles.length}</span>
            <span>{t.directory.verifiedProfilesCount}</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#c2410c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> {t.directory.clearFilters}
            </button>
          )}
        </div>
      </div>

      {/* Profile Cards Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e7e5e4] p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 bg-[#faf8f5] text-[#a8a29e] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#e7e5e4]">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="font-serif-heading text-lg font-bold text-[#1c1917] mb-1">
            {t.directory.noProfilesTitle}
          </h3>
          <p className="text-xs text-[#78716c] mb-5 leading-relaxed">
            {t.directory.noProfilesDesc}
          </p>
          <div className="flex justify-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg border border-[#d6d3d1] text-xs font-semibold text-[#44403c] hover:bg-[#faf8f5] transition cursor-pointer"
              >
                {t.directory.resetFilters}
              </button>
            )}
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-[#c2410c] text-white text-xs font-semibold hover:bg-[#9a3412] transition inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> {t.directory.registerNow}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-xl border border-[#e7e5e4] card-hover flex flex-col overflow-hidden"
            >
              {/* Photo Area */}
              <div className="relative h-60 bg-[#f5f5f4] overflow-hidden border-b border-[#e7e5e4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />

                {/* Verified Official Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#166534] text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-200 shadow-xs flex items-center gap-1 font-mono-tag">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {t.directory.verifiedBadge}
                </div>

                {/* Age Badge */}
                <div className="absolute bottom-3 right-3 bg-[#1c1917]/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded font-mono-tag">
                  {profile.age} {t.directory.yrs}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif-heading text-base font-bold text-[#1c1917] truncate">
                    {profile.fullName}
                  </h3>

                  {/* Village and City badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#faf8f5] text-[#57534e] px-2.5 py-0.5 rounded border border-[#e7e5e4]">
                      <MapPin className="w-3 h-3 text-[#c2410c]" />
                      {profile.gaon}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#f5f5f4] text-[#57534e] px-2.5 py-0.5 rounded border border-[#e7e5e4]">
                      <Building2 className="w-3 h-3 text-[#78716c]" />
                      {profile.area}
                    </span>
                  </div>

                  {/* Occupation & Education */}
                  <div className="mt-3 pt-3 border-t border-[#f5f5f4] space-y-1.5 text-xs text-[#57534e]">
                    {profile.occupation && (
                      <p className="line-clamp-1">
                        <span className="text-[#a8a29e] font-medium">{t.directory.work}:</span>{" "}
                        <strong className="text-[#1c1917] font-semibold">{profile.occupation}</strong>
                      </p>
                    )}
                    {profile.education && (
                      <p className="line-clamp-1">
                        <span className="text-[#a8a29e] font-medium">{t.directory.edu}:</span>{" "}
                        <span className="text-[#44403c]">{profile.education}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Button */}
                <div className="pt-2">
                  <Link
                    href={`/profile/${profile.profileSlug}`}
                    className="w-full h-10 inline-flex items-center justify-center gap-2 px-4 rounded-lg bg-[#1c1917] hover:bg-[#c2410c] text-white text-xs font-semibold transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{t.directory.viewBiodata}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
