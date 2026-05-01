import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getBlogPostBySlug } from "@/lib/data";
import { resolveLocale, withLang } from "@/lib/i18n";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatDate, splitParagraphs } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPostBySlug(slug);

  if (!data) {
    return buildMetadata({
      title: "Blog post not found",
      description: "The requested blog post could not be found.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: data.post.seoTitle,
    description: data.post.seoDescription,
    path: `/blog/${data.post.slug}`,
    image: data.post.coverImageUrl,
  });
}

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const data = await getBlogPostBySlug(slug);

  if (!data) {
    notFound();
  }

  const copy = {
    en: {
      home: "Home",
      blog: "Blog",
      related: "Related articles",
      read: "Read article",
    },
    vi: {
      home: "Trang chủ",
      blog: "Cẩm nang",
      related: "Bài viết liên quan",
      read: "Đọc bài viết",
    },
    ko: {
      home: "홈",
      blog: "블로그",
      related: "관련 글",
      read: "기사 읽기",
    },
    ja: {
      home: "ホーム",
      blog: "ブログ",
      related: "関連記事",
      read: "記事を読む",
    },
  }[locale];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: copy.home, path: "/" },
    { name: copy.blog, path: "/blog" },
    { name: data.post.title, path: `/blog/${data.post.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="section-space">
        <div className="container-shell space-y-10">
          <Breadcrumbs
            items={[
              { label: copy.home, href: withLang("/", locale) },
              { label: copy.blog, href: withLang("/blog", locale) },
              { label: data.post.title },
            ]}
          />

          <article className="card-surface overflow-hidden p-8 sm:p-10 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-700">
              {formatDate(data.post.publishedAt)}
            </p>
            <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {data.post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{data.post.excerpt}</p>
            <div className="mt-10 space-y-6 text-base leading-8 text-muted">
              {splitParagraphs(data.post.content).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>

          <section className="space-y-5">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-ink">
              {copy.related}
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {data.relatedPosts.map((post) => (
                <article key={post.id} className="card-surface p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                    {post.title}
                  </h3>
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
          </section>
        </div>
      </section>
    </>
  );
}
