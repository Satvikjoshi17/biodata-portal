import { getDirectoryProfiles } from "@/lib/actions";
import { DirectoryClient } from "@/components/DirectoryClient";

export const metadata = {
  title: "Directory | Samaj Biodata Portal",
  description: "Browse verified community biodata profiles filtered by Gaon, Area, and Age.",
};


export default async function DirectoryPage() {
  const profiles = await getDirectoryProfiles();

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Community Directory (Prashasanik Suchi)
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Filter verified biodata by native village (gaon), city area, and age.
        </p>
      </div>

      <DirectoryClient initialProfiles={profiles} />
    </div>
  );
}
