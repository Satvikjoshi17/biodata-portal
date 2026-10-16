"use client";

import Link from "next/link";
import { formatIndianPhone } from "@/lib/utils";
import { ShareProfileActions } from "@/components/ShareProfileActions";
import { useLanguage } from "@/lib/LanguageContext";
import type { Profile } from "@/lib/schema";
import {
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  GraduationCap,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Compass,
  Users,
  Home,
} from "lucide-react";

interface ProfileClientViewProps {
  profile: Profile;
}

export function ProfileClientView({ profile }: ProfileClientViewProps) {
  const { t } = useLanguage();

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* Top Bar with Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534e] hover:text-[#c2410c] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t.profile.backBtn}
        </Link>
        <span className="text-[11px] font-mono-tag text-[#78716c] uppercase">
          ID: #{profile.id.toString().padStart(4, "0")} • {profile.profileSlug}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Biodata Sheet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#e7e5e4] shadow-xs overflow-hidden">
            {/* Editorial Certificate Banner */}
            <div className="bg-[#1c1917] text-white p-6 sm:p-8 border-b-2 border-[#c2410c]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Photo Frame */}
                <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-white/30 shadow-md bg-[#292524] flex-shrink-0 relative">
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

                <div className="text-center sm:text-left flex-1 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-xs font-semibold font-mono-tag">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {t.profile.verifiedBadge}
                  </div>

                  <h1 className="font-serif-heading text-2xl sm:text-3xl font-black tracking-tight">
                    {profile.fullName}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#d6d3d1]">
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
            <div className="p-6 sm:p-8 space-y-6">
              {/* 1. Birth & Astrological Details (If present) */}
              {(profile.dob || profile.tob || profile.pob || profile.gotra) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#c2410c]" /> 1. {t.profile.birthDetails}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {profile.dob && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium text-[11px]">D.O.B:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.dob}</span>
                      </div>
                    )}
                    {profile.tob && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium text-[11px]">{t.profile.tob}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.tob}</span>
                      </div>
                    )}
                    {profile.pob && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium text-[11px]">{t.profile.pob}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.pob}</span>
                      </div>
                    )}
                    {profile.gotra && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium text-[11px]">{t.profile.gotra}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.gotra}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Origin & Residence */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#c2410c]" /> 2. {t.profile.originTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.gaon}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block">{profile.gaon}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.area}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block">{profile.area}</span>
                  </div>
                  {profile.domicile && (
                    <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                      <span className="text-[#a8a29e] block font-medium">{t.profile.domicile}:</span>
                      <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.domicile}</span>
                    </div>
                  )}
                  {profile.residentAddress && (
                    <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                      <span className="text-[#a8a29e] block font-medium">{t.profile.address}:</span>
                      <span className="font-bold text-[#1c1917] mt-0.5 block leading-relaxed">{profile.residentAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Education & Profession */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#c2410c]" /> 3. {t.profile.eduTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.education}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block">
                      {profile.education || "N/A"}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                    <span className="text-[#a8a29e] block font-medium">{t.profile.occupation}:</span>
                    <span className="font-bold text-[#1c1917] text-sm mt-0.5 block">
                      {profile.occupation || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Family Details & Lineage */}
              {(profile.fatherName || profile.motherName || profile.siblings || profile.grandFather || profile.grandMother) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#c2410c]" /> 4. {t.profile.familyTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {profile.fatherName && (
                      <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.father}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">
                          {profile.fatherName}
                          {profile.fatherOccupation && (
                            <span className="block text-[#57534e] text-[11px] font-normal">
                              {t.profile.occupationPrefix}: {profile.fatherOccupation}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {profile.motherName && (
                      <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.mother}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">
                          {profile.motherName}
                          {profile.motherOccupation && (
                            <span className="block text-[#57534e] text-[11px] font-normal">
                              {t.profile.occupationPrefix}: {profile.motherOccupation}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {profile.siblings && (
                      <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.siblings}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.siblings}</span>
                      </div>
                    )}

                    {profile.grandFather && (
                      <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4]">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.grandFather}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.grandFather}</span>
                      </div>
                    )}

                    {profile.grandMother && (
                      <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] sm:col-span-2">
                        <span className="text-[#a8a29e] block font-medium">{t.profile.grandMother}:</span>
                        <span className="font-bold text-[#1c1917] mt-0.5 block">{profile.grandMother}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Direct Contact Numbers */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 mb-3 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#c2410c]" /> 5. {t.profile.contactTitle}
                </h3>
                <div className="space-y-2.5">
                  {/* Primary Phone */}
                  <div className="p-3.5 rounded-lg bg-[#f0fdf4] border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[#166534] block text-[11px] font-semibold">
                        {t.profile.primaryPhone}
                      </span>
                      <span className="font-mono-tag font-bold text-base text-[#14532d]">
                        {formatIndianPhone(profile.phoneNumber)}
                      </span>
                    </div>
                    <a
                      href={`tel:${profile.phoneNumber}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold transition shadow-xs"
                    >
                      {t.profile.callNow}
                    </a>
                  </div>

                  {/* Father's & Mother's Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {profile.fatherContact && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] flex items-center justify-between">
                        <div>
                          <span className="text-[#78716c] block text-[10px] font-semibold uppercase font-mono-tag">
                            {t.profile.fatherPhone}
                          </span>
                          <span className="font-mono-tag font-bold text-xs text-[#1c1917]">
                            {formatIndianPhone(profile.fatherContact)}
                          </span>
                        </div>
                        <a
                          href={`tel:${profile.fatherContact}`}
                          className="px-2.5 py-1 rounded bg-[#1c1917] text-white text-[11px] font-semibold hover:bg-[#c2410c] transition"
                        >
                          {t.profile.callNow}
                        </a>
                      </div>
                    )}

                    {profile.motherContact && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e7e5e4] flex items-center justify-between">
                        <div>
                          <span className="text-[#78716c] block text-[10px] font-semibold uppercase font-mono-tag">
                            {t.profile.motherPhone}
                          </span>
                          <span className="font-mono-tag font-bold text-xs text-[#1c1917]">
                            {formatIndianPhone(profile.motherContact)}
                          </span>
                        </div>
                        <a
                          href={`tel:${profile.motherContact}`}
                          className="px-2.5 py-1 rounded bg-[#1c1917] text-white text-[11px] font-semibold hover:bg-[#c2410c] transition"
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
        </div>
      </div>
    </div>
  );
}
