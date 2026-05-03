import type { Metadata } from "next";
import { VehicleTypeCard } from "@/components/VehicleTypeCard";
import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Vehicle types",
  description: "Compare VNBus vehicle types, comfort levels, capacities and amenities.",
  path: "/vehicles",
});

export const dynamic = "force-dynamic";

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const vehicles = await prisma.vehicleType.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <div>
          <p className="eyebrow">Vehicles</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-black text-ink">Explore all vehicles</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Vehicle types are managed in admin and reused across trips, search filters and route cards.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => <VehicleTypeCard key={vehicle.id} vehicleType={vehicle} locale={locale} />)}
        </div>
      </div>
    </section>
  );
}
