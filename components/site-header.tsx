import { Suspense } from "react";
import Link from "next/link";

// --- Auth ---
import { getSession } from "@/lib/auth";

// --- Components ---
import { SignOutButton } from "./sign-out-button";
import { UserAvatar } from "./user-avatar";
import { LogoSVG } from "./Icons/LogoSVG";
import { MobileNav } from "./mobile-nav";
import { Skeleton } from "./skeleton";

const navigation = [
  { href: "/", label: "ראשי" },
  { href: "/posts", label: "פוסטים" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "יצירת קשר" },
];

export function SiteHeader() {
  return (
    <header className="p-4 z-10">
      <MobileNav
        logo={
          <>
            <LogoSVG />
            <strong className="">החיים בקופסא </strong>
          </>
        }
      >
        {navigation.map((item) => (
          <li key={item.href} className="text-sm font-bold hover:underline">
            <Link className="" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
        {/* Only the session-dependent slot waits on the request; the rest of the header ships immediately. */}
        <Suspense fallback={<AuthNavFallback />}>
          <AuthNav />
        </Suspense>
      </MobileNav>
    </header>
  );
}

async function AuthNav() {
  const session = await getSession();

  if (!session) {
    return (
      <li className="text-sm font-bold hover:underline">
        <Link href="/login">כניסה</Link>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 text-sm font-bold">
      <SignOutButton className="hover:underline" />
      <UserAvatar name={session.user.name} image={session.user.image} />
    </li>
  );
}

// Reserves the width of "כניסה" / the avatar so the nav doesn't jump when the session resolves.
const AuthNavFallback = () => (
  <li className="flex items-center">
    <Skeleton className="size-8 rounded-full" />
  </li>
);
