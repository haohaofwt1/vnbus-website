import Link from "next/link";
import { ContentStatus, Prisma } from "@prisma/client";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { prisma } from "@/lib/prisma";
import { buildPagination, formatDateTime } from "@/lib/utils";

function getPageMessage(searchParams: { saved?: string; archived?: string; deleted?: string; error?: string }) {
  if (searchParams.error) return { type: "error" as const, message: decodeURIComponent(searchParams.error) };
  if (searchParams.deleted) return { type: "success" as const, message: "Blog post deleted." };
  if (searchParams.archived) return { type: "success" as const, message: "Blog post archived as draft." };
  if (searchParams.saved) return { type: "success" as const, message: "Blog post saved." };
  return null;
}
function postWhere(q?: string, filter?: string): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = {};
  if (q) where.OR = [{ title: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }];
  if (filter === "published") where.status = ContentStatus.PUBLISHED;
  if (filter === "draft") where.status = ContentStatus.DRAFT;
  return where;
}
export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; filter?: string; groupBy?: string; saved?: string; archived?: string; deleted?: string; error?: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const perPage = 12;
  const where = postWhere(params.q, params.filter);
  const [total, posts, published] = await Promise.all([prisma.blogPost.count({ where }), prisma.blogPost.findMany({ where, skip: (currentPage - 1) * perPage, take: perPage, orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }] }), prisma.blogPost.count({ where: { status: ContentStatus.PUBLISHED } })]);
  const pagination = buildPagination(currentPage, total, perPage);
  const message = getPageMessage(params);
  return <div className="space-y-6"><AdminModuleHeader eyebrow="Content" title="Travel guide" description="Plan SEO articles, drafts, public previews and guide content operations." primaryAction={{ href: "/admin/blog/new", label: "New post" }} />
    {message ? <ActionMessage type={message.type} message={message.message} /> : null}
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Current view" value={total} /><AdminMetricCard label="Published" value={published} /><AdminMetricCard label="Drafts" value={Math.max(0, total - published)} /></section>
    <AdminListToolbar basePath="/admin/blog" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }]} groups={[{ label: "Status", value: "status" }, { label: "Author", value: "author" }]} views={[{ label: "List", value: "list" }]} />
    <DataTable columns={[{ key: "title", label: "Title" }, { key: "status", label: "Status" }, { key: "publishedAt", label: "Published" }, { key: "updatedAt", label: "Updated" }, { key: "action", label: "Action", align: "right" }]} rows={posts.map((post) => ({ title: <div><p className="font-black text-ink">{post.title}</p><p className="text-slate-500">{post.slug}</p></div>, status: <StatusBadge status={post.status} />, publishedAt: formatDateTime(post.publishedAt), updatedAt: formatDateTime(post.updatedAt), action: <div className="flex justify-end gap-3">{post.status === "PUBLISHED" ? <Link href={`/blog/${post.slug}`} target="_blank" className="font-black text-slate-600">Preview</Link> : null}<Link href={`/admin/blog/${post.id}/edit`} className="font-black text-brand-700">Edit</Link></div> }))} emptyMessage="No blog posts found." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/blog" }} />
  </div>;
}
