import Link from "next/link";
import {
  archiveBlogPostAction,
  createBlogPostAction,
  deleteBlogPostAction,
  updateBlogPostAction,
} from "@/lib/actions/admin-blog";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function toDatetimeLocal(value?: Date | string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

type BlogPostFormProps = {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageUrl: string;
    authorName: string;
    seoTitle: string;
    seoDescription: string;
    status: string;
    publishedAt: Date;
    updatedAt?: Date;
  };
  successMessage?: string;
  errorMessage?: string;
};

export function BlogPostForm({ post, successMessage, errorMessage }: BlogPostFormProps) {
  const action = post ? updateBlogPostAction : createBlogPostAction;
  const publicPath = post ? `/blog/${post.slug}` : undefined;

  return (
    <div className="space-y-6">
      {successMessage ? <ActionMessage type="success" message={successMessage} /> : null}
      {errorMessage ? <ActionMessage type="error" message={errorMessage} /> : null}

      <form action={action} className="card-surface space-y-6 p-6">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">
              {post ? "Public preview and publishing" : "Create your public blog draft"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {post?.status === "PUBLISHED"
                ? "This post is public now. Use the preview link to verify the live page."
                : "Draft posts stay hidden from /blog and /blog/[slug] until you publish them."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              Open blog index
            </Link>
            {post?.status === "PUBLISHED" && publicPath ? (
              <Link
                href={publicPath}
                target="_blank"
                className="inline-flex items-center justify-center rounded-2xl border border-brand-200 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Preview public post
              </Link>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input name="title" defaultValue={post?.title} className={inputClass} required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Slug</span>
            <input name="slug" defaultValue={post?.slug} className={inputClass} required />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Author</span>
            <input
              name="authorName"
              defaultValue={post?.authorName}
              className={inputClass}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select name="status" defaultValue={post?.status ?? "PUBLISHED"} className={inputClass}>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Published at</span>
            <input
              type="datetime-local"
              name="publishedAt"
              defaultValue={toDatetimeLocal(post?.publishedAt)}
              className={inputClass}
              required
            />
          </label>
        </div>

        <AdminImageUploadField
          name="coverImageUrl"
          label="Cover image"
          defaultValue={post?.coverImageUrl}
          folder="blog"
          required
        />

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Excerpt</span>
          <textarea
            name="excerpt"
            rows={3}
            defaultValue={post?.excerpt}
            className={inputClass}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Content</span>
          <textarea
            name="content"
            rows={12}
            defaultValue={post?.content}
            className={inputClass}
            required
          />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">SEO title</span>
            <input
              name="seoTitle"
              defaultValue={post?.seoTitle}
              className={inputClass}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">SEO description</span>
            <textarea
              name="seoDescription"
              rows={4}
              defaultValue={post?.seoDescription}
              className={inputClass}
              required
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            {post?.updatedAt ? `Last updated: ${new Date(post.updatedAt).toLocaleString()}` : null}
          </div>
          <button
            type="submit"
            className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {post ? "Update blog post" : "Create blog post"}
          </button>
        </div>
      </form>

      {post ? (
        <div className="card-surface space-y-4 p-6">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
              Post actions
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Archive will switch the post back to draft and remove it from public blog pages.
              Delete permanently removes the record.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {post.status === "PUBLISHED" ? (
              <form action={archiveBlogPostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button
                  type="submit"
                  className="inline-flex rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                >
                  Archive to draft
                </button>
              </form>
            ) : null}
            <form action={deleteBlogPostAction}>
              <input type="hidden" name="id" value={post.id} />
              <button
                type="submit"
                className="inline-flex rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Delete post
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
