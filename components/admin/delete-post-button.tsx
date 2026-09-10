"use client";

export function DeletePostButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("למחוק את הפוסט לצמיתות? לא ניתן לשחזר פעולה זו.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border-2 border-dashed border-(--coral-strong) px-3 py-1 text-xs font-bold text-(--coral-strong)"
      >
        מחיקה
      </button>
    </form>
  );
}
