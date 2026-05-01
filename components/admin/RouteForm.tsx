import { createRouteAction, updateRouteAction } from "@/lib/actions/admin-routes";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type RouteFormProps = {
  route?: {
    id: string;
    slug: string;
    fromCityId: string;
    toCityId: string;
    countryFrom: string;
    countryTo: string;
    isInternational: boolean;
    distanceKm: number;
    estimatedDuration: string;
    priceFrom: number;
    currency: string;
    shortDescription: string;
    longDescription: string;
    seoTitle: string;
    seoDescription: string;
    status: string;
  };
  cities: Array<{
    id: string;
    name: string;
  }>;
};

export function RouteForm({ route, cities }: RouteFormProps) {
  const action = route ? updateRouteAction : createRouteAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {route ? <input type="hidden" name="id" value={route.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input name="slug" defaultValue={route?.slug} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">From city</span>
          <select
            name="fromCityId"
            defaultValue={route?.fromCityId}
            className={inputClass}
            required
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">To city</span>
          <select
            name="toCityId"
            defaultValue={route?.toCityId}
            className={inputClass}
            required
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Country from</span>
          <input
            name="countryFrom"
            defaultValue={route?.countryFrom}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Country to</span>
          <input
            name="countryTo"
            defaultValue={route?.countryTo}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select name="status" defaultValue={route?.status ?? "ACTIVE"} className={inputClass}>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Distance (km)</span>
          <input
            type="number"
            name="distanceKm"
            defaultValue={route?.distanceKm}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Estimated duration</span>
          <input
            name="estimatedDuration"
            defaultValue={route?.estimatedDuration}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Price from</span>
          <input
            type="number"
            name="priceFrom"
            defaultValue={route?.priceFrom}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Currency</span>
          <input
            name="currency"
            defaultValue={route?.currency ?? "VND"}
            className={inputClass}
            required
          />
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" name="isInternational" defaultChecked={route?.isInternational} />
          <span>International route</span>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Short description</span>
        <textarea
          name="shortDescription"
          rows={3}
          defaultValue={route?.shortDescription}
          className={inputClass}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Long description</span>
        <textarea
          name="longDescription"
          rows={8}
          defaultValue={route?.longDescription}
          className={inputClass}
          required
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">SEO title</span>
          <input
            name="seoTitle"
            defaultValue={route?.seoTitle}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">SEO description</span>
          <textarea
            name="seoDescription"
            rows={3}
            defaultValue={route?.seoDescription}
            className={inputClass}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {route ? "Update route" : "Create route"}
      </button>
    </form>
  );
}

