"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Copy, Download, Share2, Printer } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ShareProfileActionsProps {
  slug: string;
  fullName: string;
}

export function ShareProfileActions({ slug, fullName }: ShareProfileActionsProps) {
  const { t } = useLanguage();
  const qrRef = useRef<HTMLDivElement>(null);

  const getProfileUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/profile/${slug}`;
    }
    return `https://samajbiodata.org/profile/${slug}`;
  };

  const handleCopyLink = async () => {
    const url = getProfileUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleDownloadQr = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Samaj-Biodata-${slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("QR Code downloaded as PNG!");
  };

  const handleWhatsAppShare = () => {
    const url = getProfileUrl();
    const text = encodeURIComponent(
      `Check out verified Samaj Biodata for ${fullName}:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 shadow-xs flex flex-col items-center text-center">
      <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-[#f5f5f4]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716c] font-mono-tag">
          {t.profile.qrTitle}
        </span>
        <span className="text-[10px] bg-[#faf8f5] px-2 py-0.5 rounded text-[#57534e] border border-[#e7e5e4] font-mono-tag">
          {t.profile.directLink}
        </span>
      </div>

      {/* QR Canvas Container with Clean Paper Frame */}
      <div
        ref={qrRef}
        className="p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4] mb-3 inline-block"
      >
        <QRCodeCanvas
          value={getProfileUrl()}
          size={164}
          level="H"
          includeMargin={false}
        />
      </div>

      <p className="text-xs text-[#78716c] mb-6 leading-relaxed max-w-xs">
        {t.profile.qrSubtitle}
      </p>

      {/* Action Buttons */}
      <div className="w-full space-y-2">
        <button
          onClick={handleWhatsAppShare}
          className="w-full h-10 px-4 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" /> {t.profile.shareWhatsApp}
        </button>

        <button
          onClick={handleDownloadQr}
          className="w-full h-10 px-4 rounded-lg bg-[#1c1917] hover:bg-[#292524] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> {t.profile.downloadQr}
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full h-10 px-4 rounded-lg border border-[#d6d3d1] hover:bg-[#faf8f5] text-[#1c1917] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5 text-[#78716c]" /> {t.profile.copyLink}
        </button>

        <button
          onClick={handlePrint}
          className="w-full h-9 px-4 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4] text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" /> {t.profile.printBiodata}
        </button>
      </div>
    </div>
  );
}
