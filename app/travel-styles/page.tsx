import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Globe2, Luggage, Plane, Sparkles, Star, Users } from "lucide-react";
import { resolveLocale, withLang } from "@/lib/i18n";
import { getTravelStylesPageCopy } from "@/lib/public-locale-copy";
import { buildMetadata } from "@/lib/seo";
import { getHomepageSettings } from "@/lib/site-settings";

export const metadata: Metadata = buildMetadata({
  title: "Travel styles",
  description: "Choose VNBus routes by travel style, comfort need and pickup situation.",
  path: "/travel-styles",
});

export const dynamic = "force-dynamic";

const icons = [Plane, Users, Clock3, Globe2, Luggage, Star, Sparkles];

export default async function TravelStylesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const pageCopy = getTravelStylesPageCopy(locale);
  const homepage = await getHomepageSettings();

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <div>
          <p className="eyebrow">{pageCopy.eyebrow}</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-black text-ink">{pageCopy.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            {pageCopy.body}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {homepage.styleSection.cards.map((card, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <Link key={card.title} href={withLang(`/search?smart=${card.smart}`, locale)} className="card-surface p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-6 w-6" /></span>
                <h2 className="mt-5 text-xl font-black text-ink">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
                <p className="mt-4 text-xs font-black uppercase text-orange-600">{card.vehicle}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700">
                  {pageCopy.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
