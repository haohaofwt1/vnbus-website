import type { Metadata } from "next";
import { VehicleDirectoryClient } from "@/components/vehicles/VehicleDirectoryClient";
import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getVehiclePageSettings } from "@/lib/site-settings";

export const metadata: Metadata = buildMetadata({
  title: "Loại xe",
  description: "So sánh các loại xe VNBus theo sức chứa, mức giá, tiện ích và trải nghiệm phù hợp.",
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
  const [vehicles, vehiclePageSettings] = await Promise.all([
    prisma.vehicleType.findMany({
      orderBy: { name: "asc" },
      include: {
        trips: {
          where: { status: "ACTIVE" },
          select: { price: true, currency: true, amenities: true },
          orderBy: { price: "asc" },
        },
      },
    }),
    getVehiclePageSettings(),
  ]);

  return (
    <VehicleDirectoryClient
      vehicles={vehicles}
      locale={locale}
      banner={vehiclePageSettings}
    />
  );
}
