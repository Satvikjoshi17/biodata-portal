"use client";

import { useState, useTransition, useRef } from "react";
import {
  updateProfileStatus,
  adminLogout,
  createAdvertisement,
  toggleAdvertisementStatus,
  deleteAdvertisement,
  getAllAdsForAdmin,
} from "@/lib/actions";
import { toast } from "sonner";
import { formatIndianPhone } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import type { Profile, Advertisement, AdPlacement } from "@/lib/schema";
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
  Megaphone,
  Plus,
  ExternalLink,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Check,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialProfiles: Profile[];
  initialAds?: Advertisement[];
}

export function AdminDashboardClient({
  initialProfiles,
  initialAds = [],
}: AdminDashboardClientProps) {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [ads, setAds] = useState<Advertisement[]>(initialAds);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "ads">("pending");
  const [previewProfile, setPreviewProfile] = useState<Profile | null>(null);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Ad modal states
  const [isAddAdModalOpen, setIsAddAdModalOpen] = useState(false);
  const [adPreviewUrl, setAdPreviewUrl] = useState<string | null>(null);
  const [adPlacement, setAdPlacement] = useState<AdPlacement>("home_featured");
  const adFileRef = useRef<HTMLInputElement>(null);

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

  // Ads handlers
  const handleToggleAdStatus = (id: number) => {
    startTransition(async () => {
      try {
        const res = await toggleAdvertisementStatus(id);
        if (res.success) {
          toast.success("Ad status toggled!");
          setAds((prev) =>
            prev.map((a) => (a.id === id ? { ...a, active: a.active === "true" ? "false" : "true" } : a))
          );
        } else {
          toast.error(res.error || "Failed to update status.");
        }
      } catch {
        toast.error("Error updating ad status.");
      }
    });
  };

  const handleDeleteAd = (id: number) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
    startTransition(async () => {
      try {
        const res = await deleteAdvertisement(id);
        if (res.success) {
          toast.success("Advertisement deleted successfully!");
          setAds((prev) => prev.filter((a) => a.id !== id));
        } else {
          toast.error(res.error || "Failed to delete ad.");
        }
      } catch {
        toast.error("Error deleting ad.");
      }
    });
  };

  const handleCreateAd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await createAdvertisement(formData);
        if (res.success) {
          toast.success("Advertisement created successfully!");
          setIsAddAdModalOpen(false);
          setAdPreviewUrl(null);
          const updated = await getAllAdsForAdmin();
          if (updated) setAds(updated);
        } else {
          toast.error(res.error || "Failed to create ad.");
        }
      } catch {
        toast.error("Network error while creating ad.");
      }
    });
  };

  const counts = {
    pending: profiles.filter((p) => p.status === "pending").length,
    approved: profiles.filter((p) => p.status === "approved").length,
    rejected: profiles.filter((p) => p.status === "rejected").length,
    ads: ads.length,
    activeAds: ads.filter((a) => a.active === "true").length,
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

  const filteredAds = ads.filter(
    (a) =>
      search.trim() === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.placement.toLowerCase().includes(search.toLowerCase())
  );

  const getPlacementBadge = (placement: string) => {
    switch (placement) {
      case "top_banner":
        return { label: "Top Header Banner", color: "bg-blue-100 text-blue-900 border-blue-200" };
      case "home_featured":
        return { label: "Homepage Feature", color: "bg-purple-100 text-purple-900 border-purple-200" };
      case "directory_infeed":
        return { label: "Directory In-Feed Card", color: "bg-amber-100 text-amber-900 border-amber-200" };
      case "profile_sidebar":
        return { label: "Profile Sidebar", color: "bg-emerald-100 text-emerald-900 border-emerald-200" };
      case "portrait_flyer":
        return { label: "Portrait Poster / Flyer", color: "bg-rose-100 text-rose-900 border-rose-200" };
      default:
        return { label: placement, color: "bg-slate-100 text-slate-800 border-slate-200" };
    }
  };

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

          {/* New Advertisements Tab */}
          <button
            onClick={() => setActiveTab("ads")}
            className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === "ads"
                ? "bg-white text-[#c2410c] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-[#c2410c]" />
            <span className="truncate">विज्ञापन (Ads)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-tag font-bold bg-amber-100 text-amber-900 flex-shrink-0">
              {counts.ads}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#a8a29e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={activeTab === "ads" ? "Search ads by sponsor or placement..." : t.admin.searchRecords}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#e7e5e4] bg-white text-xs text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c]"
          />
        </div>
      </div>

      {/* VIEW 1: Advertisements Management Tab */}
      {activeTab === "ads" ? (
        <div className="space-y-4">
          {/* Subheader Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#e7e5e4] shadow-xs">
            <div className="text-xs text-[#78716c]">
              <span className="font-bold text-[#1c1917]">{counts.activeAds} Active Ads</span> out of {counts.ads} configured placements.
            </div>

            <button
              onClick={() => setIsAddAdModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>नया विज्ञापन जोड़ें (Create Ad)</span>
            </button>
          </div>

          {/* Advertisements Grid */}
          {filteredAds.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e7e5e4] p-12 text-center text-[#78716c]">
              <Megaphone className="w-8 h-8 text-[#a8a29e] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1c1917]">No Advertisements Found</p>
              <p className="text-xs text-[#a8a29e] mt-0.5">
                Click &quot;Create Ad&quot; to configure advertisements for Top Banner, Homepage, Directory, or Profile Sidebar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map((ad) => {
                const badge = getPlacementBadge(ad.placement);
                const isActive = ad.active === "true";

                return (
                  <div
                    key={ad.id}
                    className="bg-white rounded-xl border border-[#e7e5e4] shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-44 bg-[#faf8f5] overflow-hidden border-b border-[#e7e5e4]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color} font-mono-tag shadow-xs`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-tag shadow-xs ${
                              isActive ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-200"
                            }`}
                          >
                            {isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-serif-heading text-sm font-bold text-[#1c1917] line-clamp-2">
                          {ad.title}
                        </h4>

                        {ad.linkUrl ? (
                          <a
                            href={ad.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#c2410c] hover:underline truncate max-w-full font-mono"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{ad.linkUrl}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-[#a8a29e] italic block">No target link configured</span>
                        )}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="p-3 bg-[#faf8f5] border-t border-[#f5f5f4] flex items-center justify-between gap-2">
                      <button
                        disabled={isPending}
                        onClick={() => handleToggleAdStatus(ad.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50 ${
                          isActive
                            ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <ToggleLeft className="w-4 h-4" /> Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="w-4 h-4" /> Activate
                          </>
                        )}
                      </button>

                      <button
                        disabled={isPending}
                        onClick={() => handleDeleteAd(ad.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer disabled:opacity-50"
                        title="Delete Advertisement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: Candidate Profiles Submissions View */
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
                                <CheckCircle className="w-3.5 h-3.5" /> {t.admin.approveBtn}
                              </button>
                            )}

                            {p.status !== "rejected" && (
                              <button
                                disabled={isPending}
                                onClick={() => handleStatusChange(p.id, "rejected")}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white font-semibold text-[11px] transition shadow-xs cursor-pointer disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" /> {t.admin.rejectBtn}
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
      )}

      {/* MODAL 1: Create Advertisement Modal */}
      {isAddAdModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1917]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-[#e7e5e4] relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddAdModalOpen(false);
                setAdPreviewUrl(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a8a29e] hover:text-[#1c1917] hover:bg-[#f5f5f4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#faf8f5] text-[#c2410c] border border-[#e7e5e4] text-xs font-semibold font-mono-tag mb-1.5">
                <Megaphone className="w-3 h-3" /> ADVERTISEMENT ENGINE
              </div>
              <h2 className="font-serif-heading text-xl font-bold text-[#1c1917]">
                नया विज्ञापन जोड़ें (Add Advertisement)
              </h2>
              <p className="text-xs text-[#78716c] mt-0.5">
                Upload image, pick placement layout, and configure target redirect link.
              </p>
            </div>

            <form onSubmit={handleCreateAd} className="space-y-4">
              {/* Sponsor Title */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  Sponsor / Ad Title <span className="text-[#c2410c]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Shree Paliwal Jewellers - Wedding Collection"
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
                />
              </div>

              {/* Placement Layout Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  Display Layout Placement <span className="text-[#c2410c]">*</span>
                </label>
                <select
                  name="placement"
                  value={adPlacement}
                  onChange={(e) => setAdPlacement(e.target.value as AdPlacement)}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 cursor-pointer"
                >
                  <option value="portrait_flyer">📜 Portrait Poster / Flyer (वर्टिकल पोस्टर / पैम्फलेट - 3:4 / 9:16)</option>
                  <option value="top_banner">🏷️ Top Header Banner (शीर्ष बैनर - All Pages / Home Header)</option>
                  <option value="home_featured">🌟 Homepage Middle Feature (मुखपृष्ठ मध्य बैनर)</option>
                  <option value="directory_infeed">🃏 Directory In-Feed Card (निर्देशिका इन-फीड कार्ड)</option>
                  <option value="profile_sidebar">📌 Profile Page Sidebar (बायोडाटा साइडबार)</option>
                </select>
                <p className="text-[10px] text-[#78716c] mt-1">
                  {adPlacement === "portrait_flyer" && "⭐ Best for vertical posters, leaflets & flyers (recommended: 3:4, 4:5 or 9:16). Never cropped and includes full-screen zoom preview."}
                  {adPlacement === "top_banner" && "Wide responsive banner below header (recommended: 1200x200 or 728x90)."}
                  {adPlacement === "home_featured" && "Showcase editorial banner in the middle of home page (recommended: 1200x400)."}
                  {adPlacement === "directory_infeed" && "Appears naturally inside profile grid cards (recommended: 800x800 or 4:3)."}
                  {adPlacement === "profile_sidebar" && "Appears underneath QR share card on candidate profile page (recommended: 300x400)."}
                </p>

                {/* Helpful image size guide */}
                <div className="mt-2.5 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-lg text-[10px] text-[#78350f] space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[#92400e]">
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                    <span>इमेज साइज़ सुझाव (Image Size Guide):</span>
                  </div>
                  <p>• <strong>खड़े / वर्टिकल पोस्टर (Portrait 3:4, 9:16):</strong> &ldquo;Portrait Poster / Flyer&rdquo; या &ldquo;Profile Sidebar&rdquo; चुनें। पोस्टर पूरा दिखाई देगा और दर्शक ज़ूम करके बारीक जानकारी भी पढ़ सकेंगे।</p>
                  <p>• <strong>आड़े / चौड़े बैनर (Horizontal 16:9):</strong> &ldquo;Top Header Banner&rdquo; या &ldquo;Homepage Middle Feature&rdquo; चुनें।</p>
                  <p>• <strong>चौकोर (Square 1:1):</strong> &ldquo;Directory In-Feed Card&rdquo; चुनें।</p>
                </div>
              </div>

              {/* Ad Image: Upload File OR Input URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  Advertisement Image <span className="text-[#c2410c]">*</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    name="photo"
                    ref={adFileRef}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setAdPreviewUrl(URL.createObjectURL(f));
                    }}
                    className="w-full text-xs text-[#78716c] file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#faf8f5] file:text-[#c2410c] hover:file:bg-[#e7e5e4] cursor-pointer"
                  />

                  <div className="flex items-center gap-2 text-[10px] text-[#a8a29e]">
                    <span>OR paste Image Web URL directly:</span>
                  </div>

                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="https://images.unsplash.com/... or hosted image URL"
                    onChange={(e) => {
                      if (e.target.value.trim().startsWith("http")) {
                        setAdPreviewUrl(e.target.value.trim());
                      }
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono"
                  />
                </div>

                {/* Live Preview */}
                {adPreviewUrl && (
                  <div className="mt-2.5 p-2 rounded-lg border border-[#e7e5e4] bg-[#faf8f5]">
                    <span className="text-[10px] font-mono-tag text-[#78716c] block mb-1">Live Image Preview:</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={adPreviewUrl}
                      alt="Ad Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Target Link URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  Click Redirect URL (Website / WhatsApp / Phone)
                </label>
                <input
                  type="text"
                  name="linkUrl"
                  placeholder="e.g. https://wa.me/919424073243 or https://paliwaljewellers.com"
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  Display Priority / Order (0 = First)
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={0}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#d6d3d1] text-xs font-semibold text-[#44403c] hover:bg-[#faf8f5] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Ad...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Publish Advertisement</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Inspection Modal for Candidate Profiles */}
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
