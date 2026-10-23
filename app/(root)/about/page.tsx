// --- Components ---
import { StickerBadge } from "@/components/sticker-badge";

export default function AboutPage() {
  return (
    <div className="w-full h-full bg-(--surface) flex items-center justify-center">
      <section
        className=" py-[clamp(4rem,8vw,7rem)] h-full"
        aria-labelledby="about-title"
      >
        <div className="mx-auto grid w-[calc(100%-2rem)] max-w-3xl justify-items-center gap-6 text-center">
          <StickerBadge tone="coral">קצת עליי</StickerBadge>
          <h1
            className="-rotate-1 font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-none font-normal"
            id="about-title"
          >
            החיים בקופסא
          </h1>
   <div className="max-w-xl space-y-4 leading-[1.8] text-(--muted)">
  <p>
    מי אני? אוהב חיות, שונא ירקות. יודע יותר מדי על עולמות פנטזיה, ממה
    שמוכן להודות. גורם לדברים לקרות על המסך, וחולם על מהפכת פועלים.
  </p>
  <p>
    פעם הייתי פלצן, היום יש לי עצירות. פעם הייתי כותב ואנשים היו קוראים, היום
    אף אחד לא קורא לי, אבל אני עדיין כותב.
  </p>
  <p>
    יש פה סיפורים מוזרים, מצחיקים, צדקנים ואישיים, שכנראה לא הייתי מספר לכם
    בפנים. מטבעונות לאופנועים ועד סתם פריקת עצבים. מה הפואנטה? לא יודע. אולי
    תרפיה עצמית, אולי משבר אמצע החיים, אולי רצון להיחשף, ואולי משעמם לי.
  </p>
  <p>
    אני לא מבטיח שהכתיבה טובה, אני כן מבטיח שהיא אמיתית. תהנו (או תסבלו, זאת
    גם אופציה).
  </p>
</div>
        </div>
      </section>
    </div>
  );
}
