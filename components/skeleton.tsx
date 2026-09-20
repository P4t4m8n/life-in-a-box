import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx("animate-pulse rounded-sm bg-(--line)/60", className)}
    />
  );
}

// Same box model as the post cards on the homepage and /posts, so the list
// doesn't shift when the real cards stream in.
export function PostCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "grid gap-2 overflow-hidden rounded-sm border-2 border-(--surface) bg-(--surface) p-3 shadow-md",
        className,
      )}
    >
      <Skeleton className="aspect-video w-full" />
      <div className="grid gap-3 px-1 pt-4 pb-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-3 h-3 w-24" />
      </div>
    </div>
  );
}
