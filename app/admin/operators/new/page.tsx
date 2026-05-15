import { OperatorForm } from "@/components/admin/OperatorForm";

export default function NewOperatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Tạo nhà xe</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          Nhà xe mới
        </h1>
      </div>
      <OperatorForm />
    </div>
  );
}
