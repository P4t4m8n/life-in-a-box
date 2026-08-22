"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import AnimatedHamburger from "./AnimatedHamburger";

export function MobileNav({
  logo,
  children,
}: {
  logo: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const onNavigationClick = (e: React.MouseEvent<HTMLUListElement>) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <nav
      className="relative flex items-center justify-between"
      aria-label="ניווט ראשי"
    >
      <Link
        className="inline-flex"
        href="/"
        aria-label="עמוד הבית של החיים בקופסא"
        onClick={() => setOpen(false)}
      >
        {logo}
      </Link>

      <button
        type="button"
        className="relative z-10 grid size-10 shrink-0 place-items-center md:hidden"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
        onClick={() => setOpen((value) => !value)}
      >
        <AnimatedHamburger open={open} className="w-6 h-6 stroke-black" />
      </button>

      <ul className="hidden gap-2 md:flex md:flex-row">{children}</ul>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        aria-hidden={!open}
        inert={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className={`fixed inset-x-0 top-20.5 z-40 h-[calc(100svh-5.125rem)] w-dvw border-0 bg-(--surface) p-6
          transition-[opacity,translate] duration-300 ease-out md:hidden ${
            open
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
      >
        <ul
          id="mobile-navigation"
          className="flex h-full flex-col items-center justify-center gap-6 text-lg"
          onClick={onNavigationClick}
        >
          {children}
        </ul>
      </div>
    </nav>
  );
}
