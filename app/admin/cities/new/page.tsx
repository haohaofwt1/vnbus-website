import { CityForm } from "@/components/admin/CityForm";

export default function NewCityPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Create city</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          New city
        </h1>
      </div>
      <CityForm />
    </div>
  );
}

