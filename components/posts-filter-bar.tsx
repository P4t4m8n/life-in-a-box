"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";

export function PostsFilterBar({ tags }: { tags: string[] }) {
  const searchParams = useSearchParams();

  const inputsClassName =
    "rounded-sm border-2 border-(--line) bg-(--surface) p-2  h-12 text-sm transition-colors focus:outline-none focus:border-blue-500";

  return (
    <Form action="/posts" className="grid lg:grid-cols-2 gap-2 lg:gap-32 pb-8 ">
      <input
        type="search"
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="חיפוש לפי שם..."
        className={inputsClassName + " px-4 py-2"}
      />

      <div className="flex flex-wrap w-full justify-between lg:justify-start lg:gap-6 h-auto">
        <select
          name="tag"
          defaultValue={searchParams.get("tag") ?? ""}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className={inputsClassName + " w-[calc(50%-0.5rem)] lg:w-auto"}
        >
          <option value="">כל התגיות</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className={inputsClassName + " w-[calc(50%-0.5rem)] lg:w-auto"}
        >
          <option value="newest">עודכנו לאחרונה</option>
          <option value="oldest">עודכנו מזמן</option>
        </select>

        <button
          type="submit"
          className={
            "basis-full sm:basis-auto rounded-sm border-2 border-(--leaf) bg-(--leaf) px-4 py-2 text-sm font-bold text-white mt-4 lg:mt-0"
          }
        >
          חיפוש
        </button>
      </div>
    </Form>
  );
}
