// --- Actions ---
import { getAllUsers, setUserStatus } from "@/lib/actions/user-actions";

// --- Prisma ---
import type { UserStatus } from "@/generated/prisma/enums";

const statusLabels: Record<UserStatus, string> = {
  APPROVED: "מאושר",
  PENDING: "ממתין",
  REJECTED: "נדחה",
  BANNED: "חסום",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  const adminEmail = process.env.ADMIN_EMAIL;

  return (
    <div className="grid gap-4">
      <h1 className="font-serif text-3xl">ניהול משתמשים</h1>

      <div className="overflow-x-auto rounded-sm border-2 border-dashed border-(--line)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-dashed border-(--line) text-right">
              <th className="p-3">משתמש</th>
              <th className="p-3">סטטוס נוכחי</th>
              <th className="p-3">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <UserPreview
                  key={user.id}
                  user={user}
                  adminEmail={adminEmail}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const UserPreview = ({
  user,
  adminEmail,
}: {
  user: Awaited<ReturnType<typeof getAllUsers>>[number];
  adminEmail?: string;
}) => {
  const isProtectedAdmin = user.email === adminEmail;

  return (
    <tr key={user.id} className="border-b border-dashed border-(--line)">
      <td className="p-3">
        <div className="font-bold">{user.name ?? user.email}</div>
        <div className="text-(--muted)">{user.email}</div>
      </td>
      <td className="p-3">{statusLabels[user.status]}</td>
      <td className="p-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(statusLabels) as UserStatus[]).map((status) => (
            <form
              key={status}
              action={setUserStatus.bind(null, user.id, status)}
            >
              <button
                type="submit"
                disabled={isProtectedAdmin || user.status === status}
                className="rounded-full border-2 border-dashed border-(--leaf) px-3 py-1 text-xs font-bold disabled:opacity-40"
              >
                {statusLabels[status]}
              </button>
            </form>
          ))}
        </div>
      </td>
    </tr>
  );
};
