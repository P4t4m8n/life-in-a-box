import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { StickerBadge } from "@/components/sticker-badge";
import { GoogleSignInButton } from "@/components/google-signin-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = await searchParams;

  if (session) {
    redirect(callbackUrl ?? "/");
  }

  return (
    <div className="grid min-h-[65vh] place-items-center px-4 py-16 text-center">
      <div className="rotate-1 rounded-sm border-2 border-dashed border-(--line) bg-white px-8 py-10 shadow-md">
        <StickerBadge tone="leaf">כניסה</StickerBadge>
        <h1 className="my-4 -rotate-1 font-serif text-[clamp(2rem,6vw,3.5rem)] leading-none font-normal">
          כניסה עם חשבון Google
        </h1>
        <p className="mx-auto max-w-lg leading-[1.7] text-(--muted)">
          משתמשים חדשים ממתינים לאישור מנהל לפני קבלת גישה מלאה.
        </p>
        <GoogleSignInButton callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
