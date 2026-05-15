import { ActionMessage } from "@/components/admin/ActionMessage";
import { notFound } from "next/navigation";
import { VehicleTypeForm } from "@/components/admin/VehicleTypeForm";
import { prisma } from "@/lib/prisma";

export default async function EditVehicleTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const pageParams = await searchParams;
  const vehicleType = await prisma.vehicleType.findUnique({ where: { id } });

  if (!vehicleType) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Chỉnh sửa loại xe</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {vehicleType.name}
        </h1>
      </div>
      {pageParams.saved ? <ActionMessage type="success" message="Loại xe đã được lưu." /> : null}
      {pageParams.error === "invalid" ? (
        <ActionMessage
          type="error"
          message="Không thể lưu loại xe. Vui lòng nhập đủ thông tin bắt buộc, đặc biệt Mô tả cần ít nhất 12 ký tự và Sức chứa phải lớn hơn 0."
        />
      ) : null}
      <VehicleTypeForm vehicleType={vehicleType} />
    </div>
  );
}
