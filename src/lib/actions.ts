"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/db";
import { profiles, advertisements, type Advertisement, type AdPlacement } from "@/lib/schema";
import { uploadImageToGitHub } from "@/lib/github";
import { generateSlug, validateIndianPhone } from "@/lib/utils";
import { eq, desc, and } from "drizzle-orm";

export async function submitRegistration(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const dob = (formData.get("dob") as string) || "";
    const tob = (formData.get("tob") as string) || "";
    const pob = (formData.get("pob") as string) || "";
    const height = (formData.get("height") as string) || "";
    const ageStr = formData.get("age") as string;
    const gotra = (formData.get("gotra") as string) || "";

    const gaon = formData.get("gaon") as string;
    const area = formData.get("area") as string;
    const domicile = (formData.get("domicile") as string) || "";
    const residentAddress = (formData.get("residentAddress") as string) || "";

    const education = (formData.get("education") as string) || "";
    const occupation = (formData.get("occupation") as string) || "";

    const fatherName = (formData.get("fatherName") as string) || "";
    const fatherOccupation = (formData.get("fatherOccupation") as string) || "";
    const motherName = (formData.get("motherName") as string) || "";
    const motherOccupation = (formData.get("motherOccupation") as string) || "";
    const siblings = (formData.get("siblings") as string) || "";
    const grandFather = (formData.get("grandFather") as string) || "";
    const grandMother = (formData.get("grandMother") as string) || "";

    const phoneNumber = formData.get("phoneNumber") as string;
    const fatherContact = (formData.get("fatherContact") as string) || "";
    const motherContact = (formData.get("motherContact") as string) || "";
    const photoFile = formData.get("photo") as File;

    if (!fullName || !gaon || !area || !ageStr || !phoneNumber) {
      return { success: false, error: "Please fill out all mandatory fields (Name, Gaon, Area, Age, Phone)." };
    }

    const age = parseInt(ageStr, 10);
    if (isNaN(age) || age < 18 || age > 100) {
      return { success: false, error: "Please provide a valid age between 18 and 100." };
    }

    if (!validateIndianPhone(phoneNumber)) {
      return { success: false, error: "Please provide a valid 10-digit primary phone number." };
    }

    if (!photoFile || photoFile.size === 0) {
      return { success: false, error: "A passport-size profile photograph is required." };
    }

    if (photoFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Photo file size cannot exceed 5MB." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(photoFile.type)) {
      return { success: false, error: "Only JPG, PNG or WebP images are supported." };
    }

    // Convert file to buffer and upload to GitHub
    const arrayBuffer = await photoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadImageToGitHub(buffer, photoFile.name);

    const slug = generateSlug(fullName);

    const profileData = {
      fullName,
      dob,
      tob,
      pob,
      height,
      age,
      gotra,
      gaon,
      area,
      domicile,
      residentAddress,
      education,
      occupation,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      siblings,
      grandFather,
      grandMother,
      phoneNumber,
      fatherContact,
      motherContact,
      photoUrl: uploadResult.url,
      profileSlug: slug,
      status: "pending" as const,
    };

    const { isMock, mockDb, db } = getDatabase();

    if (isMock || !db) {
      await mockDb.insert(profileData);
    } else {
      await db.insert(profiles).values(profileData);
    }

    revalidatePath("/admin/dashboard");
    return {
      success: true,
      slug,
      message: "Form successfully submitted. It will be verified by our administrative desk before publishing.",
    };
  } catch (err: any) {
    console.error("submitRegistration error:", err);
    return {
      success: false,
      error: err?.message || "Internal server error occurred while processing registration.",
    };
  }
}

export async function adminLogin(password: string) {
  const secret = process.env.ADMIN_SECRET_PASSWORD || "admin_secret_samaj_2026";
  if (password === secret) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "authenticated_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect admin password." };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  return { success: true };
}

export async function updateProfileStatus(id: number, status: "approved" | "rejected" | "pending") {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      await mockDb.updateStatus(id, status);
    } else {
      await db.update(profiles).set({ status }).where(eq(profiles.id, id));
    }

    revalidatePath("/");
    revalidatePath("/directory");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update profile status." };
  }
}

export async function getDirectoryProfiles() {
  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      return await mockDb.getApproved();
    }
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.status, "approved"))
      .orderBy(desc(profiles.createdAt));
    return result;
  } catch (error) {
    console.error("getDirectoryProfiles error:", error);
    return [];
  }
}

