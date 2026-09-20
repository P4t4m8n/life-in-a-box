import { redirect } from "next/navigation";

// --- Auth ---
import { getSession } from "@/lib/auth";

// --- Components ---
import { StickerBadge } from "@/components/sticker-badge";
import { GoogleSignInButton } from "@/components/google-signin-button";

// Only relative, in-app paths are safe to redirect to — a bare "/" prefix can still be
// protocol-relative ("//evil.com"), so that's rejected too.
const isSafeRedirect = (url: string) =>
  url.startsWith("/") && !url.startsWith("//");

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getSession();
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl = callbackUrl && isSafeRedirect(callbackUrl) ? callbackUrl : "/";

  if (session) {
    redirect(safeCallbackUrl);
  }

  return (
    <div className="grid min-h-[65vh] place-items-center px-4 py-16 text-center">
      <div className="rotate-1 rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-8 py-10 shadow-md">
        <StickerBadge tone="leaf">כניסה</StickerBadge>
        <h1 className="my-4 -rotate-1 font-serif text-[clamp(2rem,6vw,3.5rem)] leading-none font-normal">
          כניסה עם חשבון Google
        </h1>
        <p className="mx-auto max-w-lg leading-[1.7] text-(--muted)">
          משתמשים חדשים ממתינים לאישור מנהל לפני קבלת גישה מלאה.
        </p>
        <GoogleSignInButton callbackUrl={safeCallbackUrl} />
      </div>
    </div>
  );
}
