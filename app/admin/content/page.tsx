import Link from "next/link";
import { ArrowRight, Banknote, CarFront, FileText, Home, Languages, PanelBottom, PanelTop } from "lucide-react";
import { adminCopy } from "@/components/admin/admin-copy";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { resolveLocale, withLang } from "@/lib/i18n";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const locale = params.lang ? resolveLocale(params.lang) : "en";
  const t = adminCopy[locale]?.texts ?? adminCopy.en.texts;

  const settingsCards = [
    {
      href: "/admin/content/header",
      title: t["Header"] || "Header",
      body: t["Header description"] || "Logo, site name and multilingual public header tagline.",
      icon: PanelTop,
    },
    {
      href: "/admin/content/homepage",
      title: t["Homepage content"] || "Homepage content",
      body: t["Homepage description"] || "Hero, search suggestions, need cards and homepage blocks.",
      icon: Home,
    },
    {
      href: "/admin/content/vehicle-page",
      title: t["Vehicle page"] || "Vehicle page",
      body: t["Vehicle page description"] || "Banner image and public vehicle page asset settings.",
      icon: CarFront,
    },
    {
      href: "/admin/content/payments",
      title: t["Payments"] || "Payments",
      body: t["Payment description"] || "Payment providers, bank QR, VNPay, Stripe and checkout availability.",
      icon: Banknote,
    },
    {
      href: "/admin/content/policy",
      title: t["Policy"] || "Policy",
      body: t["Policy description"] || "Public policy pages for booking, cancellation, payment and support.",
      icon: FileText,
    },
    {
      href: "/admin/content/footer",
      title: t["Footer"] || "Footer",
      body: t["Footer description"] || "Footer description, contact phones, social links and groups.",
      icon: PanelBottom,
    },
    {
      href: "/admin/content/search-labels",
      title: t["Search labels"] || "Search labels",
      body: t["Search labels description"] || "Multilingual labels for search, filters, trip cards and badges.",
      icon: Languages,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow={adminCopy[locale]?.modules?.content || adminCopy.en.modules.content}
        title={t["Website settings"] || "Website settings"}
        description={t["Settings description"] || "Settings have been split into subpages for easier management, avoiding a very long screen."}
        secondaryAction={{ href: "/", label: t["View website"] || "View website" }}
      />

      <SettingsSubnav />

      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message={t["Database missing content table"] || "Database is missing the new Website Content table. Please run the migration and try saving again."} /> : null}

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {settingsCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={withLang(item.href, locale)}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-black text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-700">
                {t["Open settings"] || "Open settings"} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
