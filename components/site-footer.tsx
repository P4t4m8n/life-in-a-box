import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-dashed border-white/30 bg-foreground py-12 text-[#e8ece8]">
      <div className="mx-auto grid w-[calc(100%-2rem)] max-w-304 grid-cols-[1.1fr_1fr_1fr] gap-8 max-[760px]:grid-cols-1">
        <div>
          <p className="-rotate-1 mb-2 inline-block font-serif text-2xl font-normal text-white">החיים בקופסא</p>
        </div>
        <nav className="flex flex-wrap content-start gap-x-5 gap-y-3" aria-label="ניווט מדיניות">
          <Link className="text-sm font-bold text-white underline-offset-4 hover:underline" href="/privacy">פרטיות</Link>
          <Link className="text-sm font-bold text-white underline-offset-4 hover:underline" href="/terms">תנאי שימוש</Link>
          <Link className="text-sm font-bold text-white underline-offset-4 hover:underline" href="/comment-policy">מדיניות תגובות</Link>
        </nav>
      </div>
    </footer>
  );
}