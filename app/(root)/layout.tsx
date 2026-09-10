import React from "react";

// --- Components ---
import { ScrollHideHeader } from "@/components/scroll-hide-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
  
      <ScrollHideHeader>
        <SiteHeader />
      </ScrollHideHeader>
      <main id="main-content" className=" min-h-[calc(100vh-13.7rem)] h-full  w-full grid " tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
