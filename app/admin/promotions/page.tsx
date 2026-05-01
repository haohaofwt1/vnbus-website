import { DiscountType, Prisma, PromotionStatus } from "@prisma/client";
import { BadgePercent, CalendarDays, Globe2, Layers3 } from "lucide-react";
import type { ReactNode } from "react";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminLocalizedSelect } from "@/components/admin/AdminLocalizedSelect";
import { AdminText } from "@/components/admin/AdminText";
import {
  AdminListToolbar,
  AdminMetricCard,
  AdminModuleHeader,
  StatusBadge,
} from "@/components/admin/AdminModuleChrome";
import { createPromotionAction, updatePromotionStatusAction } from "@/lib/actions/admin-promotions";
import { adminReturnTo } from "@/lib/admin-return-to";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type PromotionRow = Prisma.PromotionGetPayload<{
  include: {
    route: { include: { fromCity: true; toCity: true } };
    operator: true;
    vehicleType: true;
  };
}>;

const promotionStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "EXPIRED", label: "Expired" },
];

const discountTypeOptions = [
  { value: "PERCENT", label: "Percent" },
  { value: "FIXED_AMOUNT", label: "Fixed amount" },
];

function promoWhere(q?: string, filter?: string): Prisma.PromotionWhereInput {
  const where: Prisma.PromotionWhereInput = {};

  if (q) {
    where.OR = [
      { code: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { internalNote: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filter === "active") where.status = PromotionStatus.ACTIVE;
  if (filter === "paused") where.status = PromotionStatus.PAUSED;
  if (filter === "expired") where.status = PromotionStatus.EXPIRED;
  if (filter === "route") where.routeId = { not: null };
  if (filter === "operator") where.operatorId = { not: null };
  if (filter === "vehicle") where.vehicleTypeId = { not: null };

  return where;
}

function isFrontendLive(promotion: PromotionRow, now = new Date()) {
  if (promotion.status !== PromotionStatus.ACTIVE) return false;
  if (promotion.startsAt && promotion.startsAt > now) return false;
  if (promotion.endsAt && promotion.endsAt < now) return false;
  return true;
}

function discountLabel(promotion: PromotionRow) {
  return promotion.type === DiscountType.PERCENT
    ? `${promotion.value}%`
    : formatCurrency(promotion.value, promotion.currency);
}

export default async function AdminPromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    q?: string;
    filter?: string;
    groupBy?: string;
    bulkDeleted?: string;
    bulkError?: string;
  }>;
}) {
  const params = await searchParams;
  const where = promoWhere(params.q, params.filter);
  const [promotions, routes, operators, vehicleTypes, total, active] = await Promise.all([
    prisma.promotion.findMany({
      where,
      include: {
        route: { include: { fromCity: true, toCity: true } },
        operator: true,
        vehicleType: true,
      },
      orderBy: { createdAt: "desc" },
      take: 80,
    }),
    prisma.route.findMany({
      include: { fromCity: true, toCity: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.operator.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicleType.findMany({ orderBy: { name: "asc" } }),
    prisma.promotion.count({ where }),
    prisma.promotion.count({ where: { status: PromotionStatus.ACTIVE } }),
  ]);
  const liveCount = promotions.filter((promotion) => isFrontendLive(promotion)).length;
  const returnTo = adminReturnTo("/admin/promotions", {
    q: params.q,
    filter: params.filter,
    groupBy: params.groupBy,
  });

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Revenue"
        title="Promotions"
        description="Create controlled discounts, scope them to routes/operators/vehicles, and manage campaign status."
      />

      {params.saved ? <ActionMessage type="success" message="Promotion settings saved." /> : null}
      <AdminBulkResultMessage
        deleted={params.bulkDeleted}
        error={params.bulkError}
        label="promotion"
      />

      <section className="grid gap-4 md:grid-cols-4">
        <AdminMetricCard label="Current view" value={total} />
        <AdminMetricCard label="Active codes" value={active} />
        <AdminMetricCard label="Live on frontend" value={liveCount} />
        <AdminMetricCard
          label="Scoped rules"
          value={promotions.filter((item) => item.routeId || item.operatorId || item.vehicleTypeId).length}
        />
      </section>

      <AdminListToolbar
        basePath="/admin/promotions"
        search={params.q}
        activeFilter={params.filter}
        groupBy={params.groupBy}
        filters={[
          { label: "Active", value: "active" },
          { label: "Paused", value: "paused" },
          { label: "Expired", value: "expired" },
          { label: "Route scoped", value: "route" },
          { label: "Operator scoped", value: "operator" },
          { label: "Vehicle scoped", value: "vehicle" },
        ]}
        groups={[
          { label: "Status", value: "status" },
          { label: "Scope", value: "scope" },
        ]}
        views={[{ label: "List", value: "list" }]}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-5 border-b border-slate-200 bg-slate-50 px-5 py-5 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">
              <AdminText text="Create" />
            </p>
            <h2 className="mt-1 text-xl font-black text-ink">
              <AdminText text="Discount rule" />
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              <AdminText text="Active matching rules can appear on public trip cards and carry the code into checkout automatically." />
            </p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
              <BadgePercent className="h-4 w-4" />
              <AdminText text="Public offer" />
            </span>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              <AdminText text="Shown on trip cards when status, dates, minimum spend, and scope match." />
            </p>
          </div>
        </div>

        <form action={createPromotionAction} className="grid gap-5 p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <AdminField label="Promo code">
              <input name="code" placeholder="VIP30" className="checkout-input" required />
            </AdminField>
            <AdminField label="Display name">
              <input name="name" placeholder="VIP online offer" className="checkout-input" required />
            </AdminField>
            <AdminField label="Status">
              <AdminLocalizedSelect
                name="status"
                defaultValue="ACTIVE"
                className="checkout-input"
                options={promotionStatusOptions}
              />
            </AdminField>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <AdminField label="Discount type">
              <AdminLocalizedSelect
                name="type"
                defaultValue={DiscountType.FIXED_AMOUNT}
                className="checkout-input"
                options={discountTypeOptions}
              />
            </AdminField>
            <AdminField label="Value">
              <input name="value" type="number" min="1" placeholder="30000" className="checkout-input" required />
            </AdminField>
            <AdminField label="Currency">
              <input name="currency" defaultValue="VND" className="checkout-input" required />
            </AdminField>
            <AdminField label="Minimum spend">
              <input name="minimumAmount" type="number" min="0" placeholder="Optional" className="checkout-input" />
            </AdminField>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <AdminField label="Route scope">
              <AdminLocalizedSelect
                name="routeId"
                defaultValue=""
                className="checkout-input"
                options={[
                  { value: "", label: "All routes" },
                  ...routes.map((route) => ({
                    value: route.id,
                    label: `${route.fromCity.name} → ${route.toCity.name}`,
                  })),
                ]}
              />
            </AdminField>
            <AdminField label="Operator scope">
              <AdminLocalizedSelect
                name="operatorId"
                defaultValue=""
                className="checkout-input"
                options={[
                  { value: "", label: "All operators" },
                  ...operators.map((operator) => ({ value: operator.id, label: operator.name })),
                ]}
              />
            </AdminField>
            <AdminField label="Vehicle scope">
              <AdminLocalizedSelect
                name="vehicleTypeId"
                defaultValue=""
                className="checkout-input"
                options={[
                  { value: "", label: "All vehicles" },
                  ...vehicleTypes.map((vehicleType) => ({
                    value: vehicleType.id,
                    label: vehicleType.name,
                  })),
                ]}
              />
            </AdminField>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <AdminField label="Start date">
              <input name="startsAt" type="datetime-local" className="checkout-input" />
            </AdminField>
            <AdminField label="End date">
              <input name="endsAt" type="datetime-local" className="checkout-input" />
            </AdminField>
            <AdminField label="Max redemptions">
              <input name="maxRedemptions" type="number" min="0" placeholder="Optional" className="checkout-input" />
            </AdminField>
            <AdminField label="Per email limit">
              <input name="perCustomerLimit" type="number" min="0" placeholder="Optional" className="checkout-input" />
            </AdminField>
          </div>

          <AdminField label="Internal note">
            <textarea
              name="internalNote"
              rows={3}
              placeholder="Campaign purpose, operator agreement, or approval note"
              className="checkout-input"
            />
          </AdminField>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(47,103,246,0.22)] transition hover:bg-brand-700">
              <AdminText text="Create promotion" />
            </button>
          </div>
        </form>
      </section>

      <AdminBulkDeleteBar
        entity="promotions"
        entityLabel="promotion"
        selectionName="promotionIds"
        totalOnPage={promotions.length}
        returnTo={returnTo}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">
              <AdminText text="Promotion library" />
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              <AdminText text="Select multiple promotion rules to delete old campaigns, or update a single campaign status inline." />
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600"
                    aria-label="Select all promotions"
                    data-admin-bulk-select-all="promotionIds"
                    disabled={!promotions.length}
                  />
                </th>
                {["Code", "Offer", "Scope", "Limits", "Validity", "Status", "Action"].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500"
                  >
                    <AdminText text={label} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {promotions.length ? (
                promotions.map((promotion) => {
                  const live = isFrontendLive(promotion);

                  return (
                    <tr key={promotion.id} className="align-top transition hover:bg-blue-50/35">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          value={promotion.id}
                          className="h-4 w-4 rounded border-slate-300 text-brand-600"
                          aria-label={`Select promotion ${promotion.code}`}
                          data-admin-bulk-row="promotionIds"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{promotion.code}</p>
                        <p className="mt-1 max-w-[240px] text-sm leading-6 text-slate-500">
                          {promotion.name}
                        </p>
                        {live ? (
                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                            <Globe2 className="h-3.5 w-3.5" />
                            <AdminText text="Live on frontend" />
                          </span>
                        ) : (
                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                            <Globe2 className="h-3.5 w-3.5" />
                            <AdminText text="Hidden from frontend" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-[family-name:var(--font-heading)] text-2xl font-black text-rose-600">
                          {discountLabel(promotion)}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {promotion.minimumAmount ? (
                            <>
                              <AdminText text="Min spend" />{" "}
                              {formatCurrency(promotion.minimumAmount, promotion.currency)}
                            </>
                          ) : (
                            <AdminText text="No minimum" />
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <ScopeLine
                          label="Route"
                          value={
                            promotion.route
                              ? `${promotion.route.fromCity.name} to ${promotion.route.toCity.name}`
                              : <AdminText text="All routes" />
                          }
                        />
                        <ScopeLine
                          label="Operator"
                          value={promotion.operator?.name || <AdminText text="All operators" />}
                        />
                        <ScopeLine
                          label="Vehicle"
                          value={promotion.vehicleType?.name || <AdminText text="All vehicles" />}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <p>
                          {promotion.maxRedemptions ? (
                            <>
                              {promotion.maxRedemptions} <AdminText text="total uses" />
                            </>
                          ) : (
                            <AdminText text="No total limit" />
                          )}
                        </p>
                        <p className="mt-1 text-slate-500">
                          {promotion.perCustomerLimit ? (
                            <>
                              {promotion.perCustomerLimit} <AdminText text="per email" />
                            </>
                          ) : (
                            <AdminText text="No email limit" />
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <p className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {promotion.startsAt ? (
                            formatDateTime(promotion.startsAt)
                          ) : (
                            <AdminText text="Starts immediately" />
                          )}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-2 text-slate-500">
                          <Layers3 className="h-4 w-4 text-slate-400" />
                          {promotion.endsAt ? (
                            formatDateTime(promotion.endsAt)
                          ) : (
                            <AdminText text="No end date" />
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={promotion.status} />
                      </td>
                      <td className="px-4 py-4">
                        <form action={updatePromotionStatusAction} className="flex gap-2">
                          <input type="hidden" name="id" value={promotion.id} />
                          <AdminLocalizedSelect
                            name="status"
                            defaultValue={promotion.status}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                            options={promotionStatusOptions}
                          />
                          <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                            <AdminText text="Save" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm font-semibold text-slate-500">
                    <AdminText text="No promotion codes yet." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AdminField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-black text-slate-700">
      <span>
        <AdminText text={label} />
      </span>
      {children}
    </label>
  );
}

function ScopeLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <p className="leading-6">
      <span className="font-black text-slate-500">
        <AdminText text={label} />:
      </span>{" "}
      {value}
    </p>
  );
}
