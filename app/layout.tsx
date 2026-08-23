import type { Metadata } from "next";
import { Gveret_Levin, Noto_Sans_Hebrew } from "next/font/google";

import { ScrollHideHeader } from "@/components/scroll-hide-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-hebrew",
  subsets: ["hebrew"],
});

const gveretLevin = Gveret_Levin({
  variable: "--font-handwritten",
  subsets: ["hebrew"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "חוט מקשר",
    template: "%s | חוט מקשר",
  },
  description: "כתב עת עצמאי על מלאכה, תשומת לב והרעיונות שמעצבים את היומיום.",
  applicationName: "חוט מקשר",
  openGraph: {
    title: "חוט מקשר",
    description:
      "כתב עת עצמאי על מלאכה, תשומת לב והרעיונות שמעצבים את היומיום.",
    type: "website",
    images: [{ url: "/writing-desk.jpg", width: 1800, height: 1200 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${notoSansHebrew.variable} ${gveretLevin.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="">{children}</body>
    </html>
  );
}
