import { notFound } from "next/navigation";
import { VehicleTypeForm } from "@/components/admin/VehicleTypeForm";
import { prisma } from "@/lib/prisma";

export default async function EditVehicleTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicleType = await prisma.vehicleType.findUnique({ where: { id } });

  if (!vehicleType) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Edit vehicle type</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {vehicleType.name}
        </h1>
      </div>
      <VehicleTypeForm vehicleType={vehicleType} />
    </div>
  );
}
