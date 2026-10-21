"use client";

import { signOut } from "next-auth/react";

export function DeleteAccountButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={async () => {
        await action();
        await signOut({ callbackUrl: "/" });
      }}
      onSubmit={(event) => {
        if (!confirm("למחוק את החשבון שלך לצמיתות? לא ניתן לשחזר אותו.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="min-h-11 rounded-sm border-2 border-dashed border-(--coral-strong) px-4 py-2 font-bold text-(--coral-strong)"
      >
        מחיקת החשבון שלי
      </button>
    </form>
  );
}