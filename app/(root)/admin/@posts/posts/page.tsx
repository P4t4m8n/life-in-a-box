import {
  clearMainPost,
  clearRecommendedPost,
  getAdminPosts,
  setMainPost,
  setPostStatus,
  setRecommendedPost,
} from "@/lib/actions/post-control-actions";
import type { PostStatus } from "@/generated/prisma/enums";

const statusLabels: Record<PostStatus, string> = {
  DRAFT: "טיוטה",
  PUBLISHED: "פורסם",
  ARCHIVED: "הוסר",
};

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();

  return (
    <div className="grid gap-4">
      <h1 className="font-serif text-3xl">ניהול פוסטים</h1>

      <div className="overflow-x-auto rounded-sm border-2 border-dashed border-(--line)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-dashed border-(--line) text-right">
              <th className="p-3">כותרת</th>
              <th className="p-3">סטטוס</th>
              <th className="p-3">ראשי</th>
              <th className="p-3">מומלץ</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-dashed border-(--line)"
              >
                <td className="p-3 font-bold">{post.title}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(statusLabels) as PostStatus[]).map(
                      (status) => (
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
                      ),
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <form
                    action={
                      post.isMain
                        ? clearMainPost
                        : setMainPost.bind(null, post.id)
                    }
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
