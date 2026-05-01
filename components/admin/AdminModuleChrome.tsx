"use client";

import Link from "next/link";
import {
  BadgePercent,
  Banknote,
  BookOpenText,
  Building2,
  CalendarDays,
  CarFront,
  CircleHelp,
  ClipboardList,
  Globe2,
  LayoutDashboard,
  KanbanSquare,
  Map,
  Plus,
  Search,
  Settings,
  Star,
  Table2,
} from "lucide-react";
import { AdminToolbarMenu } from "@/components/admin/AdminToolbarMenu";
import {
  adminLocalizedHref,
  formatAdminTemplate,
  translateAdminFilter,
  translateAdminStatus,
  translateAdminText,
  useAdminCopy,
  useAdminLocale,
} from "@/components/admin/admin-i18n";

export type AdminModuleKey =
  | "dashboard"
  | "bookings"
  | "trips"
  | "routes"
  | "operators"
  | "vehicles"
  | "cities"
  | "payments"
  | "promotions"
  | "reviews"
  | "blog"
  | "faqs"
  | "content";

export const adminModules = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard, group: "Operate" },
  { key: "bookings", label: "Bookings", href: "/admin/bookings", icon: ClipboardList, group: "Operate" },
  { key: "trips", label: "Trips", href: "/admin/trips", icon: CalendarDays, group: "Supply" },
  { key: "routes", label: "Routes", href: "/admin/routes", icon: Map, group: "Supply" },
  { key: "operators", label: "Operators", href: "/admin/operators", icon: Building2, group: "Supply" },
  { key: "vehicles", label: "Vehicles", href: "/admin/vehicles", icon: CarFront, group: "Supply" },
  { key: "cities", label: "Cities", href: "/admin/cities", icon: Globe2, group: "Supply" },
  { key: "payments", label: "Payments", href: "/admin/payments", icon: Banknote, group: "Revenue" },
  { key: "promotions", label: "Promotions", href: "/admin/promotions", icon: BadgePercent, group: "Revenue" },
  { key: "reviews", label: "Reviews", href: "/admin/reviews", icon: Star, group: "Trust" },
  { key: "blog", label: "Travel guide", href: "/admin/blog", icon: BookOpenText, group: "Content" },
  { key: "faqs", label: "FAQs", href: "/admin/faqs", icon: CircleHelp, group: "Content" },
  { key: "content", label: "Settings", href: "/admin/content", icon: Settings, group: "Content" },
] as const;

