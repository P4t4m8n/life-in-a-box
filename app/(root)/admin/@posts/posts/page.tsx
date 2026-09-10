import Link from "next/link";

// --- Actions ---
import {
  clearMainMemberPost,
  clearMainPost,
  clearRecommendedPost,
  deletePost,
  getAdminPosts,
  setMainMemberPost,
  setMainPost,
  setPostAccessLevel,
  setPostStatus,
  setRecommendedPost,
} from "@/lib/actions/post-control-actions";

// --- Types ---
import type { IAdminPostRow } from "@/lib/actions/post-control-actions";

// --- Prisma ---
import type { AccessLevel, PostStatus } from "@/generated/prisma/enums";

// --- Components ---
import { DeletePostButton } from "@/components/admin/delete-post-button";

const statusLabels: Record<PostStatus, string> = {
  DRAFT: "טיוטה",
  PUBLISHED: "פורסם",
  ARCHIVED: "ארכיון",
};

const accessLevelLabels: Record<AccessLevel, string> = {
  PUBLIC: "ציבורי",
  USER: "למנויים",
  PRIVATE: "פרטי",
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const { posts, totalPages } = await getAdminPosts(page);

  return (
    <div className="grid gap-4">
      <h1 className="font-serif text-3xl">ניהול פוסטים</h1>

      <div className="overflow-x-auto rounded-sm border-2 border-dashed border-(--line)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-dashed border-(--line) text-right">
              <th className="p-3">כותרת</th>
              <th className="p-3">סטטוס</th>
              <th className="p-3">רמת גישה</th>
              <th className="p-3">ראשי</th>
              <th className="p-3">ראשי לחברים</th>
              <th className="p-3">מומלץ</th>
              <th className="p-3"></th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <PostPreview post={post} key={post.id} />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </div>
  );
}

const Pagination = ({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) => {
  return (
    <nav
      aria-label="ניווט בין עמודים"
      className="flex items-center justify-center gap-4"
    >
      {page > 1 ? (
        <Link href={`/admin/posts?page=${page - 1}`} className="underline">
          הקודם
        </Link>
      ) : (
        <span className="text-(--muted)">הקודם</span>
      )}
      <span className="text-(--muted)">
        עמוד {page} מתוך {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={`/admin/posts?page=${page + 1}`} className="underline">
          הבא
        </Link>
      ) : (
        <span className="text-(--muted)">הבא</span>
      )}
    </nav>
  );
};

const PostPreview = ({ post }: { post: IAdminPostRow }) => {
  return (
    <tr key={post.id} className="border-b border-dashed border-(--line)">
      <td className="p-3 font-bold">{post.title}</td>
      <td className="p-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(statusLabels) as PostStatus[]).map((status) => (
            <form
              key={status}
              action={setPostStatus.bind(null, post.id, status)}
            >
              <button
                type="submit"
                disabled={post.status === status}
                className="rounded-full border-2 border-dashed border-(--leaf) px-3 py-1 text-xs font-bold disabled:opacity-40"
              >
                {statusLabels[status]}
              </button>
            </form>
          ))}
        </div>
      </td>
      <td className="p-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(accessLevelLabels) as AccessLevel[]).map((level) => (
            <form
              key={level}
              action={setPostAccessLevel.bind(null, post.id, level)}
            >
              <button
                type="submit"
                disabled={post.accessLevel === level}
                className="rounded-full border-2 border-dashed border-(--leaf) px-3 py-1 text-xs font-bold disabled:opacity-40"
              >
                {accessLevelLabels[level]}
              </button>
            </form>
          ))}
        </div>
      </td>
      <td className="p-3">
        <form
          action={post.isMain ? clearMainPost : setMainPost.bind(null, post.id)}
        >
          <button
            type="submit"
            className="rounded-full border-2 border-dashed border-(--leaf) px-3 py-1 text-xs font-bold"
          >
            {post.isMain ? "הסרה מראשי" : "הפוך לראשי"}
          </button>
        </form>
      </td>
      <td className="p-3">
        <form
          action={
            post.isMainMember
              ? clearMainMemberPost
              : setMainMemberPost.bind(null, post.id)
          }
        >
          <button
            type="submit"
            className="rounded-full border-2 border-dashed border-(--leaf) px-3 py-1 text-xs font-bold"
          >
            {post.isMainMember ? "הסרה מראשי לחברים" : "הפוך לראשי לחברים"}
          </button>
        </form>
      </td>
      <td className="p-3">
        <form
          action={
            post.isRecommended
              ? clearRecommendedPost
              : setRecommendedPost.bind(null, post.id)
          }
        >
          <button
            type="submit"
            className="rounded-full border-2 border-dashed border-(--leaf) px-3 py-1 text-xs font-bold"
          >
            {post.isRecommended ? "הסרה ממומלץ" : "הפוך למומלץ"}
          </button>
        </form>
      </td>
      <td className="p-3">
        <Link
          href={`/admin/editor?id=${post.id}`}
          className="rounded-full border-2 border-dashed border-(--leaf) px-3 py-1 text-xs font-bold"
        >
          עריכה
        </Link>
      </td>
      <td className="p-3">
        <DeletePostButton action={deletePost.bind(null, post.id)} />
      </td>
    </tr>
  );
};
