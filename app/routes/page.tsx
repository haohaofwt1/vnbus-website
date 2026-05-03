import type { Metadata } from "next";
import { EntityStatus, TripStatus } from "@prisma/client";
import { RouteCard } from "@/components/RouteCard";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/i18n";

export const metadata: Metadata = buildMetadata({
  title: "All bus routes",
  description: "Explore active VNBus routes with verified operators, pickup clarity and vehicle options.",
  path: "/routes",
});

export const dynamic = "force-dynamic";

export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const routes = await prisma.route.findMany({
    where: { status: EntityStatus.ACTIVE },
    include: {
      fromCity: true,
      toCity: true,
      trips: {
        where: { status: TripStatus.ACTIVE },
        select: {
          id: true,
          operator: { select: { rating: true } },
          vehicleType: { select: { name: true } },
        },
      },
    },
    orderBy: [{ isInternational: "asc" }, { priceFrom: "asc" }],
  });

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <div>
          <p className="eyebrow">Routes</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-black text-ink">All active routes</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Routes are loaded from the admin route database. Draft and archived routes stay hidden.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => <RouteCard key={route.id} route={route} locale={locale} />)}
        </div>
      </div>
    </section>
  );
}
