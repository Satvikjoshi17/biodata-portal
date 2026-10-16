import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Navbar, Footer } from "@/components/Navbar";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Paliwal Brahman Samaj",
    default: "Paliwal Brahman Samaj Biodata Portal & Verification Hub",
  },
  description: "Official Paliwal Brahman Samaj biodata registry for verified profiles, native village lineage, and shareable QR biodata cards.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased text-[#1c1917] bg-[#faf8f5] selection:bg-[#c2410c] selection:text-white">
        <LanguageProvider>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                borderRadius: "10px",
                border: "1px solid #e7e5e4",
                fontFamily: "var(--font-sans)",
              },
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
