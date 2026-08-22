"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollHideHeader({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let frame = 0;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 8) {
        setHidden(false);
      } else if (Math.abs(delta) > 4) {
        // only flip state once the swipe/scroll is a deliberate gesture, not scroll jitter
        setHidden(delta > 0);
      }

      lastScrollY.current = currentScrollY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 border-b-2 border-dashed border-(--line) bg-(--surface)/95 backdrop-blur transition-transform duration-300 has-focus-visible:translate-y-0 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
