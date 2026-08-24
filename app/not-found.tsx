import Link from "next/link";

import { StickerBadge } from "@/components/sticker-badge";

export default function NotFound() {
  return (
    <div className="grid min-h-[65vh] place-items-center px-4 py-16 text-center">
      <div className="rotate-1 rounded-sm border-2 border-dashed border-(--line) bg-white px-8 py-10 shadow-md">
        <StickerBadge tone="leaf">404 · העמוד חסר</StickerBadge>
        <h1 className="my-4 -rotate-1 font-serif text-[clamp(2.8rem,8vw,5.5rem)] leading-none font-normal">נראה לי נכנסת לקופסא לא נכונה</h1>
        <p className="mx-auto max-w-lg leading-[1.7] text-(--muted)">ייתכן שהעמוד עבר, או שהכתובת אינה מלאה.</p>
        <Link className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm bg-(--leaf) px-5 py-3 font-extrabold text-white no-underline" href="/">חזרה לעמוד הבית</Link>
      </div>
    </div>
  );
}