export async function getProfileBySlug(slug: string) {
  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      return await mockDb.getBySlug(slug);
    }
    const result = await db.select().from(profiles).where(eq(profiles.profileSlug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("getProfileBySlug error:", error);
    return null;
  }
}

export async function getAllProfilesForAdmin() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return null;
  }

  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      return await mockDb.getAll();
    }
    const result = await db.select().from(profiles).orderBy(desc(profiles.createdAt));
    return result;
  } catch (error) {
    console.error("getAllProfilesForAdmin error:", error);
    return [];
  }
}

// ----------------------------------------------------
// Advertisement Operations
// ----------------------------------------------------

export async function getActiveAds(placement?: string): Promise<Advertisement[]> {
  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      return await mockDb.getActiveAds(placement);
    }
    const conditions = [eq(advertisements.active, "true")];
    if (placement) {
      conditions.push(eq(advertisements.placement, placement));
    }
    return await db
      .select()
      .from(advertisements)
      .where(and(...conditions))
      .orderBy(advertisements.displayOrder);
  } catch (err) {
    console.error("getActiveAds error:", err);
    return [];
  }
}

export async function getAllAdsForAdmin(): Promise<Advertisement[] | null> {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return null;
  }

  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      return await mockDb.getAllAds();
    }
    return await db.select().from(advertisements).orderBy(advertisements.displayOrder);
  } catch (err) {
    console.error("getAllAdsForAdmin error:", err);
    return [];
  }
}

export async function createAdvertisement(formData: FormData) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const title = (formData.get("title") as string)?.trim();
    const linkUrl = (formData.get("linkUrl") as string)?.trim() || null;
    const placement = ((formData.get("placement") as string)?.trim() as AdPlacement) || "home_featured";
    const imageUrlInput = (formData.get("imageUrl") as string)?.trim();
    const photoFile = formData.get("photo") as File | null;
    const displayOrderStr = (formData.get("displayOrder") as string) || "0";
    const displayOrder = parseInt(displayOrderStr, 10) || 0;

    if (!title) {
      return { success: false, error: "Ad title / Sponsor name is required." };
    }

    let finalImageUrl = imageUrlInput || "";

    if (photoFile && photoFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(photoFile.type)) {
        return { success: false, error: "Only JPG, PNG or WebP images are supported." };
      }
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadImageToGitHub(buffer, photoFile.name);
      finalImageUrl = uploadResult.url;
    }

    if (!finalImageUrl) {
      return { success: false, error: "Please upload an advertisement image or provide an image link." };
    }

    const adData = {
      title,
      imageUrl: finalImageUrl,
      linkUrl,
      placement,
      active: "true" as const,
      displayOrder,
    };

    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      await mockDb.insertAd(adData);
    } else {
      await db.insert(advertisements).values(adData);
    }

    revalidatePath("/");
    revalidatePath("/directory");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("createAdvertisement error:", err);
    return { success: false, error: err?.message || "Failed to create advertisement." };
  }
}

export async function toggleAdvertisementStatus(id: number) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      await mockDb.toggleAdStatus(id);
    } else {
      const current = await db.select().from(advertisements).where(eq(advertisements.id, id)).limit(1);
      if (current[0]) {
        const nextActive = current[0].active === "true" ? "false" : "true";
        await db.update(advertisements).set({ active: nextActive }).where(eq(advertisements.id, id));
      }
    }

    revalidatePath("/");
    revalidatePath("/directory");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to toggle status." };
  }
}

export async function deleteAdvertisement(id: number) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      await mockDb.deleteAd(id);
    } else {
      await db.delete(advertisements).where(eq(advertisements.id, id));
    }

    revalidatePath("/");
    revalidatePath("/directory");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete advertisement." };
  }
}

export async function updateAdvertisement(formData: FormData) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const idStr = formData.get("id") as string;
    const id = parseInt(idStr, 10);
    if (!id || isNaN(id)) {
      return { success: false, error: "Invalid advertisement ID." };
    }

    const title = (formData.get("title") as string)?.trim();
    const linkUrl = (formData.get("linkUrl") as string)?.trim() || null;
    const placement = ((formData.get("placement") as string)?.trim() as AdPlacement) || "home_featured";
    const imageUrlInput = (formData.get("imageUrl") as string)?.trim();
    const photoFile = formData.get("photo") as File | null;
    const displayOrderStr = (formData.get("displayOrder") as string) || "0";
    const displayOrder = parseInt(displayOrderStr, 10) || 0;
    const active = (formData.get("active") as string) || "true";

    if (!title) {
      return { success: false, error: "Ad title is required." };
    }

    let finalImageUrl = imageUrlInput || "";

    if (photoFile && photoFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(photoFile.type)) {
        return { success: false, error: "Only JPG, PNG or WebP images are supported." };
      }
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadImageToGitHub(buffer, `ad-${Date.now()}-${photoFile.name}`);
      finalImageUrl = uploadResult.url;
    }

    const updateData: Partial<Advertisement> = {
      title,
      linkUrl,
      placement,
      displayOrder,
      active,
    };

    if (finalImageUrl) {
      updateData.imageUrl = finalImageUrl;
    }

    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      await mockDb.updateAd(id, updateData);
    } else {
      await db.update(advertisements).set(updateData).where(eq(advertisements.id, id));
    }

    revalidatePath("/");
    revalidatePath("/directory");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("updateAdvertisement error:", err);
    return { success: false, error: err?.message || "Failed to update advertisement." };
  }
}

