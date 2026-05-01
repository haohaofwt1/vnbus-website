import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { prisma } from "@/lib/prisma";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Edit blog post</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          Update the public metadata, content, and publish status from one simple form.
        </p>
      </div>
      <BlogPostForm
        post={post}
        successMessage={query.saved ? "Blog post saved." : undefined}
        errorMessage={query.error ? decodeURIComponent(query.error) : undefined}
      />
    </div>
  );
}
