import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LPBA Consulting | Leadership Brand Positioning & Automation",
    template: "%s | LPBA Consulting"
  },
  description: "Scale your influence and automate your revenue with the Leadership Brand Positioning & Automation System. Qualify leads, nurture relationships, and close high-ticket offers on autopilot.",
  keywords: ["Leadership", "Brand Positioning", "Automation", "Revenue System", "Marketing Funnel", "High-Ticket Sales", "Business Growth"],
  authors: [{ name: "LPBA Consulting Team" }],
  creator: "LPBA Consulting Team",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://lpba-consulting.com",
    title: "LPBA Consulting | Scale Your Influence",
    description: "The premier system for high-impact leaders to automate revenue and scale influence.",
    siteName: "LPBA Consulting",
    images: [
      {
        url: "/og-image.jpg", // We should ideally add an image here
        width: 1200,
        height: 630,
        alt: "LPBA Consulting Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LPBA Consulting | Scale Your Influence",
    description: "The premier system for high-impact leaders to automate revenue and scale influence.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <SessionProvider>
            {children}
        </SessionProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
