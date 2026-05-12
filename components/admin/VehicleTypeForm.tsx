import { createVehicleTypeAction, updateVehicleTypeAction } from "@/lib/actions/admin-vehicles";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type VehicleTypeFormProps = {
  vehicleType?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    subtitle: string;
    bestFor: string;
    imageUrl: string;
    featuredImageUrl: string;
    privacyScore: number;
    comfortScore: number;
    valueScore: number;
    passengerCapacity: number;
    amenities: string[];
  };
};

export function VehicleTypeForm({ vehicleType }: VehicleTypeFormProps) {
  const action = vehicleType ? updateVehicleTypeAction : createVehicleTypeAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {vehicleType ? <input type="hidden" name="id" value={vehicleType.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input name="name" defaultValue={vehicleType?.name} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input name="slug" defaultValue={vehicleType?.slug} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Passenger capacity</span>
          <input
            type="number"
            min={1}
            name="passengerCapacity"
            defaultValue={vehicleType?.passengerCapacity}
            className={inputClass}
            required
          />
        </label>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <AdminImageUploadField
          name="imageUrl"
          label="Vehicle card image"
          folder="vehicles"
          defaultValue={vehicleType?.imageUrl}
          hint="Used on the public Loại xe card. Recommended ratio 4:3 or 16:10."
        />
        <AdminImageUploadField
          name="featuredImageUrl"
          label="Featured / large image"
          folder="vehicles"
          defaultValue={vehicleType?.featuredImageUrl}
          hint="Used when this vehicle is featured on the Loại xe page. Leave blank to reuse card image."
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Public subtitle</span>
          <input
            name="subtitle"
            defaultValue={vehicleType?.subtitle}
            className={inputClass}
            placeholder="e.g. Phù hợp 2 khách"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Best for</span>
          <input
            name="bestFor"
            defaultValue={vehicleType?.bestFor}
            className={inputClass}
            placeholder="e.g. Gia đình hoặc nhóm nhỏ"
          />
        </label>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-4">
          <h2 className="text-base font-black text-ink">Vehicle DNA scores</h2>
          <p className="mt-1 text-sm text-slate-500">
            0 means the public page will auto-calculate from name, amenities and price. Use 1-5 to control display manually.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Privacy score</span>
            <input type="number" min={0} max={5} name="privacyScore" defaultValue={vehicleType?.privacyScore ?? 0} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Comfort score</span>
            <input type="number" min={0} max={5} name="comfortScore" defaultValue={vehicleType?.comfortScore ?? 0} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Value score</span>
            <input type="number" min={0} max={5} name="valueScore" defaultValue={vehicleType?.valueScore ?? 0} className={inputClass} />
          </label>
        </div>
      </section>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          rows={5}
          defaultValue={vehicleType?.description}
          className={inputClass}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Amenities</span>
        <textarea
          name="amenities"
          rows={4}
          defaultValue={vehicleType?.amenities.join(", ")}
          className={inputClass}
          placeholder="Air-conditioning, Water, USB charging"
        />
        <span className="text-xs font-medium text-slate-500">
          Separate amenities with commas.
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {vehicleType ? "Update vehicle type" : "Create vehicle type"}
      </button>
    </form>
  );
}
