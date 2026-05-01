import Link from "next/link";
import { Prisma, ReviewStatus } from "@prisma/client";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { updateReviewVisibilityAction } from "@/lib/actions/admin-reviews";
import { prisma } from "@/lib/prisma";

function getScopeLabel(review: { route: { fromCity: { name: string }; toCity: { name: string } } | null; operator: { name: string } | null }) {
  if (review.route) return `${review.route.fromCity.name} to ${review.route.toCity.name}`;
  if (review.operator) return review.operator.name;
  return "General";
}
function reviewWhere(q?: string, filter?: string): Prisma.ReviewWhereInput {
  const where: Prisma.ReviewWhereInput = {};
  if (q) where.OR = [{ customerName: { contains: q, mode: "insensitive" } }, { comment: { contains: q, mode: "insensitive" } }, { bookingRequest: { customerEmail: { contains: q, mode: "insensitive" } } }];
  if (filter === "published") where.status = ReviewStatus.PUBLISHED;
  if (filter === "pending") where.status = ReviewStatus.PENDING;
  if (filter === "hidden") where.status = ReviewStatus.HIDDEN;
  if (filter === "high-rating") where.rating = { gte: 5 };
  if (filter === "low-rating") where.rating = { lte: 3 };
  return where;
}
export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string; statusUpdated?: string; deleted?: string; error?: string; q?: string; filter?: string; groupBy?: string }> }) {
  const params = await searchParams;
  const where = reviewWhere(params.q, params.filter);
  const [reviews, routes, operators, bookingRequests, review, total, pending, published] = await Promise.all([
    prisma.review.findMany({ where, include: { bookingRequest: true, route: { include: { fromCity: true, toCity: true } }, operator: true }, orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }] }),
    prisma.route.findMany({ include: { fromCity: true, toCity: true }, orderBy: { slug: "asc" } }), prisma.operator.findMany({ orderBy: { name: "asc" } }),
    prisma.bookingRequest.findMany({ where: { status: { in: ["CONFIRMED", "COMPLETED"] } }, include: { review: { select: { id: true } } }, orderBy: { updatedAt: "desc" }, take: 200 }),
    params.edit ? prisma.review.findUnique({ where: { id: params.edit } }) : Promise.resolve(null), prisma.review.count({ where }), prisma.review.count({ where: { status: ReviewStatus.PENDING } }), prisma.review.count({ where: { status: ReviewStatus.PUBLISHED } }),
  ]);
  return <div className="space-y-6"><AdminModuleHeader eyebrow="Trust" title="Reviews" description="Moderate customer reviews, approve strong social proof and hide low quality submissions." />
    {params.saved ? <ActionMessage type="success" message="Review saved." /> : null}{params.statusUpdated ? <ActionMessage type="success" message="Review status updated." /> : null}{params.deleted ? <ActionMessage type="success" message="Review deleted." /> : null}{params.error === "invalid-status" ? <ActionMessage type="error" message="Invalid review status." /> : null}
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Current view" value={total} /><AdminMetricCard label="Pending" value={pending} /><AdminMetricCard label="Published" value={published} /></section>
    <AdminListToolbar basePath="/admin/reviews" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Pending", value: "pending" }, { label: "Published", value: "published" }, { label: "Hidden", value: "hidden" }, { label: "5-star", value: "high-rating" }, { label: "Low rating", value: "low-rating" }]} groups={[{ label: "Status", value: "status" }, { label: "Route", value: "route" }, { label: "Operator", value: "operator" }]} views={[{ label: "List", value: "list" }]} />
    <ReviewForm review={review ?? undefined} routes={routes} operators={operators} bookingRequests={bookingRequests} />
    <DataTable columns={[{ key: "customer", label: "Customer" }, { key: "scope", label: "Scope" }, { key: "rating", label: "Rating" }, { key: "status", label: "Status" }, { key: "comment", label: "Comment" }, { key: "action", label: "Action", align: "right" }]} rows={reviews.map((item) => ({ customer: <div><p className="font-black text-ink">{item.customerName}</p><p className="text-slate-500">{item.bookingRequest ? item.bookingRequest.customerEmail : "Manual"}</p></div>, scope: getScopeLabel(item), rating: `${item.rating} / 5`, status: <StatusBadge status={item.status} />, comment: <p className="max-w-md text-sm leading-7 text-slate-600">{item.comment}</p>, action: <div className="flex flex-wrap justify-end gap-2"><Link href={`/admin/reviews?edit=${item.id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-brand-700 transition hover:bg-slate-50">Edit</Link>{item.status !== "PUBLISHED" ? <form action={updateReviewVisibilityAction}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="PUBLISHED" /><button className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">Approve</button></form> : null}{item.status !== "HIDDEN" ? <form action={updateReviewVisibilityAction}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="HIDDEN" /><button className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">Hide</button></form> : null}</div> }))} emptyMessage="No reviews found." />
  </div>;
}
