"use client";

import { useState, useTransition } from "react";
import { updateProfileStatus, adminLogout } from "@/lib/actions";
import { toast } from "sonner";
import { formatIndianPhone } from "@/lib/utils";
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
} from "lucide-react";

interface AdminDashboardClientProps {
  initialProfiles: Profile[];
}

export function AdminDashboardClient({ initialProfiles }: AdminDashboardClientProps) {
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e7e5e4] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#faf8f5] text-[#c2410c] border border-[#e7e5e4] text-xs font-semibold font-mono-tag mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> ADMINISTRATIVE PORTAL
          </div>
          <h1 className="font-serif-heading text-2xl font-black text-[#1c1917] tracking-tight">
            बायोडाटा सत्यापन नियंत्रण कक्ष
          </h1>
          <p className="text-xs text-[#78716c] mt-1">
            Review submissions, inspect candidate photos &amp; family origin, and approve profiles to the public directory.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#d6d3d1] text-[#44403c] hover:bg-[#faf8f5] text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5 text-[#78716c]" /> Sign Out
        </button>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab Buttons */}
        <div className="inline-flex p-1 bg-[#f5f5f4] border border-[#e7e5e4] rounded-lg space-x-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "pending"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span>समीक्षाधीन (Pending)</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono-tag font-bold ${
                counts.pending > 0 ? "bg-amber-100 text-amber-900" : "bg-[#e7e5e4] text-[#78716c]"
              }`}
            >
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "approved"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span>प्रमाणित (Approved)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-tag font-bold bg-emerald-100 text-emerald-900">
              {counts.approved}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "rejected"
                ? "bg-white text-[#1c1917] shadow-xs"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span>अस्वीकृत (Rejected)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-tag font-bold bg-rose-100 text-rose-900">
              {counts.rejected}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-[#a8a29e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#e7e5e4] bg-white text-xs text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c]"
          />
        </div>
      </div>

      {/* Profile Table View */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] shadow-xs overflow-hidden">
        {currentList.length === 0 ? (
          <div className="p-12 text-center text-[#78716c]">
            <Clock className="w-6 h-6 text-[#a8a29e] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1c1917]">No {activeTab} submissions</p>
            <p className="text-xs text-[#a8a29e] mt-0.5">
              There are no applications matching this verification status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f5f5f4] bg-[#faf8f5] text-[10px] font-bold uppercase tracking-wider text-[#78716c] font-mono-tag">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Native Village &amp; Area</th>
                  <th className="py-3 px-4">Age / Phone</th>
                  <th className="py-3 px-4">Education / Work</th>
                  <th className="py-3 px-4 text-right">Actions</th>
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
                        <div>
                          <div className="font-bold text-[#1c1917]">{p.fullName}</div>
                          <span className="text-[10px] text-[#a8a29e] font-mono-tag">
                            {p.profileSlug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#1c1917] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#c2410c]" /> {p.gaon}
                        </div>
                        <div className="text-[#78716c] flex items-center gap-1 text-[11px]">
                          <Building2 className="w-3 h-3 text-[#a8a29e]" /> {p.area}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#1c1917]">{p.age} Yrs</div>
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
                          className="p-1.5 rounded border border-[#d6d3d1] hover:bg-[#faf8f5] text-[#57534e] transition"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {p.status !== "approved" && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(p.id, "approved")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-[11px] transition shadow-xs cursor-pointer"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                        )}

                        {p.status !== "rejected" && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(p.id, "rejected")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white font-semibold text-[11px] transition shadow-xs cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Inspection Modal */}
      {previewProfile && (
        <div className="fixed inset-0 z-50 bg-[#1c1917]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#e7e5e4] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewProfile(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#a8a29e] hover:text-[#1c1917] hover:bg-[#f5f5f4]"
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
              <h2 className="font-serif-heading text-lg font-bold text-[#1c1917]">
                {previewProfile.fullName}
              </h2>
              <span className="text-[11px] text-[#78716c] font-mono-tag">
                {previewProfile.profileSlug}
              </span>
            </div>

            <div className="space-y-2.5 text-xs bg-[#faf8f5] p-4 rounded-lg border border-[#e7e5e4] mb-5">
              <div className="flex justify-between py-1 border-b border-[#e7e5e4]">
                <span className="text-[#78716c]">मूल गाँव (Gaon):</span>
                <span className="font-semibold text-[#1c1917]">{previewProfile.gaon}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4]">
                <span className="text-[#78716c]">वर्तमान क्षेत्र (Area):</span>
                <span className="font-semibold text-[#1c1917]">{previewProfile.area}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4]">
                <span className="text-[#78716c]">आयु (Age):</span>
                <span className="font-semibold text-[#1c1917]">{previewProfile.age} yrs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4]">
                <span className="text-[#78716c]">मोबाइल (Phone):</span>
                <span className="font-semibold font-mono-tag text-[#1c1917]">
                  {formatIndianPhone(previewProfile.phoneNumber)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e7e5e4]">
                <span className="text-[#78716c]">शिक्षा (Education):</span>
                <span className="font-semibold text-[#1c1917]">
                  {previewProfile.education || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#78716c]">व्यवसाय (Occupation):</span>
                <span className="font-semibold text-[#1c1917]">
                  {previewProfile.occupation || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={isPending}
                onClick={() => handleStatusChange(previewProfile.id, "approved")}
                className="flex-1 py-2 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-xs transition cursor-pointer"
              >
                Approve Biodata
              </button>
              <button
                disabled={isPending}
                onClick={() => handleStatusChange(previewProfile.id, "rejected")}
                className="flex-1 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
