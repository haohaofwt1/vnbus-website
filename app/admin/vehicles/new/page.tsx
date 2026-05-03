import { VehicleTypeForm } from "@/components/admin/VehicleTypeForm";

export default function NewVehicleTypePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Create vehicle type</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          New vehicle type
        </h1>
      </div>
      <VehicleTypeForm />
    </div>
  );
}
