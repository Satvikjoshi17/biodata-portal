# Samaj Biodata Portal & Verification Hub

A full-stack, mobile-first web application designed for Indian community members and administrators to register, verify, search, and share biodatas with instant scannable QR cards.

---

## 🌟 Key Features

1. **Public Directory & Filtering Engine (`/` & `/directory`)**
   - Real-time search by full name, occupation, or education.
   - Dynamic dropdown selectors for **Native Gaon (Mool Niwas)** and **Current Area/City** derived from approved profiles.
   - Sorting by newest additions or age (ascending/descending).
   - Responsive cards with village and area badges and a direct link to view the digital biodata & QR code.

2. **Public Registration Form (`/register`)**
   - Client-side validation for all mandatory fields: Full Name, Gaon, Area, Age, 10-digit Indian Mobile Number, and Photograph.
   - Image upload restriction (Max 5MB, JPG/PNG/WebP) with instant client-side preview.
   - Server Action handles image upload to GitHub repository storage (via Octokit) or base64 fallback, unique collision-free slug generation, and database insertion with `status: 'pending'`.
   - Clear submission success screen in Hindi & English.

3. **Secure Admin Approval Dashboard (`/admin/dashboard`)**
   - Protected by cookie-based authentication validated against `ADMIN_SECRET_PASSWORD`.
   - Tabbed view: **Pending Approval** (default), **Approved Profiles**, and **Rejected Profiles**.
   - One-click **Approve** and **Reject** buttons that update the database and revalidate cache (`revalidatePath`).
   - Quick Inspection Modal allowing admins to view full details and candidate photo prior to approval.

4. **Individual Profile View & Shareable QR Code (`/profile/[slug]`)**
   - Modern digital biodata card layout with organized personal, educational, and professional details.
   - Dynamic Open Graph metadata for rich link previews when shared in WhatsApp family and community groups.
   - Scannable QR code powered by `qrcode.react`.
   - **Download QR Code (PNG)** and **Copy Profile Link** with instant toast feedback.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ / 16 (App Router, Server Actions, Server & Client Components)
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database**: NeonDB (Serverless PostgreSQL) accessed via Drizzle ORM
- **Image Hosting**: GitHub REST API (Octokit) committing to dedicated storage repo
- **QR Generator**: `qrcode.react`
- **Notifications**: `sonner`

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
GITHUB_TOKEN="ghp_your_personal_access_token"
GITHUB_OWNER="your_github_username_or_org"
GITHUB_REPO="your_dedicated_storage_repo"
ADMIN_SECRET_PASSWORD="admin_secret_samaj_2026"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> **Note**: If `DATABASE_URL` is empty, the application automatically runs in demo mode using an in-memory database with pre-populated verified community profiles. If GitHub credentials are not supplied, images are handled with an instant preview data URL.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migrations (when NeonDB is configured):**
   ```bash
   npx drizzle-kit push
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - **Home & Directory**: [http://localhost:3000](http://localhost:3000)
   - **Register Biodata**: [http://localhost:3000/register](http://localhost:3000/register)
   - **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (Default password: `admin_secret_samaj_2026`)
   - **Sample Profile**: [http://localhost:3000/profile/aarav-sharma-k7b2](http://localhost:3000/profile/aarav-sharma-k7b2)
