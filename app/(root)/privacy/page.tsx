import type { Metadata } from "next";
import Link from "next/link";
import { StickerBadge } from "@/components/sticker-badge";

export const metadata: Metadata = {
  title: "מדיניות פרטיות ותנאי שימוש",
  description: "מדיניות הפרטיות ותנאי השימוש של החיים בקופסא.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full bg-(--surface)">
      <section
        className="py-[clamp(3rem,7vw,6rem)]"
        aria-labelledby="privacy-title"
      >
        <article className="mx-auto w-[calc(100%-2rem)] max-w-3xl">
          <header className="mb-10 grid justify-items-center gap-4 text-center">
            <StickerBadge tone="coral">כדאי לדעת</StickerBadge>
            <h1
              className="-rotate-1 font-serif text-[clamp(2rem,5vw,3.5rem)] leading-tight font-normal"
              id="privacy-title"
            >
              מדיניות פרטיות ותנאי שימוש
            </h1>
            <p className="text-sm text-(--muted)">עודכן ב־21 באוקטובר 2026</p>
          </header>

          <nav
            className="mb-12 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-bold"
            aria-label="תוכן העמוד"
          >
            <a className="underline underline-offset-4" href="#privacy">
              מדיניות פרטיות
            </a>
            <a className="underline underline-offset-4" href="#terms">
              תנאי שימוש
            </a>
            <a className="underline underline-offset-4" href="#contact">
              יצירת קשר
            </a>
          </nav>

          <div className="space-y-14 leading-[1.85]">
            <section
              className="scroll-mt-24 space-y-8"
              id="privacy"
              aria-labelledby="privacy-heading"
            >
              <div className="space-y-3">
                <h2
                  className="font-serif text-3xl font-normal"
                  id="privacy-heading"
                >
                  מדיניות פרטיות
                </h2>
                <p className="border-s-4 border-(--coral) ps-4 text-(--muted)">
                   אני אוסף מעט מידע שנחוץ להפעלת הבלוג, לא מוכר אותו, ולא
                  משתמש בנתוני הגלישה כדי לזהות אותך אישית. אפשר לפנות אליי
                  בבקשה לעיין במידע או למחוק אותו.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">מי אני</h3>
                <p className="text-(--muted)">
                  ״החיים בקופסא״ הוא בלוג אישי ולא מסחרי שמופעל על ידי. לכל
                  שאלה או בקשה בנושא פרטיות אפשר לפנות אליי דרך{" "}
                  <Link
                    className="font-bold text-(--leaf) underline underline-offset-4"
                    href="/contact"
                  >
                    טופס יצירת הקשר
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">איזה מידע נאסף</h3>
                <ul className="list-disc space-y-3 pe-6 text-(--muted)">
                  <li>
                    <strong className="text-foreground">חשבון חברים:</strong>{" "}
                .אני שומר את כתובת המייל ומספר מזהה שמוצפן בשרת. ההתחברות נעשת דרך גוגל, ואין לי גישה לסיסמה שלך. המידע הזה נחוץ כדי לאשר ולנהל את הגישה לאזור החברים.הכי גרוע? תקבלו הרבה הצעות מנסיכים ניגרים                  </li>
                  <li>
                    <strong className="text-foreground">טופס יצירת קשר:</strong>{" "}
                    השם, כתובת המייל, הנושא וההודעה ששלחת מועברים אליי בדוא״ל
                    דרך Gmail. ההודעה לא נשמרת במסד הנתונים של האתר; עותק הדוא״ל
                    נשמר בתיבת הדואר בהתאם להגדרות ולמדיניות של Google.
                  </li>
                  <li>
                    <strong className="text-foreground">נתוני שימוש:</strong>{" "}
                    האתר משתמש ב־Vercel Analytics כדי למדוד תנועה ולקבל נתונים
                    סטטיסטיים על צפיות בעמודים ושימוש באתר. הנתונים משמשים להבנת
                    השימוש בבלוג, ולא כדי לזהות אותך בשמך. אין לי שום מידע חוץ ממדינה ושבקרו באתר.
                  </li>
                  <li>
                    <strong className="text-foreground">כתובת IP:</strong> בעת
                    שליחת טופס יצירת קשר, כתובת ה־IP שמגיעה עם הבקשה משמשת
                    להגבלת מספר ההודעות. היא נשמרת כמפתח במסד הנתונים יחד עם
                    מונה ותאריך איפוס. הרשומות נמחקות פעם בחודש.
                  </li>
                  <li>
                    <strong className="text-foreground">עוגיות:</strong> האתר
                    משתמש בעוגייה חיונית לניהול התחברות. לא נעשה שימוש בעוגיות
                    לצורכי פרסום.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">למה המידע נאסף</h3>
                <ul className="list-disc space-y-2 pe-6 text-(--muted)">
                  <li>כדי לאשר ולנהל גישה לאזור החברים.</li>
                  <li>כדי לקרוא ולהשיב להודעות ששלחת.</li>
                  <li>כדי להבין באופן כללי אם ואיך קוראים את הבלוג.</li>
                  <li>כדי למנוע שימוש לרעה בטופס יצירת הקשר.</li>
                </ul>
                <p className="text-(--muted)">
                  אני לא שולח דיוור, לא מוכר מידע ולא משתף אותו לצורכי פרסום.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">שירותים חיצוניים ואחסון</h3>
                <p className="text-(--muted)">
                  הבלוג נעזר ב־Google לצורך התחברות, Gmail למשלוח הודעות, ספק
                  PostgreSQL לאחסון נתוני האתר, Cloudinary לאחסון תמונות, Vercel
                  Analytics למדידת שימוש וספק האירוח של האתר. הספקים מעבדים מידע
                  לפי התנאים והמדיניות שלהם, וייתכן שחלקם שומרים או מעבדים אותו
                  מחוץ לישראל.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">כמה זמן המידע נשמר</h3>
                <ul className="list-disc space-y-2 pe-6 text-(--muted)">
                  <li>
                    פרטי חשבון נשמרים כל עוד החשבון קיים ונחוצים לניהול הגישה.
                    בקשות הרשמה שלא אושרו אינן נמחקות אוטומטית.
                  </li>
                  <li>
                    הודעות יצירת קשר נשמרות בתיבת Gmail, ולא נקבע להן מועד מחיקה
                    אוטומטי מצד האתר.
                  </li>
                  <li>
                    רשומות הגבלת הקצב וכתובות ה־IP שבהן נעשה שימוש נשמרות במסד
                    הנתונים ואינן נמחקות אוטומטית.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">הזכויות שלך</h3>
                <p className="text-(--muted)">
                  אפשר לבקש לעיין במידע שנשמר עליך, לתקן אותו או למחוק אותו דרך{" "}
                  <Link
                    className="font-bold text-(--leaf) underline underline-offset-4"
                    href="/contact"
                  >
                    טופס יצירת הקשר
                  </Link>
                  . משתמשים מחוברים יכולים למחוק את החשבון שלהם דרך עמוד
                  הפרופיל. מנהל האתר יכול למחוק חשבונות דרך מסך ניהול המשתמשים.
                  לאחר מחיקה, לא ניתן לשחזר את החשבון או את המידע שנשמר בו.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">אבטחה ושינויים</h3>
                <p className="text-(--muted)">
                  אני נוקט אמצעים סבירים לשמירה על המידע, ובהם הגבלת גישה וחיבור
                  מוצפן. אין מערכת מושלמת, ולכן אי אפשר להבטיח הגנה מוחלטת. אם
                  המדיניות תשתנה, הגרסה המעודכנת ותאריך העדכון יופיעו בעמוד הזה.
                </p>
              </div>
            </section>

            <section
              className="scroll-mt-24 space-y-8 border-t-2 border-dashed border-(--line) pt-10"
              id="terms"
              aria-labelledby="terms-heading"
            >
              <div className="space-y-3">
                <h2
                  className="font-serif text-3xl font-normal"
                  id="terms-heading"
                >
                  תנאי שימוש
                </h2>
                <p className="border-s-4 border-(--leaf) ps-4 text-(--muted)">
                  בקצרה: התוכן כאן שלי, אל תעתיקו אותו, ותהיו נחמדים. השימוש
                  באתר מהווה הסכמה לתנאים האלה.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">התוכן</h3>
                <p className="text-(--muted)">
                  הטקסטים באתר נכתבו על ידי ושייכים לי. מותר לצטט קטע קצר עם
                  קרדיט וקישור לפוסט. אין להעתיק פוסט שלם, לפרסם אותו במקום אחר
                  או להשתמש בו למטרה מסחרית בלי אישור מראש.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">אזור החברים</h3>
                <ul className="list-disc space-y-2 pe-6 text-(--muted)">
                  <li>
                    הגישה ניתנת באישור אישי. מותר לי לסרב לבקשת הצטרפות או לבטל
                    גישה בכל עת.
                  </li>
                  <li>
                    התוכן באזור החברים מיועד לחברים בלבד. אין לשתף, לצלם מסך או
                    להפיץ אותו הלאה. קיצר על תיהיו קקות
                  </li>
                  <li>
                    הסיפורים עוסקים באנשים אמיתיים וברגעים אישיים; יש להתייחס
                    אליהם בכבוד. השמות והזמנים שונו כדי לא לחשוף, כמו בחוק וסדר.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">מה התוכן כאן, ומה הוא לא</h3>
                <p className="text-(--muted)">
                  זה בלוג אישי. הדברים נכתבים מנקודת המבט שלי, כפי שאני זוכר
                  וחווה אותם, ולא בהכרח מתארים את המציאות באופן מלא או מדויק.
                  שום דבר באתר אינו ייעוץ מקצועי.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">אחריות ועדכונים</h3>
                <p className="text-(--muted)">
                  האתר והתוכן מוצעים כפי שהם (AS IS). בכפוף לדין, לא תהיה לי
                  אחריות לנזק שנגרם משימוש באתר או מהסתמכות על התוכן, או לתוכן
                  באתרים חיצוניים שמקושרים ממנו. התנאים עשויים להשתנות; הגרסה
                  המעודכנת ותאריך העדכון יפורסמו כאן.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">הדין החל</h3>
                <p className="text-(--muted)">
                  על התנאים האלה חלים דיני מדינת ישראל. סמכות השיפוט נתונה לבתי
                  המשפט המוסמכים בישראל.
                </p>
              </div>
            </section>

            <section
              className="scroll-mt-24 border-t-2 border-dashed border-(--line) pt-10"
              id="contact"
              aria-labelledby="contact-heading"
            >
              <h2
                className="mb-3 font-serif text-2xl font-normal"
                id="contact-heading"
              >
                יש שאלה?
              </h2>
              <p className="text-(--muted)">
                <Link
                  className="font-bold text-(--leaf) underline underline-offset-4"
                  href="/contact"
                >
                  כתבו לי דרך טופס יצירת הקשר
                </Link>
                , ואחזור אליכם כשאתפנה מהקופסא.
              </p>
            </section>
          </div>
        </article>
      </section>
    </div>
  );
}
