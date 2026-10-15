import Link from "next/link";
import { AlertTriangle, Home, UserPlus } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-xs text-center max-w-md w-full">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">
          The requested biodata record does not exist or may have been removed or rejected during verification.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
          >
            <Home className="w-4 h-4" /> Go to Directory
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            <UserPlus className="w-4 h-4" /> Register Biodata
          </Link>
        </div>
      </div>
    </div>
  );
}
