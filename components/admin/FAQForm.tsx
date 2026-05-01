import { createFaqAction, updateFaqAction } from "@/lib/actions/admin-faqs";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type FAQFormProps = {
  faq?: {
    id: string;
    question: string;
    answer: string;
    category: string;
    routeId: string | null;
    cityId: string | null;
    operatorId: string | null;
    sortOrder: number;
    status: string;
  };
  routes: Array<{
    id: string;
    slug: string;
    fromCity: { name: string };
    toCity: { name: string };
  }>;
  cities: Array<{
    id: string;
    name: string;
  }>;
  operators: Array<{
    id: string;
    name: string;
  }>;
};

export function FAQForm({ faq, routes, cities, operators }: FAQFormProps) {
  const action = faq ? updateFaqAction : createFaqAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {faq ? <input type="hidden" name="id" value={faq.id} /> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Question</span>
          <input
            name="question"
            defaultValue={faq?.question}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <input
            name="category"
            defaultValue={faq?.category}
            className={inputClass}
            required
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Answer</span>
        <textarea
          name="answer"
          rows={5}
          defaultValue={faq?.answer}
          className={inputClass}
          required
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Route</span>
          <select name="routeId" defaultValue={faq?.routeId ?? ""} className={inputClass}>
            <option value="">General</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.fromCity.name} to {route.toCity.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">City</span>
          <select name="cityId" defaultValue={faq?.cityId ?? ""} className={inputClass}>
            <option value="">None</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Operator</span>
          <select
            name="operatorId"
            defaultValue={faq?.operatorId ?? ""}
            className={inputClass}
          >
            <option value="">None</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Sort order</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={faq?.sortOrder ?? 0}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2 lg:col-span-2 xl:col-span-1">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select name="status" defaultValue={faq?.status ?? "PUBLISHED"} className={inputClass}>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {faq ? "Update FAQ" : "Create FAQ"}
      </button>
    </form>
  );
}

