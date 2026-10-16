import { redirect } from "next/navigation";
import { getAllProfilesForAdmin, getAllAdsForAdmin } from "@/lib/actions";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | Samaj Biodata Portal",
};

export default async function AdminDashboardPage() {
  const [profiles, ads] = await Promise.all([
    getAllProfilesForAdmin(),
    getAllAdsForAdmin(),
  ]);

  if (profiles === null) {
    redirect("/admin/login");
  }

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AdminDashboardClient initialProfiles={profiles} initialAds={ads || []} />
    </div>
  );
}
