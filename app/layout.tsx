import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-hebrew",
  subsets: ["hebrew"],
});

const gveretLevin = localFont({
  src: "./fonts/GveretLevin-Regular.woff2",
  variable: "--font-handwritten",
  weight: "400",
  adjustFontFallback: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "החיים בקופסא",
    template: "%s | החיים בקופסא",
  },
  description: "בלוג אישי, על החיים היקום וכל השאר",
  applicationName: "החיים בקופסא",
  openGraph: {
    title: "החיים בקופסא",
    description: "בלוג אישי, על החיים היקום וכל השאר",
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
      <body className="flex flex-col min-h-screen ">
        {children} <Analytics />
      </body>
    </html>
  );
}
