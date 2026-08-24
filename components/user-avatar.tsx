import Image from "next/image";
import Link from "next/link";

export function UserAvatar({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <Link
      href="/profile"
      aria-label="הפרופיל שלי"
      className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-(--leaf) bg-(--surface) text-xs font-extrabold text-(--leaf)"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          width={32}
          height={32}
          className="size-full object-cover"
        />
      ) : (
        initial
      )}
    </Link>
  );
}
