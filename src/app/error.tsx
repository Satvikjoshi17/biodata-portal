"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portal error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 shadow-xs text-center max-w-md w-full">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <AlertOctagon className="w-7 h-7" />
        </div>
        <h1 className="font-serif-heading text-xl font-bold text-[#1c1917] mb-2">Something Went Wrong</h1>
        <p className="text-xs text-[#78716c] mb-6 leading-relaxed">
          An error occurred while fetching or processing biodata. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c2410c] text-white text-xs font-semibold hover:bg-[#9a3412] transition cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#d6d3d1] text-[#44403c] text-xs font-semibold hover:bg-[#faf8f5] transition"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
