import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Fallback in-memory storage populated with complete detailed records including Falguni Paliwal and default ads
class MockDB {
  private static profilesList: schema.Profile[] = [
    {
      id: 1,
      fullName: "Falguni Paliwal",
      dob: "19-11-2001",
      tob: "5:59 PM",
      pob: "Indore",
      height: "5'8\"",
      age: 24,
      gotra: "Bhardwaj",
      gaon: "Pali",
      area: "Indore",
      domicile: "Indore, Madhya Pradesh",
      residentAddress: "52/ Guru Nagar, Robot Square, Indore, Madhya Pradesh",
      education: "BBA, MBA - Marketing",
      occupation: "Marketing Professional & Entrepreneur",
      fatherName: "Rajesh Paliwal",
      fatherOccupation: "Entrepreneur",
      motherName: "Vimla Paliwal",
      motherOccupation: "Entrepreneur",
      siblings: "1 elder brother",
      grandFather: "Mr. Bhanwar lal Paliwal",
      grandMother: "Mrs. Radha bai Paliwal",
      phoneNumber: "9424073243",
      fatherContact: "9424073243",
      motherContact: "9425059004",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      profileSlug: "falguni-paliwal-m7x1",
      status: "approved",
      createdAt: new Date("2026-03-05T10:00:00Z"),
    },
    {
      id: 2,
      fullName: "Aarav Sharma",
      dob: "14-04-1999",
      tob: "10:15 AM",
      pob: "Delhi",
      height: "5'11\"",
      age: 26,
      gotra: "Vashistha",
      gaon: "Rampur",
      area: "North Delhi",
      domicile: "Delhi, NCR",
      residentAddress: "C-42, Sector 14, Rohini, North Delhi",
      education: "B.Tech in Computer Science",
      occupation: "Senior Software Engineer",
      fatherName: "Suresh Sharma",
      fatherOccupation: "Govt. Officer",
      motherName: "Sunita Sharma",
      motherOccupation: "Teacher",
      siblings: "1 younger sister",
      grandFather: "Late Sh. Ramcharan Sharma",
      grandMother: "Mrs. Shanti Devi",
      phoneNumber: "9876543210",
      fatherContact: "9876543211",
      motherContact: "9876543212",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      profileSlug: "aarav-sharma-k7b2",
      status: "approved",
      createdAt: new Date("2026-02-10T10:00:00Z"),
    },
    {
      id: 3,
      fullName: "Priya Patel",
      dob: "08-09-2001",
      tob: "02:30 PM",
      pob: "Surat",
      height: "5'4\"",
      age: 24,
      gotra: "Kashyap",
      gaon: "Navsari",
      area: "West Mumbai",
      domicile: "Maharashtra",
      residentAddress: "B-204, Gokuldham, Goregaon East, Mumbai",
      education: "B.Com, CA Finalist",
      occupation: "Chartered Accountant (EY)",
      fatherName: "Mahesh Patel",
      fatherOccupation: "Businessman",
      motherName: "Geeta Patel",
      motherOccupation: "Homemaker",
      siblings: "None",
      grandFather: "Mr. Kanti Bhai Patel",
      grandMother: "Mrs. Savitri Patel",
      phoneNumber: "9823456789",
      fatherContact: "9823456780",
      motherContact: "9823456781",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
      profileSlug: "priya-patel-9x2m",
      status: "approved",
      createdAt: new Date("2026-02-12T14:30:00Z"),
    }
  ];

