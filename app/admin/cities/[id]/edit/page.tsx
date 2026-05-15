import { notFound } from "next/navigation";
import { CityForm } from "@/components/admin/CityForm";
import { prisma } from "@/lib/prisma";

export default async function EditCityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const city = await prisma.city.findUnique({ where: { id } });

  if (!city) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Chỉnh sửa thành phố</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {city.name}
        </h1>
      </div>
      <CityForm city={city} />
    </div>
  );
}
