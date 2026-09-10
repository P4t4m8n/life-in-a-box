"use client";

import { useActionState } from "react";

// --- Actions ---
import {
  sendContactMessage,
  type ContactFormState,
} from "@/lib/actions/contact-actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-bold">
          שם
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-4 py-3 outline-none focus:border-(--leaf)"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-bold">
          אימייל
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-4 py-3 outline-none focus:border-(--leaf)"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="subject" className="text-sm font-bold">
          נושא
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className="rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-4 py-3 outline-none focus:border-(--leaf)"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-bold">
          הודעה
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="resize-none rounded-sm border-2 border-dashed border-(--line) bg-(--surface) px-4 py-3 outline-none focus:border-(--leaf)"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm font-bold text-(--coral-strong)">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="text-sm font-bold text-(--leaf)">
          ההודעה נשלחה בהצלחה!
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-sm bg-(--leaf) px-5 font-extrabold text-white disabled:opacity-60"
      >
        {isPending ? "שולח..." : "שליחה"}
      </button>
    </form>
  );
}
