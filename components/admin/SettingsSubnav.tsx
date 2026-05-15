"use client";

import Link from "next/link";
import { useAdminCopy, useAdminLocale, adminLocalizedHref } from "@/components/admin/admin-i18n";

export function SettingsSubnav({ active }: { active?: string }) {
  const copy = useAdminCopy();
  const locale = useAdminLocale();

  const settingsLinks = [
    { href: "/admin/content/header", label: copy.texts["Header"] || "Header" },
    { href: "/admin/content/homepage", label: copy.texts["Homepage content"] || "Homepage content" },
    { href: "/admin/content/vehicle-page", label: copy.texts["Vehicle page"] || "Vehicle page" },
    { href: "/admin/content/payments", label: copy.texts["Payments"] || "Payments" },
    { href: "/admin/content/policy", label: copy.texts["Policy"] || "Policy" },
    { href: "/admin/content/footer", label: copy.texts["Footer"] || "Footer" },
    { href: "/admin/content/search-labels", label: copy.texts["Search labels"] || "Search labels" },
  ];

  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {settingsLinks.map((item) => (
        <Link
          key={item.href}
          href={adminLocalizedHref(item.href, locale)}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            active === item.href
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-ink"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
