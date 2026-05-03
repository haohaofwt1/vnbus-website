import type { Metadata } from "next";
import { HeroSearch, HomepageSectionRenderer } from "@/components/home/HomepageMarketplace";
import { getHomepageSections } from "@/lib/homepage.config";
import { getHomepageData } from "@/lib/homepage-data";
import { resolveLocale } from "@/lib/i18n";

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
  const data = await getHomepageData(locale);
  const sections = getHomepageSections(locale);

  return (
    <>
      <HeroSearch data={data.formOptions} heroImage={data.config.heroImage} locale={locale} />
      <HomepageSectionRenderer sections={sections} data={data} locale={locale} />
    </>
  );
}
