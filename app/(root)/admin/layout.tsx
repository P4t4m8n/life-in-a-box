import type { ReactNode } from "react";

// --- Components ---
import { AdminTabs } from "@/components/admin/admin-tabs";

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
    <div className="mx-auto grid max-w-full gap-6 px-4 py-8">
      <AdminTabs posts={posts} users={users} editor={editor} />
    </div>
  );
}
