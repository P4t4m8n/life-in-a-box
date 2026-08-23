import { ScrollHideHeader } from "@/components/scroll-hide-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        className="fixed inset-s-4 top-4 z-50 -translate-y-24 rounded-sm bg-foreground px-4 py-3 font-bold text-white no-underline transition-transform focus:translate-y-0"
        href="#main-content"
      >
        דילוג לתוכן
      </a>
      <ScrollHideHeader>
        <SiteHeader />
      </ScrollHideHeader>
      <main id="main-content" className="min-h-[70vh] " tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
