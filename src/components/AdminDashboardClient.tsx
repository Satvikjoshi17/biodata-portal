"use client";

import { useState, useTransition, useRef } from "react";
import {
  updateProfileStatus,
  adminLogout,
  createAdvertisement,
  updateAdvertisement,
  toggleAdvertisementStatus,
  deleteAdvertisement,
  getAllAdsForAdmin,
  updateProfileDetails,
  getAllProfilesForAdmin,
} from "@/lib/actions";
import { toast } from "sonner";
import { formatIndianPhone, formatDateTime, formatExternalUrl } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import type { Profile, Advertisement, AdPlacement } from "@/lib/schema";
import {
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  Calendar,
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
  User,
  GraduationCap,
  Briefcase,
  Phone,
  Home,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialProfiles: Profile[];
  initialAds?: Advertisement[];
}

export function AdminDashboardClient({
  initialProfiles,
  initialAds = [],
}: AdminDashboardClientProps) {
  const { t, language } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [ads, setAds] = useState<Advertisement[]>(initialAds);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "ads">("pending");
  const [previewProfile, setPreviewProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Ad modal states
  const [isAddAdModalOpen, setIsAddAdModalOpen] = useState(false);
  const [adPreviewUrl, setAdPreviewUrl] = useState<string | null>(null);
  const [adPlacement, setAdPlacement] = useState<AdPlacement>("portrait_flyer");
  const adFileRef = useRef<HTMLInputElement>(null);

  // Edit Ad photo state
  const [editAdPreviewUrl, setEditAdPreviewUrl] = useState<string | null>(null);
  const editAdFileRef = useRef<HTMLInputElement>(null);

  // Edit Profile photo state
  const [editProfilePhotoPreview, setEditProfilePhotoPreview] = useState<string | null>(null);
  const editProfileFileRef = useRef<HTMLInputElement>(null);

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

  const handleEditAdSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await updateAdvertisement(formData);
        if (res.success) {
          toast.success("Advertisement updated successfully!");
          setEditingAd(null);
          setEditAdPreviewUrl(null);
          const updated = await getAllAdsForAdmin();
          if (updated) setAds(updated);
        } else {
          toast.error(res.error || "Failed to update ad.");
        }
      } catch {
        toast.error("Network error while updating ad.");
      }
    });
  };

  const handleEditProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await updateProfileDetails(formData);
        if (res.success) {
          toast.success("Profile updated successfully!");
          setEditingProfile(null);
          setEditProfilePhotoPreview(null);
          const updated = await getAllProfilesForAdmin();
          if (updated) setProfiles(updated);
        } else {
          toast.error(res.error || "Failed to update profile.");
        }
      } catch {
        toast.error("Network error while updating profile.");
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
      case "portrait_flyer":
        return { label: t.admin.optionPortrait, color: "bg-rose-100 text-rose-900 border-rose-200" };
      case "top_banner":
        return { label: t.admin.optionTopBanner, color: "bg-blue-100 text-blue-900 border-blue-200" };
      case "home_featured":
        return { label: t.admin.optionHomeFeatured, color: "bg-purple-100 text-purple-900 border-purple-200" };
      case "directory_infeed":
        return { label: t.admin.optionDirectoryInfeed, color: "bg-amber-100 text-amber-900 border-amber-200" };
      case "profile_sidebar":
        return { label: t.admin.optionProfileSidebar, color: "bg-emerald-100 text-emerald-900 border-emerald-200" };
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
            <span>{t.admin.pendingTab}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "pending" ? "bg-amber-100 text-amber-800" : "bg-[#e7e5e4] text-[#57534e]"
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
            <span>{t.admin.approvedTab}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-[#e7e5e4] text-[#57534e]"
              }`}
            >
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
            <span>{t.admin.rejectedTab}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "rejected" ? "bg-rose-100 text-rose-800" : "bg-[#e7e5e4] text-[#57534e]"
              }`}
            >
              {counts.rejected}
            </span>
          </button>

          {/* Advertisements Management Tab */}
          <button
            onClick={() => setActiveTab("ads")}
            className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "ads"
                ? "bg-[#c2410c] text-white shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>{t.admin.adsTab}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "ads" ? "bg-white/20 text-white" : "bg-[#e7e5e4] text-[#57534e]"
              }`}
            >
              {counts.activeAds}/{counts.ads}
            </span>
          </button>
        </div>

        {/* Search Input and Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#a8a29e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === "ads" ? (language === "hi" ? "विज्ञापन शीर्षक / लेआउट खोजें..." : "Search ads by title / layout...") : t.admin.searchRecords}
              className="w-full h-9 pl-8.5 pr-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-white placeholder-[#a8a29e]"
            />
          </div>

          {activeTab === "ads" && (
            <button
              onClick={() => {
                setAdPreviewUrl(null);
                setIsAddAdModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold transition cursor-pointer shadow-xs flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.admin.createAdBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Advertisements Management View */}
      {activeTab === "ads" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-amber-50 to-[#faf8f5] p-3.5 sm:p-4 rounded-xl border border-amber-200/70">
            <div>
              <h3 className="font-serif-heading text-sm sm:text-base font-bold text-[#1c1917] flex items-center gap-2">
                <span>📢 {t.admin.adEngineTitle}</span>
                <span className="text-[10px] font-mono-tag bg-[#c2410c] text-white px-2 py-0.5 rounded-full">
                  {t.admin.adActive}: {counts.activeAds} / {language === "hi" ? "कुल" : "Total"}: {counts.ads}
                </span>
              </h3>
              <p className="text-xs text-[#78716c] mt-0.5">
                {t.admin.adEngineSubtitle}
              </p>
            </div>

            <button
              onClick={() => {
                setAdPreviewUrl(null);
                setIsAddAdModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c1917] hover:bg-[#c2410c] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.admin.createAdBtn}</span>
            </button>
          </div>

          {filteredAds.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e7e5e4] p-12 text-center text-[#78716c]">
              <Megaphone className="w-8 h-8 text-[#a8a29e] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1c1917]">
                {language === "hi" ? "कोई विज्ञापन नहीं मिला" : "No Advertisements Found"}
              </p>
              <p className="text-xs text-[#a8a29e] mt-0.5">
                {language === "hi"
                  ? `किसी भी स्थान के लिए विज्ञापन जोड़ने हेतु "${t.admin.createAdBtn}" पर क्लिक करें।`
                  : `Click "${t.admin.createAdBtn}" to configure advertisements for any placement.`}
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
                      <div className="relative h-48 bg-[#faf8f5] overflow-hidden border-b border-[#e7e5e4] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ad.imageUrl}
                          alt=""
                          aria-hidden
                          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="relative z-10 max-h-full max-w-full object-contain"
                        />

                        <div className="absolute top-2.5 left-2.5 z-20">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color} font-mono-tag shadow-xs`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 z-20">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-tag shadow-xs ${
                              isActive ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-200"
                            }`}
                          >
                            {isActive ? t.admin.adActive : t.admin.adInactive}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-serif-heading text-sm font-bold text-[#1c1917] line-clamp-2">
                          {ad.title}
                        </h4>

                        <div className="text-[11px] text-[#78716c] font-mono-tag flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#c2410c]" />
                          <span>{t.admin.colAddedAt}: {formatDateTime(ad.createdAt)}</span>
                        </div>

                        {ad.linkUrl ? (
                          <a
                            href={formatExternalUrl(ad.linkUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#c2410c] hover:underline truncate max-w-full font-mono"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{ad.linkUrl}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-[#a8a29e] italic block">{t.admin.noTargetLink}</span>
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
                            <ToggleLeft className="w-4 h-4" /> {t.admin.deactivateBtn}
                          </>
                        ) : (
                          <>
                            <ToggleRight className="w-4 h-4" /> {t.admin.activateBtn}
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            setEditingAd(ad);
                            setEditAdPreviewUrl(null);
                          }}
                          className="p-1.5 rounded-lg text-[#c2410c] hover:bg-amber-50 border border-transparent hover:border-amber-200 transition cursor-pointer disabled:opacity-50"
                          title={t.admin.editBtn}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          disabled={isPending}
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer disabled:opacity-50"
                          title={t.admin.deleteBtn}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

                    <div className="text-xs text-[#78716c] bg-[#faf8f5] p-2.5 rounded-lg border border-[#e7e5e4] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#a8a29e]">{t.profile.area}:</span>
                        <span className="font-medium text-[#1c1917] truncate">{p.area}</span>
                      </div>
                      {p.occupation && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#a8a29e]">{t.directory.work}:</span>
                          <span className="font-medium text-[#1c1917] truncate">{p.occupation}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[#a8a29e]">{t.profile.primaryPhone}:</span>
                        <span className="font-mono-tag font-semibold text-[#1c1917]">{formatIndianPhone(p.phoneNumber)}</span>
                      </div>

                      {/* Timeline and status section */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-[#e7e5e4] text-[11px]">
                        <span className="text-[#78716c] flex items-center gap-1 font-mono-tag">
                          <Calendar className="w-3 h-3 text-[#c2410c]" />
                          <span>{formatDateTime(p.createdAt)}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-tag ${
                            p.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : p.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status === "approved"
                            ? (language === "hi" ? "स्वीकृत" : "Approved")
                            : p.status === "rejected"
                            ? (language === "hi" ? "अस्वीकृत" : "Rejected")
                            : (language === "hi" ? "समीक्षाधीन" : "Pending")}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Actions Toolbar */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setPreviewProfile(p)}
                        className="flex-1 py-2 px-2.5 rounded-lg border border-[#d6d3d1] hover:bg-[#faf8f5] text-[#44403c] text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                        title={t.admin.inspectBtn}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.admin.inspectBtn}</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingProfile(p);
                          setEditProfilePhotoPreview(null);
                        }}
                        className="py-2 px-3 rounded-lg border border-[#c2410c]/30 hover:border-[#c2410c] text-[#c2410c] bg-amber-50/50 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                        title={t.admin.editBtn}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>{t.admin.editBtn}</span>
                      </button>

                      {p.status !== "approved" && (
                        <button
                          disabled={isPending}
                          onClick={() => handleStatusChange(p.id, "approved")}
                          className="flex-1 py-2 px-2.5 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t.admin.approveBtn}</span>
                        </button>
                      )}

                      {p.status !== "rejected" && (
                        <button
                          disabled={isPending}
                          onClick={() => handleStatusChange(p.id, "rejected")}
                          className="py-2 px-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
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
                      <th className="py-3 px-4">{t.admin.colAddedAt}</th>
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

                        {/* Timeline & Status Section */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="text-[11px] font-mono-tag font-medium text-[#1c1917] flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#c2410c] flex-shrink-0" />
                              <span>{formatDateTime(p.createdAt)}</span>
                            </div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono-tag ${
                                p.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : p.status === "rejected"
                                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {p.status === "approved"
                                ? (language === "hi" ? "स्वीकृत • APPROVED" : "APPROVED")
                                : p.status === "rejected"
                                ? (language === "hi" ? "अस्वीकृत • REJECTED" : "REJECTED")
                                : (language === "hi" ? "प्रतीक्षारत • PENDING" : "PENDING")}
                            </span>
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

                            <button
                              onClick={() => {
                                setEditingProfile(p);
                                setEditProfilePhotoPreview(null);
                              }}
                              className="p-1.5 rounded border border-[#c2410c]/30 hover:border-[#c2410c] text-[#c2410c] bg-amber-50/50 transition cursor-pointer"
                              title={t.admin.editBtn}
                            >
                              <Pencil className="w-3.5 h-3.5" />
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
                {t.admin.createAdBtn}
              </h2>
              <p className="text-xs text-[#78716c] mt-0.5">
                {t.admin.createAdSubtitle}
              </p>
            </div>

            <form onSubmit={handleCreateAd} className="space-y-4">
              {/* Sponsor Title */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.adTitleLabel} <span className="text-[#c2410c]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder={language === "hi" ? "उदा. श्री पालीवाल ज्वेलर्स - शादी कलेक्शन" : "e.g. Shree Paliwal Jewellers - Wedding Collection"}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
                />
              </div>

              {/* Placement Layout Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.placementLabel} <span className="text-[#c2410c]">*</span>
                </label>
                <select
                  name="placement"
                  value={adPlacement}
                  onChange={(e) => setAdPlacement(e.target.value as AdPlacement)}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 cursor-pointer"
                >
                  <option value="portrait_flyer">{t.admin.optionPortrait}</option>
                  <option value="top_banner">{t.admin.optionTopBanner}</option>
                  <option value="home_featured">{t.admin.optionHomeFeatured}</option>
                  <option value="directory_infeed">{t.admin.optionDirectoryInfeed}</option>
                  <option value="profile_sidebar">{t.admin.optionProfileSidebar}</option>
                </select>
                <p className="text-[10px] text-[#78716c] mt-1">
                  {adPlacement === "portrait_flyer" && (language === "hi" ? "⭐ खड़े पोस्टर, पैम्फलेट व पत्रिकाओं हेतु सर्वोत्तम (अनुशंसित 3:4 या 9:16)। यह बिना कटे पूरा दिखेगा व ज़ूम प्रिव्यू उपलब्ध होगा।" : "⭐ Best for vertical posters, leaflets & flyers (recommended: 3:4, 4:5 or 9:16). Never cropped and includes full-screen zoom preview.")}
                  {adPlacement === "top_banner" && (language === "hi" ? "हेडर के नीचे मुख्य चौड़ा बैनर (अनुशंसित: 1200x200 या 728x90)।" : "Wide responsive banner below header (recommended: 1200x200 or 728x90).")}
                  {adPlacement === "home_featured" && (language === "hi" ? "मुखपृष्ठ के मध्य में विशेष प्रायोजक बैनर (अनुशंसित: 1200x400)।" : "Showcase editorial banner in the middle of home page (recommended: 1200x400).")}
                  {adPlacement === "directory_infeed" && (language === "hi" ? "बायोडाटा डायरेक्टरी कार्ड्स के बीच स्वाभाविक रूप से प्रदर्शित (अनुशंसित: 800x800 या 4:3)।" : "Appears naturally inside profile grid cards (recommended: 800x800 or 4:3).")}
                  {adPlacement === "profile_sidebar" && (language === "hi" ? "बायोडाटा पृष्ठ पर क्यूआर कार्ड के नीचे साइडबार में (अनुशंसित: 300x400)।" : "Appears underneath QR share card on candidate profile page (recommended: 300x400).")}
                </p>

                {/* Helpful image size guide */}
                <div className="mt-2.5 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-lg text-[10px] text-[#78350f] space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[#92400e]">
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                    <span>{t.admin.imageSizeGuideTitle}</span>
                  </div>
                  <p>{t.admin.guidePortrait}</p>
                  <p>{t.admin.guideHorizontal}</p>
                  <p>{t.admin.guideSquare}</p>
                </div>
              </div>

              {/* Ad Image: Upload File OR Input URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.adImageLabel} <span className="text-[#c2410c]">*</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    name="photo"
                    ref={adFileRef}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setAdPreviewUrl(url);
                      }
                    }}
                    className="w-full text-xs text-[#57534e] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#faf8f5] file:text-[#c2410c] hover:file:bg-[#f5f5f4] cursor-pointer"
                  />
                  <div className="text-[11px] text-[#78716c] font-medium flex items-center gap-1">
                    <span>{t.admin.orEnterUrl}:</span>
                  </div>
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="https://images.unsplash.com/photo-..."
                    onChange={(e) => {
                      if (e.target.value.startsWith("http")) {
                        setAdPreviewUrl(e.target.value);
                      }
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
                  />
                </div>

                {/* Preview Box */}
                {adPreviewUrl && (
                  <div className="mt-3 p-2 border border-[#e7e5e4] rounded-lg bg-[#faf8f5]">
                    <span className="text-[10px] text-[#78716c] font-mono-tag block mb-1">
                      {language === "hi" ? "इमेज लाइव प्रिव्यू:" : "Live Image Preview:"}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={adPreviewUrl}
                      alt="Preview"
                      className="max-h-36 w-full object-contain rounded border border-[#e7e5e4] bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Target Link URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.redirectUrlLabel}
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
                  {t.admin.displayOrderLabel}
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
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.admin.saving}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.admin.publishAd}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Advertisement Modal */}
      {editingAd && (
        <div className="fixed inset-0 z-50 bg-[#1c1917]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-[#e7e5e4] relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setEditingAd(null);
                setEditAdPreviewUrl(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a8a29e] hover:text-[#1c1917] hover:bg-[#f5f5f4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#faf8f5] text-[#c2410c] border border-[#e7e5e4] text-xs font-semibold font-mono-tag mb-1.5">
                <Pencil className="w-3 h-3" /> EDIT ADVERTISEMENT
              </div>
              <h2 className="font-serif-heading text-xl font-bold text-[#1c1917]">
                {t.admin.editAdTitle}
              </h2>
              <p className="text-xs text-[#78716c] mt-0.5">
                {t.admin.editAdSubtitle}
              </p>
            </div>

            <form onSubmit={handleEditAdSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingAd.id} />

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.adTitleLabel} <span className="text-[#c2410c]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingAd.title}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
                />
              </div>

              {/* Placement */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.placementLabel} <span className="text-[#c2410c]">*</span>
                </label>
                <select
                  name="placement"
                  defaultValue={editingAd.placement}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 cursor-pointer"
                >
                  <option value="portrait_flyer">{t.admin.optionPortrait}</option>
                  <option value="top_banner">{t.admin.optionTopBanner}</option>
                  <option value="home_featured">{t.admin.optionHomeFeatured}</option>
                  <option value="directory_infeed">{t.admin.optionDirectoryInfeed}</option>
                  <option value="profile_sidebar">{t.admin.optionProfileSidebar}</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.statusLabel}
                </label>
                <select
                  name="active"
                  defaultValue={editingAd.active}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 cursor-pointer"
                >
                  <option value="true">✅ {t.admin.statusActiveDesc}</option>
                  <option value="false">❌ {t.admin.statusInactiveDesc}</option>
                </select>
              </div>

              {/* Current Image & Replacement */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.adImageLabel}
                </label>
                <div className="p-2.5 border border-[#e7e5e4] rounded-lg bg-[#faf8f5] mb-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editAdPreviewUrl || editingAd.imageUrl}
                    alt="Current Ad"
                    className="w-16 h-16 rounded object-contain border border-[#e7e5e4] bg-white flex-shrink-0"
                  />
                  <div className="min-w-0 text-xs">
                    <span className="font-semibold text-[#1c1917] block">
                      {editAdPreviewUrl ? t.admin.newImageSelected : t.admin.currentImageActive}
                    </span>
                    <span className="text-[10px] text-[#78716c] truncate block">
                      {editAdPreviewUrl || editingAd.imageUrl}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    name="photo"
                    ref={editAdFileRef}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setEditAdPreviewUrl(url);
                      }
                    }}
                    className="w-full text-xs text-[#57534e] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#faf8f5] file:text-[#c2410c] hover:file:bg-[#f5f5f4] cursor-pointer"
                  />
                  <input
                    type="text"
                    name="imageUrl"
                    defaultValue={editingAd.imageUrl}
                    placeholder="https://..."
                    onChange={(e) => {
                      if (e.target.value.startsWith("http")) {
                        setEditAdPreviewUrl(e.target.value);
                      }
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
                  />
                </div>
              </div>

              {/* Redirect Link */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.redirectUrlLabel}
                </label>
                <input
                  type="text"
                  name="linkUrl"
                  defaultValue={editingAd.linkUrl || ""}
                  placeholder="https://wa.me/..."
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                  {t.admin.displayOrderLabel}
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={editingAd.displayOrder}
                  className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAd(null);
                    setEditAdPreviewUrl(null);
                  }}
                  className="flex-1 py-2.5 rounded-lg border border-[#d6d3d1] text-xs font-semibold text-[#44403c] hover:bg-[#faf8f5] transition cursor-pointer"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.admin.saving}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.admin.saveChanges}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Candidate Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-[#1c1917]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-xl border border-[#e7e5e4] relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setEditingProfile(null);
                setEditProfilePhotoPreview(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a8a29e] hover:text-[#1c1917] hover:bg-[#f5f5f4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#faf8f5] text-[#c2410c] border border-[#e7e5e4] text-xs font-semibold font-mono-tag mb-1.5">
                <Pencil className="w-3 h-3" /> EDIT CANDIDATE PROFILE
              </div>
              <h2 className="font-serif-heading text-xl font-bold text-[#1c1917]">
                {t.admin.editProfileTitle}
              </h2>
              <p className="text-xs text-[#78716c] mt-0.5">
                {language === "hi"
                  ? "प्रत्याशी की व्यक्तिगत जानकारी, मूल वंश, शिक्षा, संपर्क व स्थिति को आवश्यकतानुसार संपादित करें।"
                  : "Edit candidate identity, lineage, education, contact details and verification status."}
              </p>
            </div>

            <form onSubmit={handleEditProfileSubmit} className="space-y-5">
              <input type="hidden" name="id" value={editingProfile.id} />

              {/* Status Selector */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#1c1917] block">
                    {language === "hi" ? "सत्यापन स्थिति (Verification Status)" : "Verification Status"}
                  </span>
                  <span className="text-[10px] text-[#78716c]">
                    {language === "hi"
                      ? "चयनित स्थिति के अनुसार निर्देशिका में लाइव दिखेगा"
                      : "Candidate will appear in public directory based on selected status"}
                  </span>
                </div>
                <select
                  name="status"
                  defaultValue={editingProfile.status}
                  className="h-9 px-3 rounded-lg border border-[#e7e5e4] font-semibold text-xs text-[#1c1917] bg-white cursor-pointer"
                >
                  <option value="pending">⏳ {language === "hi" ? "समीक्षाधीन (Pending)" : "Pending Verification"}</option>
                  <option value="approved">✅ {language === "hi" ? "स्वीकृत / प्रकाशित (Approved)" : "Approved & Published"}</option>
                  <option value="rejected">❌ {language === "hi" ? "अस्वीकृत (Rejected)" : "Rejected"}</option>
                </select>
              </div>

              {/* Section 1: Core Identity */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#c2410c] uppercase tracking-wider font-mono-tag border-b border-[#f5f5f4] pb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>1. व्यक्तिगत विवरण (Identity & Birth Details)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Full Name (पूरा नाम) <span className="text-[#c2410c]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      defaultValue={editingProfile.fullName}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Age (आयु) <span className="text-[#c2410c]">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      defaultValue={editingProfile.age}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Date of Birth (जन्म तिथि)
                    </label>
                    <input
                      type="text"
                      name="dob"
                      defaultValue={editingProfile.dob || ""}
                      placeholder="e.g. 19-11-2001"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Time of Birth (जन्म समय)
                    </label>
                    <input
                      type="text"
                      name="tob"
                      defaultValue={editingProfile.tob || ""}
                      placeholder="e.g. 5:59 PM"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Place of Birth (जन्म स्थान)
                    </label>
                    <input
                      type="text"
                      name="pob"
                      defaultValue={editingProfile.pob || ""}
                      placeholder="e.g. Indore"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Height (ऊंचाई)
                    </label>
                    <input
                      type="text"
                      name="height"
                      defaultValue={editingProfile.height || ""}
                      placeholder="e.g. 5'8&quot;"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Gotra (गोत्र)
                    </label>
                    <input
                      type="text"
                      name="gotra"
                      defaultValue={editingProfile.gotra || ""}
                      placeholder="e.g. Bhardwaj"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location & Address */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#c2410c] uppercase tracking-wider font-mono-tag border-b border-[#f5f5f4] pb-1 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  <span>2. मूल निवास एवं पता (Origin & Location)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Native Village (मूल गाँव) <span className="text-[#c2410c]">*</span>
                    </label>
                    <input
                      type="text"
                      name="gaon"
                      required
                      defaultValue={editingProfile.gaon}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Current Area / City (वर्तमान शहर) <span className="text-[#c2410c]">*</span>
                    </label>
                    <input
                      type="text"
                      name="area"
                      required
                      defaultValue={editingProfile.area}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Domicile State (राज्य / प्रान्त)
                    </label>
                    <input
                      type="text"
                      name="domicile"
                      defaultValue={editingProfile.domicile || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Resident Address (वर्तमान पता)
                    </label>
                    <textarea
                      name="residentAddress"
                      rows={2}
                      defaultValue={editingProfile.residentAddress || ""}
                      className="w-full p-2.5 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Education & Career */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#c2410c] uppercase tracking-wider font-mono-tag border-b border-[#f5f5f4] pb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>3. शिक्षा एवं व्यवसाय (Education & Career)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Education (उच्च शिक्षा / डिग्री)
                    </label>
                    <input
                      type="text"
                      name="education"
                      defaultValue={editingProfile.education || ""}
                      placeholder="e.g. BBA, MBA - Marketing"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Occupation (व्यवसाय / पद)
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      defaultValue={editingProfile.occupation || ""}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Family Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#c2410c] uppercase tracking-wider font-mono-tag border-b border-[#f5f5f4] pb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>4. पारिवारिक विवरण (Family Lineage)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Father&apos;s Name (पिता का नाम)
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      defaultValue={editingProfile.fatherName || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Father&apos;s Occupation (पिता का व्यवसाय)
                    </label>
                    <input
                      type="text"
                      name="fatherOccupation"
                      defaultValue={editingProfile.fatherOccupation || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Mother&apos;s Name (माता का नाम)
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      defaultValue={editingProfile.motherName || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Mother&apos;s Occupation (माता का व्यवसाय)
                    </label>
                    <input
                      type="text"
                      name="motherOccupation"
                      defaultValue={editingProfile.motherOccupation || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Grandfather&apos;s Name (दादाजी का नाम)
                    </label>
                    <input
                      type="text"
                      name="grandFather"
                      defaultValue={editingProfile.grandFather || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Grandmother&apos;s Name (दादीजी का नाम)
                    </label>
                    <input
                      type="text"
                      name="grandMother"
                      defaultValue={editingProfile.grandMother || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Siblings (भाई-बहन का विवरण)
                    </label>
                    <input
                      type="text"
                      name="siblings"
                      defaultValue={editingProfile.siblings || ""}
                      placeholder="e.g. 1 elder brother, 1 younger sister"
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Contacts */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#c2410c] uppercase tracking-wider font-mono-tag border-b border-[#f5f5f4] pb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>5. संपर्क विवरण (Contact Details)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Primary Phone (मुख्य फोन) <span className="text-[#c2410c]">*</span>
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      required
                      defaultValue={editingProfile.phoneNumber}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Father&apos;s Phone (पिता का फोन)
                    </label>
                    <input
                      type="text"
                      name="fatherContact"
                      defaultValue={editingProfile.fatherContact || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                      Mother&apos;s Phone (माता का फोन)
                    </label>
                    <input
                      type="text"
                      name="motherContact"
                      defaultValue={editingProfile.motherContact || ""}
                      className="w-full h-9 px-3 rounded-lg border border-[#e7e5e4] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Photo */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#c2410c] uppercase tracking-wider font-mono-tag border-b border-[#f5f5f4] pb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>6. प्रोफाइल तस्वीर (Profile Photograph)</span>
                </h3>

                <div className="p-3 border border-[#e7e5e4] rounded-lg bg-[#faf8f5] flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editProfilePhotoPreview || editingProfile.photoUrl}
                    alt="Current candidate"
                    className="w-20 h-24 rounded-lg object-cover border border-[#e7e5e4] bg-white shadow-xs flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      name="photo"
                      ref={editProfileFileRef}
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setEditProfilePhotoPreview(url);
                        }
                      }}
                      className="w-full text-xs text-[#57534e] file:mr-2 file:py-1.5 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#c2410c] cursor-pointer"
                    />
                    <input
                      type="text"
                      name="photoUrl"
                      defaultValue={editingProfile.photoUrl}
                      placeholder="Or enter image URL"
                      onChange={(e) => {
                        if (e.target.value.startsWith("http")) {
                          setEditProfilePhotoPreview(e.target.value);
                        }
                      }}
                      className="w-full h-8 px-2.5 rounded border border-[#e7e5e4] text-xs text-[#1c1917] bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex gap-2 border-t border-[#f5f5f4]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setEditProfilePhotoPreview(null);
                  }}
                  className="flex-1 py-2.5 rounded-lg border border-[#d6d3d1] text-xs font-semibold text-[#44403c] hover:bg-[#faf8f5] transition cursor-pointer"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.admin.saving}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.admin.saveChanges}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Quick Inspection Modal for Candidate Profiles */}
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
                <span className="text-[#78716c] flex-shrink-0">{t.admin.colAddedAt}:</span>
                <span className="font-semibold font-mono-tag text-[#1c1917] text-right">
                  {formatDateTime(previewProfile.createdAt)}
                </span>
              </div>
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
                type="button"
                onClick={() => {
                  setEditingProfile(previewProfile);
                  setPreviewProfile(null);
                }}
                className="flex-1 min-h-[40px] py-2 rounded-lg border border-[#c2410c] text-[#c2410c] hover:bg-amber-50 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{t.admin.editBtn}</span>
              </button>

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
