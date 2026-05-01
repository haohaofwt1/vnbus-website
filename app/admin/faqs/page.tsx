import Link from "next/link";
import { FAQStatus, Prisma } from "@prisma/client";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { FAQForm } from "@/components/admin/FAQForm";
import { prisma } from "@/lib/prisma";

function faqWhere(q?: string, filter?: string): Prisma.FAQWhereInput {
  const where: Prisma.FAQWhereInput = {};
  if (q) where.OR = [{ question: { contains: q, mode: "insensitive" } }, { answer: { contains: q, mode: "insensitive" } }, { category: { contains: q, mode: "insensitive" } }];
  if (filter === "published") where.status = FAQStatus.PUBLISHED;
  if (filter === "draft") where.status = FAQStatus.DRAFT;
  if (filter === "route") where.routeId = { not: null };
  if (filter === "city") where.cityId = { not: null };
  if (filter === "operator") where.operatorId = { not: null };
  return where;
}
export default async function AdminFaqsPage({ searchParams }: { searchParams: Promise<{ edit?: string; q?: string; filter?: string; groupBy?: string }> }) {
  const params = await searchParams;
  const where = faqWhere(params.q, params.filter);
  const [faqs, routes, cities, operators, faq, total, published] = await Promise.all([
    prisma.fAQ.findMany({ where, include: { route: { include: { fromCity: true, toCity: true } }, city: true, operator: true }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    prisma.route.findMany({ include: { fromCity: true, toCity: true }, orderBy: { slug: "asc" } }), prisma.city.findMany({ orderBy: { name: "asc" } }), prisma.operator.findMany({ orderBy: { name: "asc" } }), params.edit ? prisma.fAQ.findUnique({ where: { id: params.edit } }) : Promise.resolve(null), prisma.fAQ.count({ where }), prisma.fAQ.count({ where: { status: FAQStatus.PUBLISHED } }),
  ]);
  return <div className="space-y-6"><AdminModuleHeader eyebrow="Knowledge" title="FAQs" description="Manage public answers by route, city, operator or general support category." />
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Current view" value={total} /><AdminMetricCard label="Published" value={published} /><AdminMetricCard label="Drafts" value={Math.max(0, total - published)} /></section>
    <AdminListToolbar basePath="/admin/faqs" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }, { label: "Route scoped", value: "route" }, { label: "City scoped", value: "city" }, { label: "Operator scoped", value: "operator" }]} groups={[{ label: "Category", value: "category" }, { label: "Scope", value: "scope" }]} views={[{ label: "List", value: "list" }]} />
    <FAQForm faq={faq ?? undefined} routes={routes} cities={cities} operators={operators} />
    <DataTable columns={[{ key: "question", label: "Question" }, { key: "category", label: "Category" }, { key: "scope", label: "Scope" }, { key: "status", label: "Status" }, { key: "action", label: "Action", align: "right" }]} rows={faqs.map((item) => ({ question: <p className="font-semibold text-ink">{item.question}</p>, category: item.category, scope: item.route ? `${item.route.fromCity.name} to ${item.route.toCity.name}` : item.city ? item.city.name : item.operator ? item.operator.name : "General", status: <StatusBadge status={item.status} />, action: <Link href={`/admin/faqs?edit=${item.id}`} className="font-black text-brand-700">Edit</Link> }))} emptyMessage="No FAQs found." />
  </div>;
}