export async function updateProfileDetails(formData: FormData) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (!auth || auth.value !== "authenticated_session") {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const idStr = formData.get("id") as string;
    const id = parseInt(idStr, 10);
    if (!id || isNaN(id)) {
      return { success: false, error: "Invalid profile ID." };
    }

    const fullName = (formData.get("fullName") as string)?.trim();
    const ageStr = formData.get("age") as string;
    const gaon = (formData.get("gaon") as string)?.trim();
    const area = (formData.get("area") as string)?.trim();
    const phoneNumber = (formData.get("phoneNumber") as string)?.trim();
    const status = (formData.get("status") as string)?.trim() || "approved";

    if (!fullName || !gaon || !area || !ageStr || !phoneNumber) {
      return { success: false, error: "Mandatory fields cannot be empty (Name, Gaon, Area, Age, Phone)." };
    }

    const age = parseInt(ageStr, 10);
    if (isNaN(age) || age < 18 || age > 100) {
      return { success: false, error: "Please enter a valid age between 18 and 100." };
    }

    if (!validateIndianPhone(phoneNumber)) {
      return { success: false, error: "Please enter a valid 10-digit primary phone number." };
    }

    const dob = (formData.get("dob") as string)?.trim() || null;
    const tob = (formData.get("tob") as string)?.trim() || null;
    const pob = (formData.get("pob") as string)?.trim() || null;
    const height = (formData.get("height") as string)?.trim() || null;
    const gotra = (formData.get("gotra") as string)?.trim() || null;
    const domicile = (formData.get("domicile") as string)?.trim() || null;
    const residentAddress = (formData.get("residentAddress") as string)?.trim() || null;
    const education = (formData.get("education") as string)?.trim() || null;
    const occupation = (formData.get("occupation") as string)?.trim() || null;
    const fatherName = (formData.get("fatherName") as string)?.trim() || null;
    const fatherOccupation = (formData.get("fatherOccupation") as string)?.trim() || null;
    const motherName = (formData.get("motherName") as string)?.trim() || null;
    const motherOccupation = (formData.get("motherOccupation") as string)?.trim() || null;
    const siblings = (formData.get("siblings") as string)?.trim() || null;
    const grandFather = (formData.get("grandFather") as string)?.trim() || null;
    const grandMother = (formData.get("grandMother") as string)?.trim() || null;
    const fatherContact = (formData.get("fatherContact") as string)?.trim() || null;
    const motherContact = (formData.get("motherContact") as string)?.trim() || null;

    const photoUrlInput = (formData.get("photoUrl") as string)?.trim();
    const photoFile = formData.get("photo") as File | null;

    const updateData: any = {
      fullName,
      age,
      dob,
      tob,
      pob,
      height,
      gotra,
      gaon,
      area,
      domicile,
      residentAddress,
      education,
      occupation,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      siblings,
      grandFather,
      grandMother,
      phoneNumber,
      fatherContact,
      motherContact,
      status,
    };

    if (photoFile && photoFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(photoFile.type)) {
        return { success: false, error: "Only JPG, PNG or WebP images are supported." };
      }
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadImageToGitHub(buffer, `profile-${Date.now()}-${photoFile.name}`);
      updateData.photoUrl = uploadResult.url;
    } else if (photoUrlInput) {
      updateData.photoUrl = photoUrlInput;
    }

    const { isMock, mockDb, db } = getDatabase();
    if (isMock || !db) {
      await mockDb.updateProfile(id, updateData);
    } else {
      await db.update(profiles).set(updateData).where(eq(profiles.id, id));
    }

    revalidatePath("/");
    revalidatePath("/directory");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("updateProfileDetails error:", err);
    return { success: false, error: err?.message || "Failed to update profile." };
  }
}
