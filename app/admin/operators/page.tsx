import Link from "next/link";
import { EntityStatus, Prisma } from "@prisma/client";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { adminReturnTo } from "@/lib/admin-return-to";
import { prisma } from "@/lib/prisma";
import { buildPagination, formatDateTime } from "@/lib/utils";

function operatorWhere(q?: string, filter?: string): Prisma.OperatorWhereInput {
  const where: Prisma.OperatorWhereInput = {};
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { contactEmail: { contains: q, mode: "insensitive" } }, { contactPhone: { contains: q, mode: "insensitive" } }];
  if (filter === "active") where.status = EntityStatus.ACTIVE;
  if (filter === "draft") where.status = EntityStatus.DRAFT;
  if (filter === "verified") where.verified = true;
  if (filter === "high-rating") where.rating = { gte: 4.7 };
  return where;
}

export default async function AdminOperatorsPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; filter?: string; groupBy?: string; bulkDeleted?: string; bulkError?: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const perPage = 12;
  const where = operatorWhere(params.q, params.filter);
  const [total, operators, active, verified] = await Promise.all([
    prisma.operator.count({ where }),
    prisma.operator.findMany({ where, skip: (currentPage - 1) * perPage, take: perPage, include: { _count: { select: { trips: true, reviews: true } } }, orderBy: { updatedAt: "desc" } }),
    prisma.operator.count({ where: { status: EntityStatus.ACTIVE } }),
    prisma.operator.count({ where: { verified: true } }),
  ]);
  const pagination = buildPagination(currentPage, total, perPage);
  const returnTo = adminReturnTo("/admin/operators", { page: params.page, q: params.q, filter: params.filter, groupBy: params.groupBy });
  return <div className="space-y-6"><AdminModuleHeader eyebrow="Operators" title="Operator partners" description="Maintain verified suppliers, ratings, contact channels and route coverage." primaryAction={{ href: "/admin/operators/new", label: "New operator" }} />
    <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="operator" />
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Current view" value={total} /><AdminMetricCard label="Active" value={active} /><AdminMetricCard label="Verified" value={verified} /></section>
    <AdminListToolbar basePath="/admin/operators" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Active", value: "active" }, { label: "Verified", value: "verified" }, { label: "High rating", value: "high-rating" }, { label: "Draft", value: "draft" }]} groups={[{ label: "Status", value: "status" }, { label: "Rating", value: "rating" }]} views={[{ label: "List", value: "list" }, { label: "Cards", value: "cards" }]} />
    <AdminBulkDeleteBar entity="operators" entityLabel="operator" selectionName="operatorIds" totalOnPage={operators.length} returnTo={returnTo} />
    <DataTable columns={[{ key: "operator", label: "Operator" }, { key: "rating", label: "Rating" }, { key: "coverage", label: "Coverage" }, { key: "status", label: "Status" }, { key: "updatedAt", label: "Updated" }, { key: "action", label: "Action", align: "right" }]} rows={operators.map((operator) => ({ operator: <div><p className="font-black text-ink">{operator.name}</p><p className="text-slate-500">{operator.contactEmail}</p><p className="text-slate-500">{operator.contactPhone}</p></div>, rating: `${operator.rating.toFixed(1)} / 5`, coverage: `${operator._count.trips} trips · ${operator._count.reviews} reviews`, status: <StatusBadge status={operator.verified ? `${operator.status} verified` : operator.status} />, updatedAt: formatDateTime(operator.updatedAt), action: <Link href={`/admin/operators/${operator.id}/edit`} className="font-black text-brand-700">Edit</Link> }))} emptyMessage="No operators found." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/operators" }} selectionName="operatorIds" rowSelectionValues={operators.map((operator) => operator.id)} />
  </div>;
}
