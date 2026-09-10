import { getServerSession } from "next-auth";
import Link from "next/link";

// --- Auth ---
import { authOptions } from "@/lib/auth";

// --- Components ---
import { SignOutButton } from "./sign-out-button";
import { UserAvatar } from "./user-avatar";
import { LogoSVG } from "./Icons/LogoSVG";
import { MobileNav } from "./mobile-nav";

const navigation = [
  { href: "/", label: "ראשי" },
  { href: "/posts", label: "פוסטים" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "יצירת קשר" },
];

export async function SiteHeader() {
  const session = await getServerSession(authOptions);

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
        {session ? (
          <li className="flex items-center gap-2 text-sm font-bold">
            <SignOutButton className="hover:underline" />
            <UserAvatar name={session.user.name} image={session.user.image} />
          </li>
        ) : (
          <li className="text-sm font-bold hover:underline">
            <Link href="/login">כניסה</Link>
          </li>
        )}
      </MobileNav>
    </header>
  );
}
