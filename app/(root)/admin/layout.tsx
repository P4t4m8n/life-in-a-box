import Link from "next/link";
import type { ReactNode } from "react";

const tabs = [
  { href: "/admin/posts", label: "ניהול פוסטים" },
  { href: "/admin/users", label: "ניהול משתמשים" },
  { href: "/admin/editor", label: "עורך" },
];

export default function AdminLayout({
  posts,
  users,
  editor,
}: {
  posts: ReactNode;
  users: ReactNode;
  editor: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
      <nav className="flex flex-wrap gap-2 border-b-2 border-dashed border-(--line) pb-3">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-full border-2 border-dashed border-(--leaf) px-4 py-2 text-sm font-bold text-(--leaf) hover:bg-(--surface)"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {posts}
      {users}
      {editor}
    </div>
  );
}
