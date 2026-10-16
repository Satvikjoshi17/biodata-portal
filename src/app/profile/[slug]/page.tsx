import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProfileBySlug, getActiveAds } from "@/lib/actions";
import { ProfileClientView } from "@/components/ProfileClientView";

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// OpenGraph Dynamic Metadata for rich WhatsApp preview cards
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Profile Not Found | Samaj Biodata Portal",
    };
  }

  const title = `${profile.fullName} - Samaj Biodata`;
  const description = `Native Gaon: ${profile.gaon} | Age: ${profile.age} | ${
    profile.occupation || "Verified Samaj Member"
  }. Click to view complete verified biodata and QR code.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: profile.photoUrl,
          width: 800,
          height: 800,
          alt: profile.fullName,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [profile.photoUrl],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const [profile, ads] = await Promise.all([
    getProfileBySlug(slug),
    getActiveAds("profile_sidebar"),
  ]);

  if (!profile) {
    notFound();
  }

  return <ProfileClientView profile={profile} ads={ads} />;
}
