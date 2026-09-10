import { ContactForm } from "@/components/contact-form";
import { StickerBadge } from "@/components/sticker-badge";

export default function ContactPage() {
  return (
    <div className="w-full bg-(--surface)">
      <section
        className="py-[clamp(4rem,8vw,7rem)]"
        aria-labelledby="contact-title"
      >
        <div className="mx-auto grid w-[calc(100%-2rem)] max-w-xl gap-8">
          <div className="grid justify-items-center gap-4 text-center">
            <StickerBadge tone="leaf">יצירת קשר</StickerBadge>
            <h1
              className="-rotate-1 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-none font-normal"
              id="contact-title"
            >
              רוצים להגיד משהו?
            </h1>
            <p className="max-w-md leading-[1.7] text-(--muted)">
              תכתבו לי, אני מבטיח להתעלם
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
