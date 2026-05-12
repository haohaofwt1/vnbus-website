import { updateHomepageSettingsAction } from "@/lib/actions/admin-content";
import type { HomepageSettings } from "@/lib/site-settings";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input name={name} defaultValue={defaultValue} className={inputClass} />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea name={name} rows={rows} defaultValue={defaultValue} className={inputClass} />
    </label>
  );
}

function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

export function HomepageSettingsForm({ settings }: { settings: HomepageSettings }) {
  return (
    <form action={updateHomepageSettingsAction} className="card-surface space-y-8 p-6 xl:col-span-2">
      <div>
        <p className="eyebrow">Homepage content</p>
        <h2 className="mt-3 text-2xl font-black text-ink">Home sections</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Controls the visible homepage hero, English fallback travel style cards, and the border map support block.
          Public route cards are loaded from route, vehicle, operator, promotion and review records.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-black text-ink">Hero</h3>
        <div className="grid gap-4 lg:grid-cols-4">
          <Field label="Badge" name="hero_badge" defaultValue={settings.hero.badge} />
          <Field label="Title prefix" name="hero_titlePrefix" defaultValue={settings.hero.titlePrefix} />
          <Field label="Title accent" name="hero_titleAccent" defaultValue={settings.hero.titleAccent} />
          <Field label="Title suffix" name="hero_titleSuffix" defaultValue={settings.hero.titleSuffix} />
        </div>
        <TextArea label="Hero body" name="hero_body" defaultValue={settings.hero.body} />
        <Field label="Popular searches label" name="hero_popularSearchesLabel" defaultValue={settings.hero.popularSearchesLabel} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {settings.hero.stats.map((item, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Stat {index + 1}</p>
              <div className="grid gap-3">
                <Field label="Value" name={`hero_stats_${index}_value`} defaultValue={item.value} />
                <Field label="Label" name={`hero_stats_${index}_label`} defaultValue={item.label} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {settings.hero.popularSearches.map((item, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Popular search {index + 1}</p>
              <div className="grid gap-3">
                <Field label="Label" name={`hero_popularSearches_${index}_label`} defaultValue={item.label} />
                <Field label="Link" name={`hero_popularSearches_${index}_href`} defaultValue={item.href} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-black text-ink">Travel styles</h3>
        <p className="text-sm leading-6 text-slate-500">
          These values are used as the English/default version. Other public languages use the locale copy in the app so the homepage does not show English-only cards.
        </p>
        <div className="grid gap-4 lg:grid-cols-4">
          <Field label="Eyebrow" name="style_eyebrow" defaultValue={settings.styleSection.eyebrow} />
          <Field label="Title" name="style_title" defaultValue={settings.styleSection.title} />
          <Field label="Action label" name="style_action" defaultValue={settings.styleSection.action} />
          <Field label="Action link" name="style_href" defaultValue={settings.styleSection.href} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settings.styleSection.cards.map((card, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Style card {index + 1}</p>
              <div className="grid gap-3">
                <Field label="Title" name={`style_cards_${index}_title`} defaultValue={card.title} />
                <TextArea label="Body" name={`style_cards_${index}_body`} defaultValue={card.body} rows={2} />
                <Field label="Vehicle text" name={`style_cards_${index}_vehicle`} defaultValue={card.vehicle} />
                <Field label="Search smart value" name={`style_cards_${index}_smart`} defaultValue={card.smart} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-black text-ink">Quick need cards</h3>
        <p className="text-sm leading-6 text-slate-500">
          These cards power the homepage section “Bạn cần chuyến xe như thế nào?”. They send users to search with a smart priority such as overnight, family, value, pickup, wc, or border.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settings.smartSuggestions.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Need card {index + 1}</p>
              <div className="grid gap-3">
                <input type="hidden" name={`smart_${index}_id`} value={item.id} />
                <Field label="Title" name={`smart_${index}_title`} defaultValue={item.title} />
                <TextArea label="Description" name={`smart_${index}_description`} defaultValue={item.description} rows={2} />
                <Field label="Search link" name={`smart_${index}_href`} defaultValue={item.href} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Icon" name={`smart_${index}_icon`} defaultValue={item.icon} />
                  <Field label="Color" name={`smart_${index}_color`} defaultValue={item.color} />
                  <Field label="Order" name={`smart_${index}_displayOrder`} defaultValue={String(item.displayOrder)} />
                </div>
                <div className="flex flex-wrap gap-4">
                  <CheckboxField label="Enabled" name={`smart_${index}_enabled`} defaultChecked={item.enabled} />
                  <CheckboxField label="Show on homepage" name={`smart_${index}_showOnHomepage`} defaultChecked={item.showOnHomepage} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-black text-ink">Border-ready routes</h3>
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-900">
          Border route cards on the homepage now come from active international routes in the Routes admin module. To change the cards, edit the route, trips, vehicle type, or status there.
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-black text-ink">Border map</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="Map eyebrow" name="map_eyebrow" defaultValue={settings.borderSection.map.eyebrow} />
          <Field label="Map title" name="map_title" defaultValue={settings.borderSection.map.title} />
          <Field label="Status badge" name="map_status" defaultValue={settings.borderSection.map.status} />
          <Field label="Confidence label" name="map_confidenceLabel" defaultValue={settings.borderSection.map.confidenceLabel} />
          <Field label="Confidence value" name="map_confidenceValue" defaultValue={settings.borderSection.map.confidenceValue} />
          <Field label="Wait label" name="map_waitLabel" defaultValue={settings.borderSection.map.waitLabel} />
          <Field label="Wait value" name="map_waitValue" defaultValue={settings.borderSection.map.waitValue} />
          <Field label="Support label" name="map_supportLabel" defaultValue={settings.borderSection.map.supportLabel} />
          <Field label="Support value" name="map_supportValue" defaultValue={settings.borderSection.map.supportValue} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {settings.borderSection.map.lanes.map((lane, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Lane {index + 1}</p>
              <div className="grid gap-3">
                <Field label="Label" name={`map_lanes_${index}_label`} defaultValue={lane.label} />
                <Field label="Value" name={`map_lanes_${index}_value`} defaultValue={lane.value} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {settings.borderSection.map.notes.map((note, index) => (
            <Field key={index} label={`Map note ${index + 1}`} name={`map_notes_${index}_value`} defaultValue={note} />
          ))}
        </div>
      </section>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Save homepage content
      </button>
    </form>
  );
}
