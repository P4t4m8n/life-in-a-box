import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock3, Pin } from "lucide-react";

import { StickerBadge } from "@/components/sticker-badge";
import { articles, type Article } from "@/lib/fixtures/articles";
import { getMainPost } from "@/lib/actions/post-actions";
import { IPostDTO } from "@/interfaces/interfaces";

const [mainArticle, ...otherArticles] = articles;

export default async function Home() {
  const mainPost = await getMainPost();
  return (
    <div>
      <HeroSection />

      <MainArticle {...mainPost!} />

      <RecentlyPublished />

      {/* <PopularSection /> */}

      <RecommendedSection />
    </div>
  );
}

const HeroSection = () => {
  return (
    <section
      className="border-b-2 border-dashed border-(--line) bg-(--surface) bg-[linear-gradient(rgba(40,89,67,0.09)_1px,transparent_1px)] bg-size-[100%_2.5rem] py-7 max-w-full "
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
          נתקעתי בקופסא שהייתי קטן, מאז מנסה לצאת ממנה
        </p>
      </span>
    </section>
  );
};

const MainArticle = ({
  title,
  description,
  readingTime,
  imgSrc,
  imgAlt,
  id,
}: IPostDTO) => {
  return (
    <section
      className="relative isolate flex items-end overflow-hidden bg-foreground"
      aria-labelledby="featured-title"
    >
      <Image
        className="-z-2 object-cover object-[center_45%]"
        src={imgSrc || "/images/placeholder.jpg"}
        alt={imgAlt || "Main article image"}
        fill
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 -z-1 bg-[linear-gradient(270deg,rgba(13,25,19,0.9),rgba(13,25,19,0.18)_72%)] max-[680px]:bg-[linear-gradient(0deg,rgba(13,25,19,0.94),rgba(13,25,19,0.12)_86%)]" />

      <div className="w-full px-4 py-8 text-white grid">
        <StickerBadge rotationDirection="clockwise" tone="light">
          {readingTime}
        </StickerBadge>
        <h2
          className="my-4 rotate-1 font-serif text-[clamp(3rem,8vw,6.5rem)]  leading-[0.94] font-normal"
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

const RecentlyPublished = () => {
  return (
    <section
      className="border-b-2 border-dashed border-(--line) py-[clamp(4rem,8vw,7rem)]"
      id="latest"
      aria-labelledby="latest-title"
    >
      <div className="mx-auto w-[calc(100%-2rem)] max-w-304">
        <div className="mb-10 flex items-end justify-between gap-8 max-[680px]:block">
          <div>
            <StickerBadge tone="leaf">רשימות אחרונות</StickerBadge>
            <h2
              className="mt-4 -rotate-1 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-normal"
              id="latest-title"
            >
              פורסם לאחרונה
            </h2>
          </div>
          <p className="m-0 max-w-sm leading-[1.7] text-(--muted) max-[680px]:mt-4">
            שטויות שפירסמתי לאחרונה
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
          {otherArticles.map((article, index) => (
            <article
              key={article._id}
              className={`group relative min-w-0 overflow-hidden rounded-sm border-2 border-white bg-white p-3 shadow-md transition-transform duration-300 hover:rotate-0 hover:shadow-lg ${
                cardRotations[index % cardRotations.length]
              }`}
            >
              <Pin
                aria-hidden="true"
                className={`absolute top-0 z-10 text-black f drop-shadow ${
                  index % 2 === 0
                    ? "right-4 translate-x-1/2 rotate-45"
                    : " left-4 -translate-x-1/2 -rotate-45"
                }`}
                size={30}
              />
              <Link
                href={`/articles/${article._id}`}
                className="absolute inset-0 z-10"
                aria-label={article.title}
              />
              <div className="relative aspect-video overflow-hidden bg-(--sky)">
                <Image
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  src={article.imgSrc}
                  alt={article.imgAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <div className="px-1 pt-4 pb-1">
                <p className="m-0 text-xs font-extrabold text-(--leaf)">
                  {article.category}
                </p>
                <h3 className="mt-2 mb-3 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] font-normal">
                  {article.title}
                </h3>
                <p className="leading-[1.7] text-(--muted)">
                  {article.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-(--muted)">
                  <Clock3 aria-hidden="true" size={15} /> {article.readingTime}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const RecommendedSection = () => {
  return (
    <section
      className="bg-(--sky) py-[clamp(4rem,8vw,7rem)]"
      aria-labelledby="recommended-title"
    >
      <div className="mx-auto w-[calc(100%-2rem)] max-w-304">
        <div className="relative -rotate-1 rounded-sm border-2 border-dashed border-(--leaf)/50 bg-white p-[clamp(1.5rem,4vw,3rem)] shadow-lg">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-8 max-[680px]:grid-cols-1">
            <BookOpen className="text-(--leaf) " size={34} aria-hidden="true" />
            <div>
              <StickerBadge tone="leaf">מקום טוב להכנס לקופסא</StickerBadge>
              <h2
                className="my-4 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-normal"
                id="recommended-title"
              >
                מקום טוב להתחיל בו
              </h2>
              <p className="mb-0 max-w-2xl leading-[1.7] text-foreground">
                העורך יבחר כאן מסות מומלצות, לצד הערה קצרה על הסיבה שכל אחת מהן
                חשובה.
              </p>
            </div>
            <Link
              className="inline-flex min-h-11 items-center gap-2.5 font-extrabold text-(--leaf) underline decoration-2 underline-offset-5 max-[680px]:justify-self-start"
              href="/about"
            >
              על כתב העת <ArrowLeft aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
