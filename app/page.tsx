import type { Metadata } from "next";
import { AICopilotSection } from "@/components/home/AICopilotSection";
import {
  IntentSection,
  MarketplaceCompactGrid,
  RecommendedTrips,
} from "@/components/home/FutureHomeSections";
import { HeroTravelConsole } from "@/components/home/HeroTravelConsole";
import { getHomepagePopularSearches } from "@/lib/data";
import { getFutureHomeData } from "@/lib/future-home-data";
import { resolveLocale, withLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Đặt vé xe khách toàn quốc | VNBus",
  description:
    "So sánh giá, chọn chỗ, thanh toán dễ dàng và được VNBus hỗ trợ tận tâm trước, trong và sau chuyến đi.",
};

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const [data, popularSearches] = await Promise.all([
    getFutureHomeData(),
    getHomepagePopularSearches(3),
  ]);

  return (
    <div className="bg-[#F6F9FC]">
      <HeroTravelConsole
        locations={data.locations}
        vehicleOptions={data.vehicleOptions}
        heroImage={data.heroImage}
        locale={locale}
        popularSearches={popularSearches.map((item) => ({
          label: item.label.replace(/\s*->\s*/g, " → "),
          href: withLang(item.href, locale),
        }))}
      />
      <IntentSection items={data.intents} locale={locale} />
      <RecommendedTrips items={data.featuredTrips} locale={locale} />
      <MarketplaceCompactGrid vehicles={data.vehicles} operators={data.operators} locale={locale} />
      <AICopilotSection locale={locale} />
    </div>
  );
}
