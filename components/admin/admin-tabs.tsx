"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const tabs = [
  { href: "/admin/posts", label: "ניהול פוסטים" },
  { href: "/admin/users", label: "ניהול משתמשים" },
  { href: "/admin/editor", label: "עורך" },
];

export function AdminTabs({
  posts,
  users,
  editor,
}: {
  posts: ReactNode;
  users: ReactNode;
  editor: ReactNode;
}) {
  const pathname = usePathname();

  const activeSlot = pathname.startsWith("/admin/users")
    ? users
    : pathname.startsWith("/admin/editor")
      ? editor
      : posts;

  return (
    <>
      <nav className="flex flex-wrap gap-2 border-b-2 border-dashed border-(--line) pb-3">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full border-2 border-dashed border-(--leaf) px-4 py-2 text-sm font-bold text-(--leaf) hover:bg-(--surface) ${
                isActive ? "bg-(--leaf) text-white" : ""
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {activeSlot}
    </>
  );
}
