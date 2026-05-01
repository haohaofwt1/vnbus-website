import { createCityAction, updateCityAction } from "@/lib/actions/admin-cities";
import { AdminImageUploadField } from "./AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type CityFormProps = {
  city?: {
    id: string;
    name: string;
    slug: string;
    country: string;
    region: string;
    description: string;
    imageUrl: string;
    seoTitle: string;
    seoDescription: string;
  };
};

export function CityForm({ city }: CityFormProps) {
  const action = city ? updateCityAction : createCityAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {city ? <input type="hidden" name="id" value={city.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input name="name" defaultValue={city?.name} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input name="slug" defaultValue={city?.slug} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Country</span>
          <input name="country" defaultValue={city?.country} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Region</span>
          <input name="region" defaultValue={city?.region} className={inputClass} required />
        </label>
      </div>

      <AdminImageUploadField
        name="imageUrl"
        label="Destination image"
        defaultValue={city?.imageUrl}
        folder="cities"
        required
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          rows={6}
          defaultValue={city?.description}
          className={inputClass}
          required
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">SEO title</span>
          <input
            name="seoTitle"
            defaultValue={city?.seoTitle}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">SEO description</span>
          <textarea
            name="seoDescription"
            rows={4}
            defaultValue={city?.seoDescription}
            className={inputClass}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {city ? "Update city" : "Create city"}
      </button>
    </form>
  );
}
