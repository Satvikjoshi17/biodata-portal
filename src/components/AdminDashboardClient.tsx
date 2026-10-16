"use client";

import { useState, useTransition } from "react";
import { updateProfileStatus, adminLogout } from "@/lib/actions";
import { toast } from "sonner";
import { formatIndianPhone } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import type { Profile } from "@/lib/schema";
import {
  CheckCircle,
  XCircle,
  Eye,
  LogOut,
  MapPin,
  Building2,
  Clock,
  ShieldCheck,
  Search,
  X,
  Phone,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialProfiles: Profile[];
}

export function AdminDashboardClient({ initialProfiles }: AdminDashboardClientProps) {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [previewProfile, setPreviewProfile] = useState<Profile | null>(null);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: number, newStatus: "approved" | "rejected" | "pending") => {
    startTransition(async () => {
      try {
        const res = await updateProfileStatus(id, newStatus);
        if (res.success) {
          toast.success(`Profile status updated to '${newStatus}'`);
          setProfiles((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
          );
          if (previewProfile?.id === id) {
            setPreviewProfile((prev) => (prev ? { ...prev, status: newStatus } : null));
          }
        } else {
          toast.error(res.error || "Failed to update profile.");
        }
      } catch {
        toast.error("Error updating status.");
      }
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
      window.location.href = "/admin/login";
    });
  };

  const counts = {
    pending: profiles.filter((p) => p.status === "pending").length,
    approved: profiles.filter((p) => p.status === "approved").length,
    rejected: profiles.filter((p) => p.status === "rejected").length,
  };

  const currentList = profiles
    .filter((p) => p.status === activeTab)
    .filter(
      (p) =>
        search.trim() === "" ||
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.gaon.toLowerCase().includes(search.toLowerCase()) ||
        p.area.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 sm:p-6 rounded-xl border border-[#e7e5e4] shadow-xs">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#faf8f5] text-[#c2410c] border border-[#e7e5e4] text-xs font-semibold font-mono-tag mb-2">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" /> {t.admin.portalBadge}
          </div>
          <h1 className="font-serif-heading text-xl sm:text-2xl font-black text-[#1c1917] tracking-tight break-words">
            {t.admin.dashboardTitle}
          </h1>
          <p className="text-xs text-[#78716c] mt-1 break-words">
            {t.admin.dashboardSubtitle}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#d6d3d1] text-[#44403c] hover:bg-[#faf8f5] text-xs font-semibold transition cursor-pointer self-stretch sm:self-auto flex-shrink-0"
        >
          <LogOut className="w-3.5 h-3.5 text-[#78716c]" /> {t.admin.signOut}
        </button>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap p-1 bg-[#f5f5f4] border border-[#e7e5e4] rounded-lg gap-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === "pending"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span className="truncate">{t.admin.pendingTab}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono-tag font-bold flex-shrink-0 ${
                counts.pending > 0 ? "bg-amber-100 text-amber-900" : "bg-[#e7e5e4] text-[#78716c]"
              }`}
            >
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === "approved"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span className="truncate">{t.admin.approvedTab}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-tag font-bold bg-emerald-100 text-emerald-900 flex-shrink-0">
              {counts.approved}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === "rejected"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span className="truncate">{t.admin.rejectedTab}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-tag font-bold bg-rose-100 text-rose-900 flex-shrink-0">
              {counts.rejected}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#a8a29e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t.admin.searchRecords}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#e7e5e4] bg-white text-xs text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c]"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] shadow-xs overflow-hidden">
        {currentList.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-[#78716c]">
            <Clock className="w-6 h-6 text-[#a8a29e] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1c1917] break-words">{t.admin.noSubmissions}</p>
            <p className="text-xs text-[#a8a29e] mt-0.5 break-words">
              {t.admin.noSubmissionsDesc}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (Visible on small screens <sm) */}
            <div className="block sm:hidden divide-y divide-[#f5f5f4]">
              {currentList.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photoUrl}
                      alt={p.fullName}
                      className="w-14 h-16 rounded-lg object-cover border border-[#e7e5e4] bg-[#f5f5f4] flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-[#1c1917] truncate">{p.fullName}</div>
                      <span className="text-[10px] text-[#a8a29e] font-mono-tag block truncate">
                        {p.profileSlug}
                      </span>
                      <div className="text-xs text-[#57534e] mt-1 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#1c1917]">
                          <MapPin className="w-3 h-3 text-[#c2410c]" /> {p.gaon}
                        </span>
                        <span>•</span>
                        <span className="text-[#78716c]">{p.age} {t.directory.yrs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[#78716c] bg-[#faf8f5] p-2.5 rounded-lg border border-[#e7e5e4] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#a8a29e]">{t.profile.area}:</span>
                      <span className="font-medium text-[#1c1917] truncate">{p.area}</span>
                    </div>
                    {p.occupation && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#a8a29e]">{t.directory.work}:</span>
                        <span className="font-medium text-[#1c1917] truncate max-w-[180px]">{p.occupation}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[#a8a29e]">{t.profile.primaryPhone}:</span>
                      <span className="font-mono-tag font-semibold text-[#1c1917]">{formatIndianPhone(p.phoneNumber)}</span>
                    </div>
                  </div>

                  {/* Mobile Actions Toolbar */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setPreviewProfile(p)}
                      className="flex-1 py-2 px-3 rounded-lg border border-[#d6d3d1] hover:bg-[#faf8f5] text-[#44403c] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.admin.inspectBtn}</span>
                    </button>

                    {p.status !== "approved" && (
                      <button
                        disabled={isPending}
                        onClick={() => handleStatusChange(p.id, "approved")}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t.admin.approveBtn}</span>
                      </button>
                    )}

                    {p.status !== "rejected" && (
                      <button
                        disabled={isPending}
                        onClick={() => handleStatusChange(p.id, "rejected")}
                        className="py-2 px-3 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        title={t.admin.rejectBtn}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Hidden on mobile <sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f5f5f4] bg-[#faf8f5] text-[10px] font-bold uppercase tracking-wider text-[#78716c] font-mono-tag">
                    <th className="py-3 px-4">{t.admin.colCandidate}</th>
                    <th className="py-3 px-4">{t.admin.colVillageArea}</th>
                    <th className="py-3 px-4">{t.admin.colAgePhone}</th>
                    <th className="py-3 px-4">{t.admin.colEduWork}</th>
                    <th className="py-3 px-4 text-right">{t.admin.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f4] text-xs text-[#57534e]">
                  {currentList.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf8f5]/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.photoUrl}
                            alt={p.fullName}
                            className="w-10 h-12 rounded object-cover border border-[#e7e5e4] bg-[#f5f5f4] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-[#1c1917] truncate">{p.fullName}</div>
                            <span className="text-[10px] text-[#a8a29e] font-mono-tag truncate block">
                              {p.profileSlug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#1c1917] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#c2410c] flex-shrink-0" /> <span className="truncate">{p.gaon}</span>
                          </div>
                          <div className="text-[#78716c] flex items-center gap-1 text-[11px]">
                            <Building2 className="w-3 h-3 text-[#a8a29e] flex-shrink-0" /> <span className="truncate">{p.area}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#1c1917]">{p.age} {t.directory.yrs}</div>
                          <div className="font-mono-tag text-[#78716c] text-[11px]">
                            {formatIndianPhone(p.phoneNumber)}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="max-w-[200px] truncate space-y-0.5">
                          <div className="font-medium text-[#1c1917] truncate">
                            {p.occupation || "N/A"}
                          </div>
                          <div className="text-[#78716c] truncate text-[11px]">{p.education || "N/A"}</div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewProfile(p)}
                            className="p-1.5 rounded border border-[#d6d3d1] hover:bg-[#faf8f5] text-[#57534e] transition cursor-pointer"
                            title={t.admin.inspectBtn}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {p.status !== "approved" && (
                            <button
                              disabled={isPending}
                              onClick={() => handleStatusChange(p.id, "approved")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-[11px] transition shadow-xs cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3" /> {t.admin.approveBtn}
                            </button>
                          )}

                          {p.status !== "rejected" && (
                            <button
                              disabled={isPending}
                              onClick={() => handleStatusChange(p.id, "rejected")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white font-semibold text-[11px] transition shadow-xs cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" /> {t.admin.rejectBtn}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Quick Inspection Modal */}
      {previewProfile && (
        <div className="fixed inset-0 z-50 bg-[#1c1917]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-[#e7e5e4] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewProfile(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a8a29e] hover:text-[#1c1917] hover:bg-[#f5f5f4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewProfile.photoUrl}
                alt={previewProfile.fullName}
                className="w-24 h-32 rounded-lg object-cover border border-[#e7e5e4] shadow-xs mx-auto mb-2.5"
              />
              <h2 className="font-serif-heading text-lg font-bold text-[#1c1917] break-words">
                {previewProfile.fullName}
              </h2>
              <span className="text-[11px] text-[#78716c] font-mono-tag block truncate">
                {previewProfile.profileSlug}
              </span>
            </div>

            <div className="space-y-2.5 text-xs bg-[#faf8f5] p-3.5 sm:p-4 rounded-lg border border-[#e7e5e4] mb-5">
              <div className="flex justify-between py-1 border-b border-[#e7e5e4] gap-2">
                <span className="text-[#78716c] flex-shrink-0">{t.profile.gaon}:</span>
                <span className="font-semibold text-[#1c1917] text-right break-words">{previewProfile.gaon}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4] gap-2">
                <span className="text-[#78716c] flex-shrink-0">{t.profile.area}:</span>
                <span className="font-semibold text-[#1c1917] text-right break-words">{previewProfile.area}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4] gap-2">
                <span className="text-[#78716c] flex-shrink-0">{t.profile.ageLabel}:</span>
                <span className="font-semibold text-[#1c1917]">{previewProfile.age} {t.directory.yrs}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4] gap-2">
                <span className="text-[#78716c] flex-shrink-0">{t.profile.primaryPhone}:</span>
                <span className="font-semibold font-mono-tag text-[#1c1917]">
                  {formatIndianPhone(previewProfile.phoneNumber)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4] gap-2">
                <span className="text-[#78716c] flex-shrink-0">{t.profile.education}:</span>
                <span className="font-semibold text-[#1c1917] text-right break-words">
                  {previewProfile.education || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1 gap-2">
                <span className="text-[#78716c] flex-shrink-0">{t.profile.occupation}:</span>
                <span className="font-semibold text-[#1c1917] text-right break-words">
                  {previewProfile.occupation || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-2">
              <button
                disabled={isPending}
                onClick={() => handleStatusChange(previewProfile.id, "approved")}
                className="flex-1 min-h-[40px] py-2 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t.admin.modalApprove}</span>
              </button>
              <button
                disabled={isPending}
                onClick={() => handleStatusChange(previewProfile.id, "rejected")}
                className="flex-1 min-h-[40px] py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{t.admin.modalReject}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
