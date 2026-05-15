import Link from "next/link";
import { Prisma } from "@prisma/client";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminImageThumb } from "@/components/admin/AdminImageThumb";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { adminReturnTo } from "@/lib/admin-return-to";
import { prisma } from "@/lib/prisma";
import { buildPagination, formatDateTime } from "@/lib/utils";

function cityWhere(q?: string, filter?: string): Prisma.CityWhereInput {
  const where: Prisma.CityWhereInput = {};
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }, { country: { contains: q, mode: "insensitive" } }, { region: { contains: q, mode: "insensitive" } }];
  if (filter === "vietnam") where.country = "Vietnam";
  if (filter === "cambodia") where.country = "Cambodia";
  if (filter === "laos") where.country = "Laos";
  if (filter === "missing-image") where.imageUrl = "";
  return where;
}

export default async function AdminCitiesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; filter?: string; groupBy?: string; bulkDeleted?: string; bulkError?: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const perPage = 12;
  const where = cityWhere(params.q, params.filter);
  const [total, cities, countries] = await Promise.all([
    prisma.city.count({ where }),
    prisma.city.findMany({ where, skip: (currentPage - 1) * perPage, take: perPage, include: { _count: { select: { fromRoutes: true, toRoutes: true } } }, orderBy: { updatedAt: "desc" } }),
    prisma.city.groupBy({ by: ["country"], _count: { country: true } }),
  ]);
  const pagination = buildPagination(currentPage, total, perPage);
  const returnTo = adminReturnTo("/admin/cities", { page: params.page, q: params.q, filter: params.filter, groupBy: params.groupBy });
  return <div className="space-y-6"><AdminModuleHeader eyebrow="Nguồn cung" title="Thành phố" description="Quản lý điểm đến, khu vực, ảnh SEO và tuyến đang khai thác." primaryAction={{ href: "/admin/cities/new", label: "Tạo thành phố" }} />
    <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="thành phố" />
    <section className="grid gap-4 md:grid-cols-4"><AdminMetricCard label="Đang hiển thị" value={total} /><AdminMetricCard label="Việt Nam" value={countries.find((item) => item.country === "Vietnam")?._count.country ?? 0} /><AdminMetricCard label="Campuchia" value={countries.find((item) => item.country === "Cambodia")?._count.country ?? 0} /><AdminMetricCard label="Lào" value={countries.find((item) => item.country === "Laos")?._count.country ?? 0} /></section>
    <AdminListToolbar basePath="/admin/cities" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Việt Nam", value: "vietnam" }, { label: "Campuchia", value: "cambodia" }, { label: "Lào", value: "laos" }]} groups={[{ label: "Quốc gia", value: "country" }, { label: "Khu vực", value: "region" }]} views={[{ label: "Danh sách", value: "list" }, { label: "Bản đồ", value: "map" }]} />
    <AdminBulkDeleteBar entity="cities" entityLabel="thành phố" selectionName="cityIds" totalOnPage={cities.length} returnTo={returnTo} />
    <DataTable columns={[{ key: "city", label: "Thành phố" }, { key: "country", label: "Quốc gia / khu vực" }, { key: "coverage", label: "Tuyến liên quan" }, { key: "updatedAt", label: "Cập nhật" }, { key: "action", label: "Thao tác", align: "right" }]} rows={cities.map((city) => ({ city: <div className="flex min-w-[260px] gap-3"><AdminImageThumb src={city.imageUrl} alt={city.name} missingLabel="Thiếu ảnh" /><div><p className="font-black text-ink">{city.name}</p><p className="text-slate-500">{city.slug}</p></div></div>, country: `${city.country} · ${city.region}`, coverage: `${city._count.fromRoutes} tuyến đi · ${city._count.toRoutes} tuyến đến`, updatedAt: formatDateTime(city.updatedAt), action: <Link href={`/admin/cities/${city.id}/edit`} className="font-black text-brand-700">Sửa</Link> }))} emptyMessage="Không tìm thấy thành phố." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/cities" }} selectionName="cityIds" rowSelectionValues={cities.map((city) => city.id)} />
  </div>;
}
