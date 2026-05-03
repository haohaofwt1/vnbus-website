import type { Metadata } from "next";
import { EntityStatus, TripStatus } from "@prisma/client";
import { RouteCard } from "@/components/RouteCard";
import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Border-ready bus routes",
  description: "Explore active cross-border bus routes between Vietnam, Cambodia and Laos.",
  path: "/border-routes",
});

export const dynamic = "force-dynamic";

export default async function BorderRoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const routes = await prisma.route.findMany({
    where: { status: EntityStatus.ACTIVE, isInternational: true },
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
    orderBy: [{ priceFrom: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <div>
          <p className="eyebrow">Border routes</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-black text-ink">Cross-border routes</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            These routes come from active international route records managed in admin.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => <RouteCard key={route.id} route={route} locale={locale} variant="border" />)}
        </div>
      </div>
    </section>
  );
}
