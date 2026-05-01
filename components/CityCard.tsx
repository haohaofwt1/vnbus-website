import Image from "next/image";
import Link from "next/link";
import { type Locale, withLang } from "@/lib/i18n";

type CityCardProps = {
  city: {
    slug: string;
    name: string;
    imageUrl: string;
    description: string;
    routeCount?: number;
    country: string;
  };
  locale?: Locale;
};

export function CityCard({ city, locale = "en" }: CityCardProps) {
  const copy = {
    en: {
      activeRoutes: "active routes",
      explore: "Explore destination",
    },
    vi: {
      activeRoutes: "tuyến đang mở",
      explore: "Xem điểm đến",
    },
    ko: {
      activeRoutes: "운행 중 노선",
      explore: "도시 보기",
    },
    ja: {
      activeRoutes: "公開中の路線",
      explore: "目的地を見る",
    },
  }[locale];

  return (
    <article className="card-surface overflow-hidden">
      <div className="relative h-44 bg-slate-100">
        <Image src={city.imageUrl} alt={city.name} fill className="object-cover" />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
          {city.country}
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          {city.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted">{city.description}</p>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {city.routeCount ?? 0} {copy.activeRoutes}
          </span>
          <Link
            href={withLang(`/destinations/${city.slug}`, locale)}
            className="text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            {copy.explore}
          </Link>
        </div>
      </div>
    </article>
  );
}
