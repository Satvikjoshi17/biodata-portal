import { getDirectoryProfiles, getActiveAds } from "@/lib/actions";
import { DirectoryPageClient } from "@/components/DirectoryPageClient";

export const metadata = {
  title: "Directory | Samaj Biodata Portal",
  description: "Browse verified community biodata profiles filtered by Gaon, Area, and Age.",
};

export default async function DirectoryPage() {
  const [profiles, ads] = await Promise.all([
    getDirectoryProfiles(),
    getActiveAds(),
  ]);

  return <DirectoryPageClient initialProfiles={profiles} ads={ads} />;
}