export function AdminModuleHeader({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
}) {
  const locale = useAdminLocale();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="inline-flex rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-brand-700 shadow-sm">
          {translateAdminText(locale, eyebrow)}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-black tracking-tight text-ink lg:text-4xl">
          {translateAdminText(locale, title)}
        </h1>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{translateAdminText(locale, description)}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {secondaryAction ? (
          <Link href={adminLocalizedHref(secondaryAction.href, locale)} className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
            {translateAdminText(locale, secondaryAction.label)}
          </Link>
        ) : null}
        {primaryAction ? (
          <Link href={adminLocalizedHref(primaryAction.href, locale)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(47,103,246,0.22)] transition hover:bg-brand-700">
            <Plus className="h-4 w-4" />
            {translateAdminText(locale, primaryAction.label)}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function AdminListToolbar({
  basePath,
  search,
  filters,
  activeFilter,
  groupBy,
  groups,
  views,
  activeView = "list",
  favorites,
}: {
  basePath: string;
  search?: string;
  activeFilter?: string;
  filters?: Array<{ label: string; value: string }>;
  groupBy?: string;
  groups?: Array<{ label: string; value: string }>;
  views?: Array<{ label: string; value: string }>;
  activeView?: string;
  favorites?: Array<{ label: string; href?: string; filter?: string; groupBy?: string }>;
}) {
  const locale = useAdminLocale();
  const copy = useAdminCopy();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <form action={basePath} className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-cyan-100">
          <Search className="ml-3 h-4 w-4 shrink-0 text-slate-500" />
          {locale !== "en" ? <input type="hidden" name="lang" value={locale} /> : null}
          <input name="q" defaultValue={search ?? ""} placeholder={copy.toolbar.searchPlaceholder} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-semibold text-slate-800 outline-none" />
          {activeFilter ? <input type="hidden" name="filter" value={activeFilter} /> : null}
          {groupBy ? <input type="hidden" name="groupBy" value={groupBy} /> : null}
          {activeView !== "list" ? <input type="hidden" name="view" value={activeView} /> : null}
          <button className="border-l border-slate-200 px-4 py-3 text-sm font-black text-brand-700">{copy.toolbar.search}</button>
        </form>

        <AdminToolbarMenu
          key={`${basePath}:${search ?? ""}:${activeFilter ?? ""}:${groupBy ?? ""}:${activeView}`}
          basePath={basePath}
          search={search}
          filters={filters}
          activeFilter={activeFilter}
          groupBy={groupBy}
          groups={groups}
          activeView={activeView}
          favorites={favorites}
        />

        {views?.length ? (
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {views.map((view) => {
              const active = activeView === view.value;
              return (
                <Link key={view.value} href={toolbarHref(basePath, { q: search, filter: activeFilter, groupBy, view: view.value, lang: locale })} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black ${active ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  {view.value === "kanban" ? <KanbanSquare className="h-4 w-4" /> : <Table2 className="h-4 w-4" />}
                  {view.value === "kanban" ? copy.toolbar.kanban : view.value === "list" ? copy.toolbar.list : view.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>

      {(activeFilter || groupBy) ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {activeFilter ? <span className="rounded-full bg-brand-50 px-3 py-2 text-xs font-black text-brand-700">{copy.toolbar.filterPrefix}: {translateAdminFilter(locale, activeFilter, filters?.find((filter) => filter.value === activeFilter)?.label ?? activeFilter)}</span> : null}
          {groupBy ? <span className="rounded-full bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-700">{copy.toolbar.groupPrefix}: {translateAdminFilter(locale, groupBy, groups?.find((group) => group.value === groupBy)?.label ?? groupBy)}</span> : null}
          <Link href={toolbarHref(basePath, { q: search, view: activeView, lang: locale })} className="rounded-full px-3 py-2 text-xs font-black text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">{copy.toolbar.clearAll}</Link>
        </div>
      ) : null}
    </div>
  );
}

export function AdminMetricCard({ label, value, helper }: { label: string; value: React.ReactNode; helper?: string }) {
  const locale = useAdminLocale();

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{translateAdminText(locale, label)}</p>
      <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-black text-ink">{value}</p>
      {helper ? <p className="mt-2 text-xs font-semibold text-slate-500">{translateAdminText(locale, helper)}</p> : null}
    </article>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const locale = useAdminLocale();
  const normalized = status.toUpperCase();
  const className = normalized.includes("PAID") || normalized.includes("CONFIRMED") || normalized.includes("ACTIVE") || normalized.includes("PUBLISHED")
    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
    : normalized.includes("PENDING") || normalized.includes("NEW") || normalized.includes("DRAFT")
      ? "bg-amber-50 text-amber-700 ring-amber-100"
      : normalized.includes("FAILED") || normalized.includes("CANCELLED") || normalized.includes("HIDDEN") || normalized.includes("EXPIRED")
        ? "bg-rose-50 text-rose-700 ring-rose-100"
        : "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${className}`}>
      {translateAdminStatus(locale, normalized, status.replaceAll("_", " "))}
    </span>
  );
}

type LauncherStat = {
  label: string;
  count?: number;
};

function isLauncherStat(value: React.ReactNode | LauncherStat): value is LauncherStat {
  return Boolean(value && typeof value === "object" && "label" in value);
}

export function AdminAppLauncher({ stats }: { stats?: Record<string, React.ReactNode | LauncherStat> }) {
  const locale = useAdminLocale();
  const copy = useAdminCopy();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {adminModules.filter((module) => module.key !== "dashboard").map((module) => {
        const Icon = module.icon;
        const stat = stats?.[module.key];
        const statContent = isLauncherStat(stat)
          ? formatAdminTemplate(translateAdminText(locale, stat.label), { count: stat.count ?? "" })
          : typeof stat === "string"
            ? translateAdminText(locale, stat)
            : stat ?? translateAdminText(locale, "Open module");

        return (
          <Link key={module.key} href={adminLocalizedHref(module.href, locale)} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">{copy.groups[module.group] ?? module.group}</span>
            </div>
            <h3 className="mt-5 text-lg font-black text-ink">{copy.modules[module.key] ?? module.label}</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">{statContent}</p>
          </Link>
        );
      })}
    </div>
  );
}

function toolbarHref(basePath: string, values: { q?: string; filter?: string; groupBy?: string; view?: string; lang?: string }) {
  const params = new URLSearchParams();
  if (values.lang && values.lang !== "en") params.set("lang", values.lang);
  if (values.q) params.set("q", values.q);
  if (values.filter) params.set("filter", values.filter);
  if (values.groupBy) params.set("groupBy", values.groupBy);
  if (values.view && values.view !== "list") params.set("view", values.view);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
