"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import AnimatedHamburger from "./AnimatedHamburger";

const subscribeNoop = () => () => {};

export function MobileNav({
  logo,
  children,
}: {
  logo: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // false on the server / first hydration pass, true once we can reach document.body
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
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
        <AnimatedHamburger open={open} className="w-6 h-6 stroke-current" />
      </button>

      <ul className="hidden gap-2 md:flex md:flex-row items-center ">
        {children}
      </ul>

      {/* Portaled out of the header: its backdrop-blur/translate would otherwise become the
          containing block for this `fixed` element, so it'd be positioned (and overflow) inside
          the header instead of the viewport. */}
      {mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="תפריט ניווט"
            aria-hidden={!open}
            inert={!open}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            className={`fixed inset-x-0 top-20.5 z-40 h-[calc(100svh-5.125rem)] bg-(--surface) p-6
  transition-transform duration-300 ease-out md:hidden ${
    open
      ? "translate-x-0 pointer-events-auto"
      : "-translate-x-full pointer-events-none"
  }`}
          >
            <ul
              id="mobile-navigation"
              className="flex h-full flex-col items-center justify-center gap-6 text-lg"
              onClick={onNavigationClick}
            >
              {children}
            </ul>
          </div>,
          document.body,
        )}
    </nav>
  );
}
