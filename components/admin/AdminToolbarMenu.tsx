"use client";

import Link from "next/link";
import { ChevronDown, Filter, ListFilter, Star } from "lucide-react";
import { translateAdminFilter, translateAdminText, useAdminCopy, useAdminLocale } from "@/components/admin/admin-i18n";

type ToolbarMenuProps = {
  basePath: string;
  search?: string;
  filters?: Array<{ label: string; value: string }>;
  activeFilter?: string;
  groupBy?: string;
  groups?: Array<{ label: string; value: string }>;
  activeView?: string;
  favorites?: Array<{ label: string; href?: string; filter?: string; groupBy?: string }>;
};

export function AdminToolbarMenu({
  basePath,
  search,
  filters,
  activeFilter,
  groupBy,
  groups,
  activeView = "list",
  favorites,
}: ToolbarMenuProps) {
  const locale = useAdminLocale();
  const copy = useAdminCopy();

  return (
    <details className="relative" onToggle={(event) => {
      const details = event.currentTarget;
      if (details.open) return;
      details.querySelectorAll("a").forEach((link) => {
        link.blur();
      });
    }}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-cyan-700 bg-cyan-50 px-3 py-3 text-sm font-black text-slate-800 transition hover:bg-cyan-100">
        <ChevronDown className="h-4 w-4" />
      </summary>
      <div className="absolute right-0 top-12 z-30 grid w-[min(760px,calc(100vw-2rem))] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft md:grid-cols-3">
        <div className="border-b border-slate-200 p-4 md:border-b-0 md:border-r">
          <p className="mb-3 flex items-center gap-2 text-sm font-black text-ink"><Filter className="h-4 w-4 text-purple-700" /> {copy.toolbar.filters}</p>
          <div className="space-y-1">
            {filters?.map((filter) => (
              <ToolbarMenuLink
                key={filter.value}
                href={toolbarHref(basePath, { q: search, filter: filter.value, groupBy, view: activeView, lang: locale })}
                active={activeFilter === filter.value}
              >
                {translateAdminFilter(locale, filter.value, filter.label)}
              </ToolbarMenuLink>
            ))}
            {activeFilter ? (
              <ToolbarMenuLink href={toolbarHref(basePath, { q: search, groupBy, view: activeView, lang: locale })} muted>
                {copy.toolbar.clearFilter}
              </ToolbarMenuLink>
            ) : null}
          </div>
        </div>

        <div className="border-b border-slate-200 p-4 md:border-b-0 md:border-r">
          <p className="mb-3 flex items-center gap-2 text-sm font-black text-ink"><ListFilter className="h-4 w-4 text-cyan-700" /> {copy.toolbar.groupBy}</p>
          <div className="space-y-1">
            {groups?.map((group) => (
              <ToolbarMenuLink
                key={group.value}
                href={toolbarHref(basePath, { q: search, filter: activeFilter, groupBy: group.value, view: activeView, lang: locale })}
                active={groupBy === group.value}
              >
                {translateAdminFilter(locale, group.value, group.label)}
              </ToolbarMenuLink>
            ))}
            {groupBy ? (
              <ToolbarMenuLink href={toolbarHref(basePath, { q: search, filter: activeFilter, view: activeView, lang: locale })} muted>
                {copy.toolbar.noGrouping}
              </ToolbarMenuLink>
            ) : null}
          </div>
        </div>

        <div className="p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-black text-ink"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {copy.toolbar.favorites}</p>
          <div className="space-y-1">
            {(favorites ?? []).map((favorite) => (
              <ToolbarMenuLink
                key={favorite.label}
                href={favorite.href ?? toolbarHref(basePath, { q: search, filter: favorite.filter, groupBy: favorite.groupBy, view: activeView, lang: locale })}
              >
                {translateAdminText(locale, favorite.label)}
              </ToolbarMenuLink>
            ))}
            <span className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-400">{copy.toolbar.saveCurrentSearch}</span>
          </div>
        </div>
      </div>
    </details>
  );
}

function ToolbarMenuLink({
  href,
  active = false,
  muted = false,
  children,
}: {
  href: string;
  active?: boolean;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        const details = event.currentTarget.closest("details");
        if (details) details.open = false;
      }}
      className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
        active
          ? "bg-slate-100 text-ink"
          : muted
            ? "text-slate-500 hover:bg-slate-50"
            : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
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
