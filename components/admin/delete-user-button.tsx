"use client";

export function DeleteUserButton({
  action,
  userEmail,
  disabled = false,
}: {
  action: () => Promise<void>;
  userEmail: string;
  disabled?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !confirm(
            `למחוק לצמיתות את החשבון של ${userEmail}? לא ניתן לשחזר אותו.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        disabled={disabled}
        className="rounded-full border-2 border-dashed border-(--coral-strong) px-3 py-1 text-xs font-bold text-(--coral-strong) disabled:opacity-40"
      >
        מחיקת חשבון
      </button>
    </form>
  );
}