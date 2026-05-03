import type { Metadata } from "next";
import Link from "next/link";
import { PromotionStatus } from "@prisma/client";
import { ArrowRight, BadgePercent } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { withLang, resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Travel offers",
  description: "Browse active VNBus promotions and trip planning offers.",
  path: "/offers",
});

export const dynamic = "force-dynamic";

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: {
      status: PromotionStatus.ACTIVE,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    include: {
      route: { include: { fromCity: true, toCity: true } },
      operator: true,
      vehicleType: true,
    },
    orderBy: [{ value: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <div>
          <p className="eyebrow">Offers</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-black text-ink">Travel offers</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Offers are loaded from active promotion records managed in admin.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {promotions.map((promotion) => {
            const target = promotion.route
              ? `${promotion.route.fromCity.name} -> ${promotion.route.toCity.name}`
              : promotion.operator?.name ?? promotion.vehicleType?.name ?? "All eligible trips";
            const value =
              promotion.type === "PERCENT"
                ? `${promotion.value}% off`
                : `${formatCurrency(promotion.value, promotion.currency)} off`;
            return (
              <article key={promotion.id} className="card-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><BadgePercent className="h-6 w-6" /></span>
                <h2 className="mt-5 text-xl font-black text-ink">{promotion.name}</h2>
                <p className="mt-2 text-sm font-black text-brand-700">{promotion.code} · {value}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{target}</p>
                {promotion.minimumAmount ? (
                  <p className="mt-2 text-xs font-semibold text-slate-500">Minimum {formatCurrency(promotion.minimumAmount, promotion.currency)}</p>
                ) : null}
                <Link href={withLang("/search", locale)} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700">
                  Find eligible trips <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
