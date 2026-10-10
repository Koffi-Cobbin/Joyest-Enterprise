import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://joyestenterprise.com"),
  title: {
    default: "Joyest Enterprise | Everyday goodness, made with care",
    template: "%s | Joyest Enterprise"
  },
  description: "Explore nutritional foods, natural hair care and aromatic spices from Joyest Enterprise.",
  openGraph: {
    title: "Joyest Enterprise",
    description: "Nutritional foods, natural hair care and aromatic spices.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="grain">
        <Providers><SiteHeader />{children}<SiteFooter /></Providers>
      </body>
    </html>
  );
}
