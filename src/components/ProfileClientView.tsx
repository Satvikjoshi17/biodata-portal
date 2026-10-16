"use client";

import Link from "next/link";
import { formatIndianPhone } from "@/lib/utils";
import { ShareProfileActions } from "@/components/ShareProfileActions";
import { useLanguage } from "@/lib/LanguageContext";
import { AdBanner } from "@/components/AdBanner";
import type { Profile, Advertisement } from "@/lib/schema";
import {
  MapPin,
  Calendar,
  GraduationCap,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Users,
} from "lucide-react";

interface ProfileClientViewProps {
  profile: Profile;
  ads?: Advertisement[];
}

export function ProfileClientView({ profile, ads = [] }: ProfileClientViewProps) {
  const { t } = useLanguage();

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-5 sm:space-y-6">
      {/* Top Bar with Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#c2410c] transition py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="break-words">{t.profile.backBtn}</span>
        </Link>
        <span className="text-[10px] sm:text-[11px] font-mono-tag text-[#78716c] uppercase truncate max-w-[200px] sm:max-w-none">
          ID: #{profile.id.toString().padStart(4, "0")} • {profile.profileSlug}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Biodata Sheet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#e7e5e4] shadow-xs overflow-hidden">
            {/* Editorial Certificate Banner */}
            <div className="bg-[#1c1917] text-white p-5 sm:p-8 border-b-2 border-[#c2410c]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                {/* Photo Frame */}
                <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-lg overflow-hidden border-2 border-white/30 shadow-md bg-[#292524] flex-shrink-0 relative mx-auto sm:mx-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs font-mono-tag">
                    {t.directory.verifiedBadge}
                  </div>
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-xs font-semibold font-mono-tag">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{t.profile.verifiedBadge}</span>
                  </div>

                  <h1 className="font-serif-heading text-2xl sm:text-3xl font-black tracking-tight break-words">
                    {profile.fullName}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs text-[#d6d3d1]">
                    <span>
                      {t.profile.ageLabel}: <strong className="text-white font-semibold">{profile.age} {t.profile.yearsSuffix}</strong>
                    </span>
                    {profile.height && (
                      <>
                        <span>•</span>
                        <span>
                          {t.profile.height}: <strong className="text-white font-semibold">{profile.height}</strong>
                        </span>
                      </>
                    )}
                    {profile.gotra && (
                      <>
                        <span>•</span>
                        <span>
                          {t.profile.gotra}: <strong className="text-white font-semibold">{profile.gotra}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Table Sections */}
            <div className="p-4.5 sm:p-8 space-y-6">
              {/* 1. Birth & Astrological Details (If present) */}
              {(profile.dob || profile.tob || profile.pob || profile.gotra) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2 break-words">
                    <Calendar className="w-3.5 h-3.5 text-[#c2410c] flex-shrink-0" />
                    <span>1. {t.profile.birthDetails}</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-xs">
                    {profile.dob && (
                      <div className="p-2.5 sm:p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium text-[10px] sm:text-[11px]">D.O.B:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block truncate">{profile.dob}</span>
                      </div>
                    )}
                    {profile.tob && (
                      <div className="p-2.5 sm:p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium text-[10px] sm:text-[11px]">{t.profile.tob}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block truncate">{profile.tob}</span>
                      </div>
                    )}
                    {profile.pob && (
                      <div className="p-2.5 sm:p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium text-[10px] sm:text-[11px]">{t.profile.pob}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block truncate">{profile.pob}</span>
                      </div>
                    )}
                    {profile.gotra && (
                      <div className="p-2.5 sm:p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium text-[10px] sm:text-[11px]">{t.profile.gotra}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block truncate">{profile.gotra}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Origin & Residence */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2 break-words">
                  <MapPin className="w-3.5 h-3.5 text-[#c2410c] flex-shrink-0" />
                  <span>2. {t.profile.originTitle}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.gaon}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block break-words">{profile.gaon}</span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.area}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block break-words">{profile.area}</span>
                  </div>
                  {profile.domicile && (
                    <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                      <span className="text-[#a8a29e] block font-medium">{t.profile.domicile}:</span>
                      <span className="font-bold text-[#1c1917] mt-0.5 block break-words">{profile.domicile}</span>
                    </div>
                  )}
                  {profile.residentAddress && (
                    <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0 sm:col-span-2">
                      <span className="text-[#a8a29e] block font-medium">{t.profile.address}:</span>
                      <span className="font-bold text-[#1c1917] mt-0.5 block leading-relaxed break-words">{profile.residentAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Education & Profession */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2 break-words">
                  <GraduationCap className="w-3.5 h-3.5 text-[#c2410c] flex-shrink-0" />
                  <span>3. {t.profile.eduTitle}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.education}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block break-words">
                      {profile.education || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.occupation}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block break-words">
                      {profile.occupation || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Family Details & Lineage */}
              {(profile.fatherName || profile.motherName || profile.siblings || profile.grandFather || profile.grandMother) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2 break-words">
                    <Users className="w-3.5 h-3.5 text-[#c2410c] flex-shrink-0" />
                    <span>4. {t.profile.familyTitle}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                    {profile.fatherName && (
                      <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.father}:</span>
                        <div className="font-bold text-[#1c1917] mt-0.5 block break-words">
                          {profile.fatherName}
                          {profile.fatherOccupation && (
                            <span className="block text-[#57534e] text-[11px] font-normal break-words mt-0.5">
                              {t.profile.occupationPrefix}: {profile.fatherOccupation}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {profile.motherName && (
                      <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.mother}:</span>
                        <div className="font-bold text-[#1c1917] mt-0.5 block break-words">
                          {profile.motherName}
                          {profile.motherOccupation && (
                            <span className="block text-[#57534e] text-[11px] font-normal break-words mt-0.5">
                              {t.profile.occupationPrefix}: {profile.motherOccupation}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {profile.siblings && (
                      <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.siblings}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block break-words">{profile.siblings}</span>
                      </div>
                    )}

                    {profile.grandFather && (
                      <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] min-w-0">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.grandFather}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block break-words">{profile.grandFather}</span>
                      </div>
                    )}

                    {profile.grandMother && (
                      <div className="p-3 sm:p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] sm:col-span-2 min-w-0">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.grandMother}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block break-words">{profile.grandMother}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Direct Contact Numbers */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2 break-words">
                  <Phone className="w-3.5 h-3.5 text-[#c2410c] flex-shrink-0" />
                  <span>5. {t.profile.contactTitle}</span>
                </h3>
                <div className="space-y-2.5">
                  {/* Primary Phone */}
                  <div className="p-3.5 rounded-lg bg-[#f0fdf4] border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="text-[#166534] block text-[11px] font-semibold">
                        {t.profile.primaryPhone}
                      </span>
                      <span className="font-mono-tag font-bold text-base text-[#14532d] break-words">
                        {formatIndianPhone(profile.phoneNumber)}
                      </span>
                    </div>
                    <a
                      href={`tel:${profile.phoneNumber}`}
                      className="w-full sm:w-auto min-h-[40px] inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold transition shadow-xs cursor-pointer"
                    >
                      {t.profile.callNow}
                    </a>
                  </div>

                  {/* Father's & Mother's Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {profile.fatherContact && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[#78716c] block text-[10px] font-semibold uppercase font-mono-tag truncate">
                            {t.profile.fatherPhone}
                          </span>
                          <span className="font-mono-tag font-bold text-xs text-[#1c1917]">
                            {formatIndianPhone(profile.fatherContact)}
                          </span>
                        </div>
                        <a
                          href={`tel:${profile.fatherContact}`}
                          className="px-3 py-1.5 rounded bg-[#1c1917] text-white text-[11px] font-semibold hover:bg-[#c2410c] transition flex-shrink-0"
                        >
                          {t.profile.callNow}
                        </a>
                      </div>
                    )}

                    {profile.motherContact && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[#78716c] block text-[10px] font-semibold uppercase font-mono-tag truncate">
                            {t.profile.motherPhone}
                          </span>
                          <span className="font-mono-tag font-bold text-xs text-[#1c1917]">
                            {formatIndianPhone(profile.motherContact)}
                          </span>
                        </div>
                        <a
                          href={`tel:${profile.motherContact}`}
                          className="px-3 py-1.5 rounded bg-[#1c1917] text-white text-[11px] font-semibold hover:bg-[#c2410c] transition flex-shrink-0"
                        >
                          {t.profile.callNow}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code and Actions Column */}
        <div className="space-y-6">
          <ShareProfileActions slug={profile.profileSlug} fullName={profile.fullName} />
          {/* Profile Sidebar Advertisement */}
          <AdBanner placement="profile_sidebar" ads={ads} />
        </div>
      </div>
    </div>
  );
}
