import { cache, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

// --- Icons ---
import { ArrowLeft, Clock3, Lock, Pin } from "lucide-react";

// --- Components ---
import { StickerBadge } from "@/components/sticker-badge";
import { PostCardSkeleton, Skeleton } from "@/components/skeleton";

// --- Actions ---
import {
  getLatestMemberPost,
  getMainPost,
  getPublicPosts,
} from "@/lib/actions/post-actions";

// --- Types ---
import { IPostDTO } from "@/types/app-types";

// Both the featured and the recent section need the main post (the latter to exclude
// it); cache() lets each stream independently while only hitting the DB once.
const getMainPostOnce = cache(getMainPost);

export default function Home() {
  return (
    <div className=" w-full bg-(--surface) bg-[linear-gradient(rgba(40,89,67,0.09)_1px,transparent_1px)] bg-size-[5000px_2.5rem]">
      <HeroSection />

      <Suspense fallback={<MainArticleSkeleton />}>
        <MainArticleSection />
      </Suspense>

      <Suspense fallback={<RecentlyPublishedSkeleton />}>
        <RecentlyPublishedSection />
      </Suspense>

      {/* <PopularSection /> */}

      <Suspense fallback={<PrivateSectionSkeleton />}>
        <PrivateSectionLoader />
      </Suspense>
    </div>
  );
}

async function MainArticleSection() {
  const mainPost = await getMainPostOnce();
  if (!mainPost) return null;
  return <MainArticle {...mainPost} />;
}

async function RecentlyPublishedSection() {
  const [mainPost, recentPosts] = await Promise.all([
    getMainPostOnce(),
    getPublicPosts({ sort: "newest", pageSize: 4 }),
  ]);

  const otherPosts = recentPosts
    .filter((post) => post.id !== mainPost?.id)
    .slice(0, 3);

  return <RecentlyPublished posts={otherPosts} />;
}

async function PrivateSectionLoader() {
  const post = await getLatestMemberPost();
  return <PrivateSection post={post} />;
}

const HeroSection = () => {
  return (
    <section
      className="border-b-2 border-dashed border-(--line) py-7 max-w-full "
      aria-labelledby="site-title"
    >
      <span className="grid gap-9 text-center justify-items-center p-4">
        <h1
          className="inline-block -rotate-2 font-serif text-6xl justify-self-center"
          id="site-title"
        >
          החיים בקופסא
        </h1>

        <p className="leading-[1.6] text-(--muted)">
          נתקעתי בקופסא כשהייתי קטן, מאז מנסה לצאת ממנה
        </p>
      </span>
    </section>
  );
};

const MainArticle = (post: IPostDTO) => {
  const { title, description, readingTime, imgSrc, imgAlt, id, tags } = post;

  return (
    <section
      className="relative isolate flex items-end overflow-hidden bg-foreground lg:mx-auto"
      aria-labelledby="featured-title"
    >
      <Image
        className="-z-2 object-cover object-[center_45%]"
        src={imgSrc || "/open-book.jpg"}
        alt={imgAlt || "Main article image"}
        fill
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 -z-1 bg-[linear-gradient(270deg,rgba(13,25,19,0.9),rgba(13,25,19,0.18)_72%)] max-[680px]:bg-[linear-gradient(0deg,rgba(13,25,19,0.94),rgba(13,25,19,0.12)_86%)]" />

      <div className="w-full px-4 py-8 text-white grid">
        <div className="flex items-center justify-between lg:justify-start gap-2.5">
          <StickerBadge rotationDirection="clockwise" tone="coral">
            {readingTime ? `${readingTime} דקות קריאה` : "קריאה קצרה"}
          </StickerBadge>
          <ul className="flex gap-2.5 flex-wrap justify-center">
            {tags &&
              tags.length > 0 &&
              tags.map((tag, idx) => (
                <StickerBadge
                  rotationDirection={
                    idx % 2 === 0 ? "clockwise" : "counterclockwise"
                  }
                  tone="coral"
                  key={tag.name}
                >
                  {tag.name}
                </StickerBadge>
              ))}
          </ul>
        </div>
        <h2
          className="my-4 rotate-1 font-serif text-[clamp(3rem,8vw,6.5rem)]  leading-[0.94] lg:leading-36 font-normal"
          id="featured-title"
        >
          {title}
        </h2>
        <p className=" text-[clamp(1rem,2vw,1.25rem)] leading-[1.7]">
          {description}
        </p>
        <Link href={`/posts/${id}`} className="">
          <span className="mt-5 inline-flex items-center gap-2.5 text-sm font-extrabold text-[#cce6d3]">
            קרא עוד
            <ArrowLeft aria-hidden="true" size={18} />
          </span>
        </Link>
      </div>
    </section>
  );
};

const cardRotations = ["-rotate-2", "rotate-2", "-rotate-1"];

// Mirrors MainArticle's padding and block sizes so the hero area doesn't jump on resolve.
const MainArticleSkeleton = () => (
  <section
    aria-busy="true"
    className="relative isolate flex items-end overflow-hidden bg-foreground lg:mx-auto"
  >
    <div className="w-full px-4 py-8 grid">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-7 w-28 bg-white/20" />
        <Skeleton className="h-7 w-20 bg-white/20" />
      </div>
      <Skeleton className="my-4 h-[clamp(3rem,8vw,6.5rem)] w-4/5 bg-white/20" />
      <Skeleton className="h-5 w-full max-w-2xl bg-white/20" />
      <Skeleton className="mt-2 h-5 w-2/3 max-w-xl bg-white/20" />
      <Skeleton className="mt-5 h-5 w-24 bg-white/20" />
    </div>
  </section>
);

const RecentlyPublishedSkeleton = () => (
  <section
    aria-busy="true"
    className="border-b-2 border-dashed border-(--line) py-[clamp(4rem,8vw,7rem)] lg:px-8"
  >
    <div className="mb-10 flex items-end justify-between gap-8 lg:grid px-8">
      <div className="grid gap-4">
        <StickerBadge tone="leaf">רשימות אחרונות</StickerBadge>
        <h2 className="-rotate-1 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-normal">
          פורסם או עודכן לאחרונה
        </h2>
      </div>
      <p className="m-0 max-w-sm leading-[1.7] text-(--muted) max-[680px]:mt-4">
        שטויות שפרסמתי או עדכנתי לאחרונה
      </p>
    </div>
    <div className="grid lg:grid-cols-3 px-4 lg:px-0 gap-6 grid-cols-1 items-center justify-center">
      {cardRotations.map((rotation) => (
        <PostCardSkeleton key={rotation} className={rotation} />
      ))}
    </div>
  </section>
);

const PrivateSectionSkeleton = () => (
  <section aria-busy="true" className="bg-(--sky) py-[clamp(4rem,8vw,7rem)]">
    <div className="mx-auto w-[calc(100%-2rem)] max-w-304">
      <div className="-rotate-1 rounded-sm border-2 border-dashed border-(--leaf)/50 p-[clamp(1.5rem,4vw,3rem)] shadow-lg grid gap-8">
        <Skeleton className="size-8" />
        <div className="grid gap-4">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-[clamp(2.4rem,5vw,4.5rem)] w-3/4" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-5 w-56" />
      </div>
    </div>
  </section>
);

const RecentlyPublished = ({ posts }: { posts: IPostDTO[] }) => {
  if (posts.length === 0) return null;

  return (
    <section
      className="border-b-2 border-dashed border-(--line) py-[clamp(4rem,8vw,7rem)] lg:px-8"
      id="latest"
      aria-labelledby="latest-title"
    >
      <div className="mb-10 flex items-end justify-between gap-8 lg:grid px-8">
        <div className="">
          <StickerBadge tone="leaf">רשימות אחרונות</StickerBadge>
          <h2
            className="mt-4 -rotate-1 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-normal"
            id="latest-title"
          >
          שטויות שפרסמתי או עדכנתי לאחרונה
          </h2>
        </div>
   
      </div>
      <div className="grid lg:grid-cols-3 px-4 lg:px-0  gap-6 grid-cols-1 items-center justify-center">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className={`group relative min-w-0   overflow-hidden rounded-sm border-2 border-(--surface) bg-(--surface) p-3 shadow-md transition-transform duration-300 hover:rotate-0 hover:shadow-lg ${
              cardRotations[index % cardRotations.length]
            }`}
          >
            <Pin
              aria-hidden="true"
              className={`absolute top-0 z-10 text-foreground f drop-shadow ${
                index % 2 === 0
                  ? "right-4 translate-x-1/2 rotate-45"
                  : " left-4 -translate-x-1/2 -rotate-45"
              }`}
              size={30}
            />
            <Link
              href={`/posts/${post.id}`}
              className="absolute inset-0 z-10"
              aria-label={post.title}
            />
            <div className="relative aspect-video overflow-hidden bg-(--sky)">
              <Image
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                src={post.imgSrc || "/open-book.jpg"}
                alt={post.imgAlt || post.title}
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </div>
            <div className="px-1 pt-4 pb-1">
              <p className="m-0 text-xs font-extrabold text-(--leaf)">
                {post.tags[0]?.name ?? "כללי"}
              </p>
              <h3 className="mt-2 mb-3 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] font-normal">
                {post.title}
              </h3>
              <p className="leading-[1.7] text-(--muted)">{post.description}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-(--muted)">
                <Clock3 aria-hidden="true" size={15} />{" "}
                {post.readingTime
                  ? `${post.readingTime} דקות קריאה`
                  : "קריאה קצרה"}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const PrivateSection = ({
  post,
}: {
  post: Awaited<ReturnType<typeof getLatestMemberPost>>;
}) => {
  if (!post) return null;

  const { title, description, imgSrc, imgAlt } = post;

  return (
    <section
      className="bg-(--sky) py-[clamp(4rem,8vw,7rem)]"
      aria-labelledby="recommended-title"
    >
      <div className="mx-auto w-[calc(100%-2rem)] max-w-304">
        <div className="relative -rotate-1 overflow-hidden rounded-sm border-2 border-dashed border-(--leaf)/50 p-[clamp(1.5rem,4vw,3rem)] shadow-lg">
          <Image
            className="-z-2 object-cover"
            src={imgSrc || "/open-book.jpg"}
            alt={imgAlt || title}
            fill
            sizes="(max-width: 900px) 100vw, 76rem"
          />
          <div className="absolute inset-0 -z-1 bg-(--surface)/90" />
          <div className="grid  items-center gap-8 max-[42.5rem]:grid-cols-1">
            <Lock className="text-(--leaf) " size={34} aria-hidden="true" />
            <div>
              <StickerBadge tone="leaf">לחברים בלבד</StickerBadge>
              <h2
                className="my-4 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-normal"
                id="recommended-title"
              >
                {title}
              </h2>
              <p className="mb-0 max-w-2xl leading-[1.7] text-foreground">
                {description || "התחברו כדי לקרוא את הפוסט הזה"}
              </p>
            </div>
            <Link href={`/posts/${post.id}`} className="">
              <span className="mt-5 inline-flex items-center gap-2.5 text-sm font-extrabold text-[#676b68]">
                המשך קריאה לחברים בלבד, רוצים להיות חברים שלי?
                <ArrowLeft aria-hidden="true" size={18} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
