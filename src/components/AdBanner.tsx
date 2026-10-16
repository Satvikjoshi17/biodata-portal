"use client";

import { useState } from "react";
import { ExternalLink, Megaphone, Sparkles, Maximize2, X, PhoneCall } from "lucide-react";
import type { Advertisement, AdPlacement } from "@/lib/schema";

interface AdBannerProps {
  placement: AdPlacement;
  ads: Advertisement[];
  className?: string;
}

export function AdBanner({ placement, ads, className = "" }: AdBannerProps) {
  const [lightboxAd, setLightboxAd] = useState<Advertisement | null>(null);

  const matchingAds = ads.filter((a) => a.placement === placement && a.active === "true");

  if (matchingAds.length === 0) return null;

  // Display the first matching ad or prioritize by displayOrder
  const ad = matchingAds[0];

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ad.linkUrl) {
      window.open(ad.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isClickable = Boolean(ad.linkUrl);

  const renderLightbox = () => {
    if (!lightboxAd) return null;

    return (
      <div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        onClick={() => setLightboxAd(null)}
      >
        <div
          className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxAd(null)}
            className="absolute -top-11 right-0 sm:right-0 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Close Preview"
          >
            <span>बंद करें</span>
            <X className="w-4 h-4" />
          </button>

          {/* Full-view Poster Container */}
          <div className="relative w-full max-h-[78vh] flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-2 sm:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxAd.imageUrl}
              alt={lightboxAd.title}
              className="max-h-[74vh] max-w-full object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Bottom Bar Info & Actions */}
          <div className="w-full mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 text-white">
            <div className="min-w-0 text-center sm:text-left">
              <span className="text-[10px] text-amber-300 font-mono-tag uppercase tracking-wider block font-semibold">
                समुदाय विज्ञापन एवं पोस्टर • FULL POSTER PREVIEW
              </span>
              <h3 className="font-serif-heading text-sm sm:text-base font-bold truncate max-w-xl">
                {lightboxAd.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {lightboxAd.linkUrl && (
                <button
                  type="button"
                  onClick={() => window.open(lightboxAd.linkUrl!, "_blank", "noopener,noreferrer")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c2410c] hover:bg-[#ea580c] text-white text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>संपर्क करें / विजिट करें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setLightboxAd(null)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. Top Leaderboard Banner
  if (placement === "top_banner") {
    return (
      <>
        {renderLightbox()}
        <div className={`w-full max-w-7xl mx-auto ${className}`}>
          <div className="relative rounded-xl border border-[#e7e5e4] overflow-hidden bg-[#faf8f5] group transition shadow-xs">
            {/* Image with smart ambient backdrop so portrait or square images never look cropped awkwardly */}
            <div
              className="relative w-full h-20 sm:h-28 md:h-32 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => setLightboxAd(ad)}
            >
              {/* Blurred atmospheric background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
              />
              {/* Foreground image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="relative z-10 w-full h-full object-cover object-center group-hover:scale-[1.01] transition duration-300"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxAd(ad);
                }}
                className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-md transition text-[10px] flex items-center gap-1 cursor-pointer"
                title="पूरा पोस्टर देखें (View Full Poster)"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">पूरा देखें</span>
              </button>
            </div>

            {/* Badges & Title Bar */}
            <div className="absolute top-2 right-2 z-20 bg-black/75 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded font-mono-tag flex items-center gap-1 shadow-xs pointer-events-none">
              <Megaphone className="w-2.5 h-2.5 text-[#c2410c]" />
              <span>प्रायोजित • SPONSORED</span>
            </div>

            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 sm:p-3 text-white flex items-center justify-between gap-2">
              <span
                onClick={() => setLightboxAd(ad)}
                className="text-xs sm:text-sm font-semibold truncate drop-shadow-sm cursor-pointer hover:underline"
              >
                {ad.title}
              </span>
              {isClickable && (
                <button
                  type="button"
                  onClick={handleLinkClick}
                  className="hidden xs:inline-flex items-center gap-1 text-[11px] font-medium bg-[#c2410c] hover:bg-[#ea580c] px-2.5 py-1 rounded shadow-xs flex-shrink-0 cursor-pointer transition"
                >
                  <span>विजिट करें</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // 2. Homepage Featured Middle Banner
  if (placement === "home_featured") {
    return (
      <>
        {renderLightbox()}
        <div className={`w-full ${className}`}>
          <div className="rounded-2xl border border-[#e7e5e4] overflow-hidden bg-white shadow-xs group transition hover:border-[#c2410c]/50 hover:shadow-md">
            <div
              className="relative h-44 sm:h-56 md:h-64 w-full bg-[#faf8f5] overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => setLightboxAd(ad)}
            >
              {/* Atmospheric blur backdrop for arbitrary image aspect ratios */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover blur-lg opacity-30 scale-110 pointer-events-none"
              />
              {/* Foreground image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="relative z-10 w-full h-full object-cover group-hover:scale-[1.01] transition duration-500"
              />
              <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs text-[#c2410c] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#e7e5e4] shadow-xs flex items-center gap-1 font-mono-tag">
                <Sparkles className="w-3 h-3 text-[#c2410c]" />
                <span>COMMUNITY PARTNER • समाज सहयोगी</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxAd(ad);
                }}
                className="absolute bottom-3 right-3 z-20 bg-black/70 hover:bg-black/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>पूरा पोस्टर देखें (View Full)</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
              <div className="min-w-0">
                <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#78716c] block">
                  Featured Sponsor
                </span>
                <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#1c1917] truncate break-words">
                  {ad.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setLightboxAd(ad)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg border border-[#e7e5e4] hover:bg-[#faf8f5] text-[#1c1917] text-xs font-semibold transition cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#78716c]" />
                  <span>पोस्टर देखें</span>
                </button>
                {isClickable && (
                  <button
                    type="button"
                    onClick={handleLinkClick}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c1917] hover:bg-[#c2410c] text-white text-xs font-semibold transition flex-shrink-0 cursor-pointer shadow-xs"
                  >
                    <span>संपर्क / विवरण</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 3. Portrait Flyer / Poster (Dedicated Vertical Placement: 3:4, 4:5, 9:16)
  if (placement === "portrait_flyer") {
    return (
      <>
        {renderLightbox()}
        <div className={`w-full max-w-md mx-auto ${className}`}>
          <div className="bg-white rounded-2xl border-2 border-[#c2410c]/30 hover:border-[#c2410c] shadow-sm hover:shadow-md transition overflow-hidden group flex flex-col">
            {/* Header Badge */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-[#faf8f5] via-amber-50 to-[#faf8f5] border-b border-[#e7e5e4] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#c2410c] font-mono-tag flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-[#c2410c]" />
                <span>सामुदायिक पोस्टर • COMMUNITY FLYER</span>
              </span>
              <span className="text-[9px] bg-white px-2 py-0.5 rounded-full text-[#78716c] border border-[#e7e5e4] font-mono-tag">
                वर्टिकल लेआउट
              </span>
            </div>

            {/* Poster Canvas with smart contain & blurred ambient backdrop */}
            <div
              className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-[#f5f5f4] overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => setLightboxAd(ad)}
            >
              {/* Blurred background ensures no harsh letterboxing */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-105 pointer-events-none"
              />

              {/* Uncropped Portrait Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-[1.02] transition duration-300 shadow-sm"
              />

              {/* Click to Zoom Overlay hint */}
              <div className="absolute inset-0 z-20 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                <span className="bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>क्लिक करके पूरा पोस्टर देखें</span>
                </span>
              </div>
            </div>

            {/* Poster Details and Actions */}
            <div className="p-4 bg-white flex flex-col justify-between flex-1 space-y-3">
              <div>
                <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#78716c] block">
                  Patron / Sponsor Notice
                </span>
                <h3 className="font-serif-heading text-sm sm:text-base font-bold text-[#1c1917] line-clamp-2 mt-0.5">
                  {ad.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setLightboxAd(ad)}
                  className="w-full min-h-[38px] px-2 py-1.5 rounded-lg border border-[#e7e5e4] hover:bg-[#faf8f5] text-[#1c1917] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#78716c]" />
                  <span>पूरा देखें</span>
                </button>

                {isClickable ? (
                  <button
                    type="button"
                    onClick={handleLinkClick}
                    className="w-full min-h-[38px] px-2 py-1.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span>संपर्क करें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLightboxAd(ad)}
                    className="w-full min-h-[38px] px-2 py-1.5 rounded-lg bg-[#1c1917] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <span>ज़ूम करें</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 4. Profile Sidebar Banner
  if (placement === "profile_sidebar") {
    return (
      <>
        {renderLightbox()}
        <div className={`bg-white rounded-xl border border-[#e7e5e4] p-4.5 shadow-xs ${className}`}>
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#f5f5f4] gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716c] font-mono-tag flex items-center gap-1">
              <Megaphone className="w-3 h-3 text-[#c2410c]" />
              <span>COMMUNITY SPONSOR</span>
            </span>
            <span className="text-[9px] bg-[#faf8f5] px-1.5 py-0.5 rounded text-[#78716c] border border-[#e7e5e4] font-mono-tag">
              विज्ञापन
            </span>
          </div>

          <div className="group">
            <div
              className="relative h-48 sm:h-56 w-full rounded-lg overflow-hidden border border-[#e7e5e4] bg-[#faf8f5] mb-3 flex items-center justify-center cursor-pointer"
              onClick={() => setLightboxAd(ad)}
            >
              {/* Blurred background so portrait posters never crop fine text */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-105 pointer-events-none"
              />
              {/* Foreground Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-[1.02] transition duration-300"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxAd(ad);
                }}
                className="absolute bottom-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>पूरा देखें</span>
              </button>
            </div>

            <h4
              onClick={() => setLightboxAd(ad)}
              className="font-serif-heading text-sm font-bold text-[#1c1917] leading-snug break-words group-hover:text-[#c2410c] transition mb-3 cursor-pointer"
            >
              {ad.title}
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLightboxAd(ad)}
                className="w-full min-h-[38px] px-2 py-1.5 rounded-lg border border-[#e7e5e4] hover:bg-[#faf8f5] text-[#1c1917] text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Maximize2 className="w-3 h-3 text-[#78716c]" />
                <span>ज़ूम करें</span>
              </button>

              {isClickable && (
                <button
                  type="button"
                  onClick={handleLinkClick}
                  className="w-full min-h-[38px] px-2 py-1.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <span>विजिट करें</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // 5. Directory In-Feed Card (Rendered inside DirectoryClient grid)
  if (placement === "directory_infeed") {
    return (
      <>
        {renderLightbox()}
        <div
          className={`bg-white rounded-xl border-2 border-dashed border-[#c2410c]/30 hover:border-[#c2410c] card-hover flex flex-col overflow-hidden group ${className}`}
        >
          <div
            className="relative h-64 sm:h-60 bg-[#faf8f5] overflow-hidden border-b border-[#e7e5e4] flex items-center justify-center cursor-pointer"
            onClick={() => setLightboxAd(ad)}
          >
            {/* Blurred background ensures portrait flyers look complete and natural */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ad.imageUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-105 pointer-events-none"
            />
            {/* Foreground image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-[1.02] transition duration-300"
            />
            <div className="absolute top-3 left-3 z-20 bg-[#c2410c] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 font-mono-tag">
              <Megaphone className="w-3 h-3 text-white" />
              <span>SPONSORED • विज्ञापन</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxAd(ad);
              }}
              className="absolute bottom-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>पूरा देखें</span>
            </button>
          </div>

          <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#c2410c] font-semibold">
                Samaj Business Partner
              </span>
              <h3
                onClick={() => setLightboxAd(ad)}
                className="font-serif-heading text-base font-bold text-[#1c1917] mt-1 group-hover:text-[#c2410c] transition line-clamp-2 cursor-pointer"
              >
                {ad.title}
              </h3>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLightboxAd(ad)}
                className="w-full min-h-[38px] inline-flex items-center justify-center gap-1.5 px-2 rounded-lg border border-[#e7e5e4] hover:bg-[#faf8f5] text-[#1c1917] text-xs font-semibold transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#78716c]" />
                <span>पोस्टर देखें</span>
              </button>

              {isClickable ? (
                <button
                  type="button"
                  onClick={handleLinkClick}
                  className="w-full min-h-[38px] inline-flex items-center justify-center gap-1.5 px-2 rounded-lg bg-[#1c1917] group-hover:bg-[#c2410c] text-white text-xs font-semibold transition shadow-xs cursor-pointer"
                >
                  <span>विजिट करें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLightboxAd(ad)}
                  className="w-full min-h-[38px] inline-flex items-center justify-center gap-1.5 px-2 rounded-lg bg-[#c2410c] text-white text-xs font-semibold transition shadow-xs cursor-pointer"
                >
                  <span>ज़ूम करें</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
