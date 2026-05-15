import { notFound } from "next/navigation";
import { OperatorForm } from "@/components/admin/OperatorForm";
import { prisma } from "@/lib/prisma";

export default async function EditOperatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const operator = await prisma.operator.findUnique({ where: { id } });

  if (!operator) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Chỉnh sửa nhà xe</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {operator.name}
        </h1>
      </div>
      <OperatorForm operator={operator} />
    </div>
  );
}
