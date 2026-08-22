"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/" })}
      className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-(--leaf) px-5 py-3 font-extrabold text-white no-underline"
    >
      המשך עם Google
    </button>
  );
}
