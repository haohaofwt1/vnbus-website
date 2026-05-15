import { ActionMessage } from "@/components/admin/ActionMessage";
import { VehicleTypeForm } from "@/components/admin/VehicleTypeForm";

export default async function NewVehicleTypePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Tạo loại xe</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          Loại xe mới
        </h1>
      </div>
      {params.error === "invalid" ? (
        <ActionMessage
          type="error"
          message="Không thể tạo loại xe. Vui lòng nhập đủ thông tin bắt buộc, đặc biệt Mô tả cần ít nhất 12 ký tự và Sức chứa phải lớn hơn 0."
        />
      ) : null}
      <VehicleTypeForm />
    </div>
  );
}
