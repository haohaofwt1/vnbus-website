import { createVehicleTypeAction, updateVehicleTypeAction } from "@/lib/actions/admin-vehicles";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type VehicleTypeFormProps = {
  vehicleType?: {
    id: string;
    name: string;
    slug: string;
    description: string;
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
