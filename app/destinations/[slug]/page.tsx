import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CityCard } from "@/components/CityCard";
import { RouteCard } from "@/components/RouteCard";
import { SectionHeader } from "@/components/SectionHeader";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getDestinationBySlug } from "@/lib/data";
import { resolveLocale, withLang } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDestinationBySlug(slug);

  if (!data) {
    return buildMetadata({
      title: "Destination not found",
      description: "The requested destination could not be found.",
      path: "/destinations",
    });
  }

  return buildMetadata({
    title: data.city.seoTitle,
    description: data.city.seoDescription,
    path: `/destinations/${data.city.slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function DestinationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const data = await getDestinationBySlug(slug);

  if (!data) {
    notFound();
  }

  const copy = {
    en: {
      home: "Home",
      search: "Search",
      guide: "Destination guide",
      title: `Travel to and from ${data.city.name}`,
      toDestination: "Popular routes to this destination",
      arrivingIn: `Routes arriving in ${data.city.name}`,
      fromDestination: "Routes from this destination",
      departingFrom: `Routes departing from ${data.city.name}`,
      howToGetThere: "How to get there",
      howToGetThereBody:
        `Use VNBus route pages to compare which departure cities have the strongest frequency into ${data.city.name}, then choose the vehicle type that best fits your arrival time, baggage needs, and transfer style.`,
      bestTime: "Best time to visit",
      bestTimeBody:
        "Review seasonal weather, local holidays, and public-event peaks before traveling. High-demand dates usually book earlier and benefit from manual confirmation, especially for premium or cross-border services.",
      localTips: "Local travel tips",
      localTipsBody:
        "Choose drop-off points close to your accommodation, confirm whether the operator arrives at a central office or hotel zone, and allow time for onward local transport if you are connecting to airports or attractions.",
      nearby: "Nearby destinations",
      faqs: "FAQs",
      faqTitle: `Questions about ${data.city.name}`,
      ctaTitle: `Search routes for ${data.city.name}`,
      ctaBody:
        "Continue exploring route availability, pickup points, and operator choices by launching a new database-backed search from this destination page.",
      searchRoutes: "Search routes",
    },
    vi: {
      home: "Trang chủ",
      search: "Tìm chuyến",
      guide: "Cẩm nang điểm đến",
      title: `Di chuyển đến và đi từ ${data.city.name}`,
      toDestination: "Tuyến phổ biến đến điểm này",
      arrivingIn: `Các tuyến đi đến ${data.city.name}`,
      fromDestination: "Tuyến khởi hành từ điểm này",
      departingFrom: `Các tuyến đi từ ${data.city.name}`,
      howToGetThere: "Cách đi đến đây",
      howToGetThereBody:
        `Dùng trang tuyến của VNBus để so sánh thành phố nào có tần suất cao nhất đi vào ${data.city.name}, sau đó chọn loại xe phù hợp với giờ đến, hành lý và kiểu trung chuyển của bạn.`,
      bestTime: "Thời điểm nên đi",
      bestTimeBody:
        "Hãy xem thời tiết theo mùa, ngày lễ và các giai đoạn cao điểm trước khi đi. Những ngày nhu cầu cao thường cần đặt sớm hơn và nên được xác nhận thủ công, đặc biệt với dịch vụ cao cấp hoặc tuyến quốc tế.",
      localTips: "Mẹo di chuyển tại điểm đến",
      localTipsBody:
        "Nên chọn điểm trả gần nơi lưu trú, xác nhận nhà xe trả tại văn phòng trung tâm hay khu khách sạn, và chừa thời gian cho chặng địa phương tiếp theo nếu bạn nối chuyến ra sân bay hoặc điểm tham quan.",
      nearby: "Điểm đến lân cận",
      faqs: "Hỏi đáp",
      faqTitle: `Câu hỏi về ${data.city.name}`,
      ctaTitle: `Tìm tuyến cho ${data.city.name}`,
      ctaBody:
        "Tiếp tục khám phá tình trạng tuyến, điểm đón và lựa chọn nhà xe bằng cách mở tìm kiếm mới từ trang điểm đến này.",
      searchRoutes: "Tìm tuyến",
    },
    ko: {
      home: "홈",
      search: "노선 검색",
      guide: "목적지 가이드",
      title: `${data.city.name} 이동 가이드`,
      toDestination: "이 목적지로 가는 인기 노선",
      arrivingIn: `${data.city.name} 도착 노선`,
      fromDestination: "이 목적지에서 출발하는 노선",
      departingFrom: `${data.city.name} 출발 노선`,
      howToGetThere: "가는 방법",
      howToGetThereBody:
        `${data.city.name}로 들어오는 주요 출발지를 VNBus 노선 페이지에서 비교한 뒤, 도착 시간과 수하물, 환승 방식에 맞는 차량 유형을 선택하세요.`,
      bestTime: "방문하기 좋은 시기",
      bestTimeBody:
        "여행 전 계절별 날씨, 현지 공휴일, 이벤트 성수기를 확인하세요. 수요가 높은 날짜는 보통 더 빨리 마감되며, 프리미엄이나 국경 간 서비스는 수동 확인이 특히 유리합니다.",
      localTips: "현지 이동 팁",
      localTipsBody:
        "숙소와 가까운 하차 지점을 선택하고, 운영사가 중앙 사무실 또는 호텔 구역에 도착하는지 확인하세요. 공항이나 관광지로 환승할 경우 추가 현지 이동 시간을 고려해야 합니다.",
      nearby: "주변 목적지",
      faqs: "FAQ",
      faqTitle: `${data.city.name} 관련 질문`,
      ctaTitle: `${data.city.name} 노선 검색`,
      ctaBody:
        "이 목적지 페이지에서 새 검색을 시작해 노선 가용성, 탑승 지점, 운영사 선택지를 계속 확인하세요.",
      searchRoutes: "노선 검색",
    },
    ja: {
      home: "ホーム",
      search: "検索",
      guide: "目的地ガイド",
      title: `${data.city.name}への移動ガイド`,
      toDestination: "この目的地への人気路線",
      arrivingIn: `${data.city.name}に到着する路線`,
      fromDestination: "この目的地から出発する路線",
      departingFrom: `${data.city.name}から出発する路線`,
      howToGetThere: "行き方",
      howToGetThereBody:
        `${data.city.name}へ向かう主要出発地を VNBus の路線ページで比較し、到着時間、荷物、乗り継ぎスタイルに合う車両タイプを選んでください。`,
      bestTime: "訪れるのに良い時期",
      bestTimeBody:
        "旅行前に季節の天候、現地の祝日、イベントの繁忙期を確認してください。需要の高い日は早めの予約が必要で、プレミアム便や越境便では手動確認が特に有効です。",
      localTips: "現地移動のヒント",
      localTipsBody:
        "宿泊先に近い降車ポイントを選び、運行会社が中心オフィスまたはホテルエリアに到着するか確認してください。空港や観光地へ乗り継ぐ場合は追加の移動時間を見込んでください。",
      nearby: "近くの目的地",
      faqs: "FAQ",
      faqTitle: `${data.city.name}に関する質問`,
      ctaTitle: `${data.city.name}の路線を検索`,
      ctaBody:
        "この目的地ページから新しい検索を開始して、路線の空き状況、乗車ポイント、運行会社の選択肢を引き続き確認できます。",
      searchRoutes: "路線を検索",
    },
  }[locale];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: copy.home, path: "/" },
    { name: copy.search, path: "/search" },
    { name: data.city.name, path: `/destinations/${data.city.slug}` },
  ]);

  const faqSchema = data.city.faqs.length
    ? buildFaqSchema(
        data.city.faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
      )
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <section className="section-space">
        <div className="container-shell space-y-10">
          <Breadcrumbs
            items={[
              { label: copy.home, href: withLang("/", locale) },
              { label: copy.search, href: withLang("/search", locale) },
              { label: data.city.name },
            ]}
          />

          <div className="card-surface overflow-hidden p-8 sm:p-10">
            <p className="eyebrow">{copy.guide}</p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-4xl text-base leading-8 text-muted">
              {data.city.description}
            </p>
          </div>

          <section className="space-y-5">
            <SectionHeader eyebrow={copy.toDestination} title={copy.arrivingIn} />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.city.toRoutes.map((route) => (
                <RouteCard key={route.id} route={route} locale={locale} />
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader eyebrow={copy.fromDestination} title={copy.departingFrom} />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.city.fromRoutes.map((route) => (
                <RouteCard key={route.id} route={route} locale={locale} />
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="card-surface p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.howToGetThere}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">{copy.howToGetThereBody}</p>
            </div>

            <div className="card-surface p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.bestTime}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">{copy.bestTimeBody}</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="card-surface p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.localTips}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">{copy.localTipsBody}</p>
            </div>

            <div className="card-surface p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.nearby}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {data.nearbyDestinations.map((city) => (
                  <CityCard key={city.id} city={city} locale={locale} />
                ))}
              </div>
            </div>
          </section>

          {data.city.faqs.length ? (
            <section className="space-y-5">
              <SectionHeader eyebrow={copy.faqs} title={copy.faqTitle} />
              <FAQAccordion items={data.city.faqs} />
            </section>
          ) : null}

          <section className="rounded-[2rem] bg-brand-700 px-8 py-10 text-white">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
                  {copy.ctaTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-brand-100">
                  {copy.ctaBody}
                </p>
              </div>
              <Link
                href={withLang(`/search?to=${data.city.slug}`, locale)}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                {copy.searchRoutes}
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
