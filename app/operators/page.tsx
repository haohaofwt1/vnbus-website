import type { Metadata } from "next";
import { EntityStatus, TripStatus } from "@prisma/client";
import { OperatorCard } from "@/components/OperatorCard";
import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bus operators",
  description: "Browse active VNBus operators and compare verified route coverage.",
  path: "/operators",
});

export const dynamic = "force-dynamic";

export default async function OperatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const operators = await prisma.operator.findMany({
    where: { status: EntityStatus.ACTIVE },
    include: {
      trips: {
        where: { status: TripStatus.ACTIVE, route: { status: EntityStatus.ACTIVE } },
        select: {
          routeId: true,
          route: { select: { isInternational: true } },
          vehicleType: { select: { name: true } },
        },
      },
    },
    orderBy: [{ verified: "desc" }, { rating: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <div>
          <p className="eyebrow">Operators</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-black text-ink">Active operators</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Operator cards are loaded from the admin operators module and only active operators are public.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {operators.map((operator) => <OperatorCard key={operator.id} operator={operator} locale={locale} />)}
        </div>
      </div>
    </section>
  );
}
