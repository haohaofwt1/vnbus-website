import { createTripAction, updateTripAction } from "@/lib/actions/admin-trips";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function toDatetimeLocal(value?: Date | string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

type TripFormProps = {
  trip?: {
    id: string;
    routeId: string;
    operatorId: string;
    vehicleTypeId: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: number;
    price: number;
    currency: string;
    pickupPoint: string;
    dropoffPoint: string;
    availableSeats: number;
    amenities: string[];
    status: string;
  };
  routes: Array<{
    id: string;
    slug: string;
    fromCity: { name: string };
    toCity: { name: string };
  }>;
  operators: Array<{
    id: string;
    name: string;
  }>;
  vehicleTypes: Array<{
    id: string;
    name: string;
  }>;
  defaultRouteId?: string;
};

export function TripForm({
  trip,
  routes,
  operators,
  vehicleTypes,
  defaultRouteId,
}: TripFormProps) {
  const action = trip ? updateTripAction : createTripAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {trip ? <input type="hidden" name="id" value={trip.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Route</span>
          <select
            name="routeId"
            defaultValue={trip?.routeId ?? defaultRouteId}
            className={inputClass}
            required
          >
            <option value="">Select route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.fromCity.name} to {route.toCity.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Operator</span>
          <select
            name="operatorId"
            defaultValue={trip?.operatorId}
            className={inputClass}
            required
          >
            <option value="">Select operator</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Vehicle type</span>
          <select
            name="vehicleTypeId"
            defaultValue={trip?.vehicleTypeId}
            className={inputClass}
            required
          >
            <option value="">Select type</option>
            {vehicleTypes.map((vehicleType) => (
              <option key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Departure time</span>
          <input
            type="datetime-local"
            name="departureTime"
            defaultValue={toDatetimeLocal(trip?.departureTime)}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Arrival time</span>
          <input
            type="datetime-local"
            name="arrivalTime"
            defaultValue={toDatetimeLocal(trip?.arrivalTime)}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Duration (minutes)</span>
          <input
            type="number"
            name="duration"
            defaultValue={trip?.duration}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Price</span>
          <input
            type="number"
            name="price"
            defaultValue={trip?.price}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Currency</span>
          <input
            name="currency"
            defaultValue={trip?.currency ?? "VND"}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Available seats</span>
          <input
            type="number"
            name="availableSeats"
            defaultValue={trip?.availableSeats}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2 lg:col-span-2 xl:col-span-1">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select name="status" defaultValue={trip?.status ?? "ACTIVE"} className={inputClass}>
            <option value="ACTIVE">Active</option>
            <option value="SOLD_OUT">Sold out</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="DRAFT">Draft</option>
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Pickup point</span>
        <input
          name="pickupPoint"
          defaultValue={trip?.pickupPoint}
          className={inputClass}
          minLength={3}
          placeholder="e.g. Old Quarter pickup office"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Drop-off point</span>
        <input
          name="dropoffPoint"
          defaultValue={trip?.dropoffPoint}
          className={inputClass}
          minLength={3}
          placeholder="e.g. Central bus station"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Amenities (comma separated)
        </span>
        <textarea
          name="amenities"
          rows={4}
          defaultValue={trip?.amenities.join(", ")}
          className={inputClass}
          required
        />
      </label>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {trip ? "Update trip" : "Create trip"}
      </button>
    </form>
  );
}
