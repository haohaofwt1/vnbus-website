import { RouteForm } from "@/components/admin/RouteForm";
import { prisma } from "@/lib/prisma";

export default async function NewRoutePage() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Create route</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          New route
        </h1>
      </div>
      <RouteForm cities={cities} />
    </div>
  );
}

