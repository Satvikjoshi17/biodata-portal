// src/app/page.tsx
import { getDirectoryProfiles, getActiveAds } from "@/lib/actions";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const [profiles, ads] = await Promise.all([
    getDirectoryProfiles(),
    getActiveAds(),
  ]);

  return <HomeClient initialProfiles={profiles} ads={ads} />;
}