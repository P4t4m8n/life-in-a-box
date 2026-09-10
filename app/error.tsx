"use client";

import { useEffect } from "react";

// --- Components ---
import { StickerBadge } from "@/components/sticker-badge";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[65vh] place-items-center px-4 py-16 text-center">
      <div className="-rotate-1 rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-8 py-10 shadow-md">
        <StickerBadge tone="coral">אופסס</StickerBadge>
        <h2 className="my-4 rotate-1 font-serif text-[clamp(2.8rem,8vw,5.5rem)] leading-none font-normal">משהו נשבר.</h2>
        <p className="mx-auto max-w-lg leading-[1.7] text-(--muted)">אפשר לנסות שוב, או להתייאש</p>
        <button className="mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm border-0 bg-(--leaf) px-5 py-3 font-inherit font-extrabold text-white" type="button" onClick={reset}>ניסיון נוסף</button>
      </div>
    </div>
  );
}