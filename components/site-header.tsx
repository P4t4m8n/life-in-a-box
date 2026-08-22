import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

const navigation = [
  { href: "/", label: "ראשי" },
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
            <Logo />
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
        <li className="text-sm font-bold hover:underline">
          {session ? (
            <SignOutButton />
          ) : (
            <Link href="/login">כניסה</Link>
          )}
        </li>
      </MobileNav>
    </header>
  );
}
