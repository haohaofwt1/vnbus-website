import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { getBlogListingData } from "@/lib/data";
import { resolveLocale, withLang } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Travel guide and booking advice",
  description:
    "Route guides, travel tips, and transport planning articles for Vietnam and Southeast Asia.",
  path: "/blog",
});

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const posts = await getBlogListingData();
  const copy = {
    en: {
      eyebrow: "Blog",
      title: "Travel planning content built for route discovery",
      description:
        "Blog posts are stored in PostgreSQL and rendered with page-level SEO metadata for long-tail organic visibility.",
      guide: "Travel guide",
      read: "Read article",
    },
    vi: {
      eyebrow: "Cẩm nang",
      title: "Nội dung hỗ trợ lên kế hoạch di chuyển và khám phá tuyến",
      description:
        "Bài viết blog được lưu trong PostgreSQL và render với metadata riêng theo từng trang để hỗ trợ SEO dài hạn.",
      guide: "Cẩm nang di chuyển",
      read: "Đọc bài viết",
    },
    ko: {
      eyebrow: "블로그",
      title: "노선 탐색을 돕는 여행 계획 콘텐츠",
      description:
        "블로그 글은 PostgreSQL에 저장되며 롱테일 검색 유입을 위한 페이지 단위 SEO 메타데이터로 렌더링됩니다.",
      guide: "여행 가이드",
      read: "기사 읽기",
    },
    ja: {
      eyebrow: "ブログ",
      title: "路線探しを支える旅行計画コンテンツ",
      description:
        "ブログ記事は PostgreSQL に保存され、ロングテールSEO向けのページ単位メタデータで表示されます。",
      guide: "旅行ガイド",
      read: "記事を読む",
    },
  }[locale];

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="card-surface p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-700">
                {copy.guide}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-ink">
                {post.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">{post.excerpt}</p>
              <Link
                href={withLang(`/blog/${post.slug}`, locale)}
                className="mt-6 inline-flex text-sm font-semibold text-brand-700 transition hover:text-brand-800"
              >
                {copy.read}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
