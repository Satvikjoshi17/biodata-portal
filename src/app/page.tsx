// src/app/page.tsx
import { getDirectoryProfiles } from "@/lib/actions";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const profiles = await getDirectoryProfiles();

  return <HomeClient initialProfiles={profiles} />;
}