import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function NewBlogPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Create blog post</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          New blog post
        </h1>
        <p className="mt-3 text-sm text-muted">
          Drafts stay hidden from public blog pages until you publish them.
        </p>
      </div>
      <BlogPostForm errorMessage={params.error ? decodeURIComponent(params.error) : undefined} />
    </div>
  );
}
