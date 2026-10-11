import type { Metadata } from "next";
import { DM_Sans, Manrope, Newsreader } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Joyest Enterprise — rooted in Ghana, made for everyday wellness",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Joyest — Nutritional Foods, Hair Care, Spices & More",
    template: "%s — Joyest",
  },
  description:
    "Shop nutritional foods, natural hair care, aromatic spices and more at Joyest. Order easily via WhatsApp, phone, or email.",
  openGraph: {
    title: "Joyest — Nutritional Foods, Hair Care, Spices & More",
    description:
      "Shop nutritional foods, natural hair care, aromatic spices and more at Joyest. Order easily via WhatsApp, phone, or email.",
    url: SITE_URL,
    siteName: "Joyest",
    locale: "en",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joyest — Nutritional Foods, Hair Care, Spices & More",
    description:
      "Shop nutritional foods, natural hair care, aromatic spices and more at Joyest. Order easily via WhatsApp, phone, or email.",
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${newsreader.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