  private static adsList: schema.Advertisement[] = [
    {
      id: 1,
      title: "श्री पालीवाल ज्वेलर्स - शुद्ध स्वर्ण आभूषण एवं वैवाहिक संग्रह",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200",
      linkUrl: "https://wa.me/919424073243?text=Namaste%20Paliwal%20Jewellers",
      placement: "top_banner",
      active: "true",
      displayOrder: 1,
      createdAt: new Date("2026-03-01T10:00:00Z"),
    },
    {
      id: 2,
      title: "पालीवाल हेरिटेज रिसॉर्ट - मांगलिक व वैवाहिक आयोजनों का उत्कृष्ट स्थल",
      imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
      linkUrl: "https://wa.me/919424073243?text=Resort%20Booking%20Inquiry",
      placement: "home_featured",
      active: "true",
      displayOrder: 1,
      createdAt: new Date("2026-03-02T10:00:00Z"),
    },
    {
      id: 3,
      title: "श्री पालीवाल कैटरर्स - शुद्ध शाकाहारी स्वादिष्ट शाही शादी व्यवस्था",
      imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
      linkUrl: "tel:9424073243",
      placement: "directory_infeed",
      active: "true",
      displayOrder: 1,
      createdAt: new Date("2026-03-03T10:00:00Z"),
    },
    {
      id: 4,
      title: "श्री पालीवाल परिधान - पारंपरिक व आधुनिक वेडिंग शेरवानी एवं साड़ियाँ",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
      linkUrl: "https://wa.me/919424073243?text=Wedding%20Attire%20Inquiry",
      placement: "profile_sidebar",
      active: "true",
      displayOrder: 1,
      createdAt: new Date("2026-03-04T10:00:00Z"),
    },
    {
      id: 5,
      title: "अखिल भारतीय पालीवाल परिचय सम्मेलन एवं वैवाहिक पत्रिका 2026",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      linkUrl: "https://wa.me/919424073243?text=Sammelan%20Poster%20Inquiry",
      placement: "portrait_flyer",
      active: "true",
      displayOrder: 1,
      createdAt: new Date("2026-03-05T10:00:00Z"),
    }
  ];

  // Profiles
  static async getAll() {
    return [...this.profilesList];
  }

  static async getApproved() {
    return this.profilesList.filter((p) => p.status === "approved");
  }

  static async getBySlug(slug: string) {
    return this.profilesList.find((p) => p.profileSlug === slug) || null;
  }

  static async insert(item: schema.NewProfile) {
    const newProfile: schema.Profile = {
      id: this.profilesList.length > 0 ? Math.max(...this.profilesList.map((p) => p.id)) + 1 : 1,
      fullName: item.fullName,
      dob: item.dob || null,
      tob: item.tob || null,
      pob: item.pob || null,
      height: item.height || null,
      age: item.age,
      gotra: item.gotra || null,
      gaon: item.gaon,
      area: item.area,
      domicile: item.domicile || null,
      residentAddress: item.residentAddress || null,
      education: item.education || null,
      occupation: item.occupation || null,
      fatherName: item.fatherName || null,
      fatherOccupation: item.fatherOccupation || null,
      motherName: item.motherName || null,
      motherOccupation: item.motherOccupation || null,
      siblings: item.siblings || null,
      grandFather: item.grandFather || null,
      grandMother: item.grandMother || null,
      phoneNumber: item.phoneNumber,
      fatherContact: item.fatherContact || null,
      motherContact: item.motherContact || null,
      photoUrl: item.photoUrl,
      profileSlug: item.profileSlug,
      status: item.status || "pending",
      createdAt: new Date(),
    };
    this.profilesList.unshift(newProfile);
    return [newProfile];
  }

  static async updateStatus(id: number, status: "approved" | "rejected" | "pending") {
    const profile = this.profilesList.find((p) => p.id === id);
    if (profile) {
      profile.status = status;
      return [profile];
    }
    return [];
  }

  // Advertisements
  static async getAllAds() {
    return [...this.adsList].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static async getActiveAds(placement?: string) {
    return this.adsList
      .filter((ad) => ad.active === "true")
      .filter((ad) => !placement || ad.placement === placement)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static async insertAd(item: schema.NewAdvertisement) {
    const newAd: schema.Advertisement = {
      id: this.adsList.length > 0 ? Math.max(...this.adsList.map((a) => a.id)) + 1 : 1,
      title: item.title,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl || null,
      placement: item.placement,
      active: item.active || "true",
      displayOrder: item.displayOrder ?? 0,
      createdAt: new Date(),
    };
    this.adsList.push(newAd);
    return [newAd];
  }

  static async toggleAdStatus(id: number) {
    const ad = this.adsList.find((a) => a.id === id);
    if (ad) {
      ad.active = ad.active === "true" ? "false" : "true";
      return [ad];
    }
    return [];
  }

  static async deleteAd(id: number) {
    const index = this.adsList.findIndex((a) => a.id === id);
    if (index !== -1) {
      const removed = this.adsList.splice(index, 1);
      return removed;
    }
    return [];
  }
}

export function getDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("user:password@ep-sample-pooler")) {
    return { isMock: true, mockDb: MockDB, db: null };
  }

  const sql = neon(dbUrl);
  const db = drizzle(sql, { schema });
  return { isMock: false, mockDb: MockDB, db };
}

export { MockDB };
