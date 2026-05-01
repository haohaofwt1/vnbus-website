import { OperatorForm } from "@/components/admin/OperatorForm";

export default function NewOperatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Create operator</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          New operator
        </h1>
      </div>
      <OperatorForm />
    </div>
  );
}

