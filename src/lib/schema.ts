import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const profiles = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    // Core Identity
    fullName: text("full_name").notNull(),
    dob: text("dob"), // e.g. "19-11-2001"
    tob: text("tob"), // e.g. "5:59 PM"
    pob: text("pob"), // e.g. "Indore"
    height: text("height"), // e.g. "5'8\""
    age: integer("age").notNull(),
    gotra: text("gotra"), // e.g. "Bhardwaj"

    // Location & Lineage
    gaon: text("gaon").notNull(), // Native Village / Origin
    area: text("area").notNull(), // City / Area
    domicile: text("domicile"), // e.g. "Indore, Madhya Pradesh"
    residentAddress: text("resident_address"), // e.g. "52/ Guru Nagar, Robot Square, Indore"

    // Education & Career
    education: text("education"), // e.g. "BBA, MBA - Marketing"
    occupation: text("occupation"), // e.g. "Entrepreneur / Tech Specialist"

    // Family Details
    fatherName: text("father_name"),
    fatherOccupation: text("father_occupation"),
    motherName: text("mother_name"),
    motherOccupation: text("mother_occupation"),
    siblings: text("siblings"), // e.g. "1 elder brother"
    grandFather: text("grand_father"), // e.g. "Mr. Bhanwar lal Paliwal"
    grandMother: text("grand_mother"), // e.g. "Mrs. Radha bai Paliwal"

    // Contact Numbers
    phoneNumber: text("phone_number").notNull(), // Primary phone
    fatherContact: text("father_contact"), // e.g. "9424073243"
    motherContact: text("mother_contact"), // e.g. "9425059004"

    // Media & System
    photoUrl: text("photo_url").notNull(),
    profileSlug: text("profile_slug").notNull().unique(),
    status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("profiles_gaon_idx").on(table.gaon),
    index("profiles_area_idx").on(table.area),
    index("profiles_status_idx").on(table.status),
  ]
);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
