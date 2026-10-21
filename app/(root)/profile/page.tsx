import Image from "next/image";
import { redirect } from "next/navigation";

// --- Auth ---
import { getSession } from "@/lib/auth";

// --- Components ---
import { StickerBadge } from "@/components/sticker-badge";
import { SignOutButton } from "@/components/sign-out-button";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { deleteOwnAccount } from "@/lib/actions/user-actions";

// --- Prisma ---
import { Role, UserStatus } from "@/generated/prisma/enums";

const statusLabels: Record<UserStatus, string> = {
  APPROVED: "מאושר",
  PENDING: "ממתין לאישור",
  REJECTED: "נדחה",
  BANNED: "חסום",
};

const statusTone: Record<UserStatus, "leaf" | "coral" | "light"> = {
  APPROVED: "leaf",
  PENDING: "light",
  REJECTED: "coral",
  BANNED: "coral",
};

const roleLabels: Record<Role, string> = {
  ADMIN: "מנהל",
  USER: "משתמש",
};

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  const { user } = session;

  return (
    <div className="mx-auto grid max-w-lg gap-6 px-4 py-16 text-center">
      <div className="rotate-1 rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-8 py-10 shadow-md">
        {user.image && (
          <Image
            src={user.image}
            alt=""
            width={96}
            height={96}
            className="mx-auto size-24 rounded-full object-cover"
          />
        )}

        <h1 className="my-4 -rotate-1 font-serif text-[clamp(2rem,6vw,3rem)] leading-none font-normal">
          {user.name ?? user.email}
        </h1>

        <p className="text-(--muted)">{user.email}</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <StickerBadge tone={statusTone[user.status]}>
            {statusLabels[user.status]}
          </StickerBadge>
          <StickerBadge tone="light">{roleLabels[user.role]}</StickerBadge>
        </div>

        {user.status === UserStatus.PENDING && (
          <p className="mx-auto mt-4 max-w-sm leading-[1.7] text-(--muted)">
            ממתין לאישור, נעדכן שהקופסא תתפנה{" "}
          </p>
        )}

        {user.status === UserStatus.REJECTED && (
          <p className="mx-auto mt-4 max-w-sm leading-[1.7] text-(--muted)">
            הבקשה שלך נדחתה. פנה למנהל האתר לפרטים נוספים.
          </p>
        )}

        {user.status === UserStatus.BANNED && (
          <p className="mx-auto mt-4 max-w-sm leading-[1.7] text-(--muted)">
            החשבון שלך נחסם. פנה למנהל האתר לפרטים נוספים.
          </p>
        )}

        <SignOutButton className="mt-6 inline-flex min-h-11 items-center justify-center rounded-sm bg-(--leaf) px-5 py-3 font-extrabold text-white no-underline" />
        <div className="mt-8 border-t border-dashed border-(--line) pt-6">
          <DeleteAccountButton action={deleteOwnAccount} />
        </div>
      </div>
    </div>
  );
}
