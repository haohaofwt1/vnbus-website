import Link from "next/link";
import { EntityStatus, Prisma } from "@prisma/client";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminImageThumb } from "@/components/admin/AdminImageThumb";
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
  return <div className="space-y-6"><AdminModuleHeader eyebrow="Nguồn cung" title="Nhà xe" description="Quản lý nhà xe đã xác minh, đánh giá, kênh liên hệ và tuyến đang khai thác." primaryAction={{ href: "/admin/operators/new", label: "Tạo nhà xe" }} />
    <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="nhà xe" />
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Đang hiển thị" value={total} /><AdminMetricCard label="Đang hoạt động" value={active} /><AdminMetricCard label="Đã xác minh" value={verified} /></section>
    <AdminListToolbar basePath="/admin/operators" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Đang hoạt động", value: "active" }, { label: "Đã xác minh", value: "verified" }, { label: "Đánh giá cao", value: "high-rating" }, { label: "Nháp", value: "draft" }]} groups={[{ label: "Trạng thái", value: "status" }, { label: "Đánh giá", value: "rating" }]} views={[{ label: "Danh sách", value: "list" }, { label: "Card", value: "cards" }]} />
    <AdminBulkDeleteBar entity="operators" entityLabel="nhà xe" selectionName="operatorIds" totalOnPage={operators.length} returnTo={returnTo} />
    <DataTable columns={[{ key: "operator", label: "Nhà xe" }, { key: "rating", label: "Đánh giá" }, { key: "coverage", label: "Khai thác" }, { key: "status", label: "Trạng thái" }, { key: "updatedAt", label: "Cập nhật" }, { key: "action", label: "Thao tác", align: "right" }]} rows={operators.map((operator) => ({ operator: <div className="flex min-w-[300px] gap-3"><AdminImageThumb src={operator.logoUrl} alt={operator.name} missingLabel="Thiếu logo" /><div><p className="font-black text-ink">{operator.name}</p><p className="text-slate-500">{operator.contactEmail}</p><p className="text-slate-500">{operator.contactPhone}</p></div></div>, rating: `${operator.rating.toFixed(1)} / 5`, coverage: `${operator._count.trips} chuyến · ${operator._count.reviews} đánh giá`, status: <div className="flex flex-wrap gap-1.5"><StatusBadge status={operator.status} />{operator.verified ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">Đã xác minh</span> : null}</div>, updatedAt: formatDateTime(operator.updatedAt), action: <Link href={`/admin/operators/${operator.id}/edit`} className="font-black text-brand-700">Sửa</Link> }))} emptyMessage="Không tìm thấy nhà xe." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/operators" }} selectionName="operatorIds" rowSelectionValues={operators.map((operator) => operator.id)} />
  </div>;
}
