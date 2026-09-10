import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// --- Auth ---
import { authOptions } from "@/lib/auth";

// --- Components ---
import { StickerBadge } from "@/components/sticker-badge";
import { SignOutButton } from "@/components/sign-out-button";

export default async function PendingApprovalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.status === "REJECTED" || session.user.status === "BANNED") {
    return (
      <div className="grid min-h-[65vh] place-items-center px-4 py-16 text-center">
        <div className="rotate-1 rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-8 py-10 shadow-md">
          <StickerBadge tone="coral">גישה נדחתה</StickerBadge>
          <h1 className="my-4 -rotate-1 font-serif text-[clamp(2rem,6vw,3.5rem)] leading-none font-normal">
            אין לך גישה לחשבון זה
          </h1>
          <SignOutButton className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm bg-(--leaf) px-5 py-3 font-extrabold text-white no-underline" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-[65vh] place-items-center px-4 py-16 text-center">
      <div className="rotate-1 rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-8 py-10 shadow-md">
        <StickerBadge tone="leaf">תקוע בקופסא</StickerBadge>
        <h1 className="my-4 -rotate-1 font-serif text-[clamp(2rem,6vw,3.5rem)] leading-none font-normal">
          בודק אם יש קופסא פנויה{" "}
        </h1>
        <p className="mx-auto max-w-lg leading-[1.7] text-(--muted)">
          נעדכן אותך ברגע שאחד השכנים יזרוק קופסא של מקרר{" "}
        </p>
        <SignOutButton className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm bg-(--leaf) px-5 py-3 font-extrabold text-white no-underline" />
      </div>
    </div>
  );
}
