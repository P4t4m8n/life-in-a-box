import Link from "next/link";


export function SiteFooter() {
  return (
    <footer className="px-4 w-full border-t-2 border-dashed border-white/30 bg-(--footer-bg) py-12 min-h-34 items-center 
    text-[#e8ece8] mx-auto  grid grid-cols-3 gap-8 max-[760px]:grid-cols-1">
      
        <p className="-rotate-1 mb-2 inline-block md:text-center font-serif text-2xl font-normal text-white">
          החיים בקופסא
        </p>
     
      <nav
        className="flex flex-wrap content-start md:content-center md:justify-center gap-x-5 gap-y-3"
        aria-label="ניווט מדיניות"
      >
        <Link
          className="text-sm font-bold text-white underline-offset-4 hover:underline"
          href="/privacy"
        >
          פרטיות
        </Link>
        <Link
          className="text-sm font-bold text-white underline-offset-4 hover:underline"
          href="/terms"
        >
          תנאי שימוש
        </Link>
    
      </nav>
      <div className="flex items-center md:justify-center gap-1 w-full">
        
      </div>
    </footer>
  );
}
