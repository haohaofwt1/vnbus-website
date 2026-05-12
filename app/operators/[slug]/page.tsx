import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ReviewSection } from "@/components/ReviewSection";
import { RouteCard } from "@/components/RouteCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TripCard } from "@/components/TripCard";
import { getOperatorBySlug } from "@/lib/data";
import { resolveLocale, withLang } from "@/lib/i18n";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getOperatorBySlug(slug);

  if (!data) {
    return buildMetadata({
      title: "Operator not found",
      description: "The requested operator could not be found.",
      path: "/operators",
    });
  }

  return buildMetadata({
    title: data.operator.name,
    description: data.operator.description,
    path: `/operators/${data.operator.slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function OperatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; review?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const data = await getOperatorBySlug(slug);

  if (!data) {
    notFound();
  }

  const copy = {
    en: {
      home: "Home",
      search: "Search",
      profile: "Operator profile",
      rating: "Rating",
      verified: "Verified operator",
      highlights: "Operator highlights",
      tripsInFeed: "Trips in sample feed",
      vehicleTypes: "Vehicle types",
      website: "Website",
      amenities: "Amenities",
      popularRoutes: "Popular routes",
      routesServed: "Routes served by this operator",
      trips: "Trips",
      upcomingDepartures: "Upcoming departures from this operator",
      upcomingBody:
        "Operator pages reuse the same trip card component as search and route pages for consistency and performance.",
      customerReviews: "Customer reviews",
      bookingNotes: "Booking notes",
      bookingNoteOne:
        "Confirm boarding location and baggage allowance before departure, especially on airport or hotel-pickup services.",
      bookingNoteTwo:
        "For cross-border routes, carry identification and check entry requirements in advance. VNBus can later connect this operator record to a real auth and partner portal workflow.",
      faqs: "FAQs",
      faqTitle: "Operator questions and answers",
      ctaTitle: `Compare ${data.operator.name} against other operators`,
      ctaBody:
        "Search routes to compare this operator’s pricing, pickup points, and vehicle types against the rest of the active marketplace.",
      searchTrips: "Search trips",
    },
    vi: {
      home: "Trang chủ",
      search: "Tìm chuyến",
      profile: "Hồ sơ nhà xe",
      rating: "Đánh giá",
      verified: "Nhà xe đã xác minh",
      highlights: "Điểm nổi bật",
      tripsInFeed: "Chuyến trong dữ liệu mẫu",
      vehicleTypes: "Loại xe",
      website: "Website",
      amenities: "Tiện ích",
      popularRoutes: "Tuyến nổi bật",
      routesServed: "Các tuyến nhà xe đang khai thác",
      trips: "Chuyến đi",
      upcomingDepartures: "Các chuyến sắp khởi hành của nhà xe này",
      upcomingBody:
        "Trang nhà xe tái sử dụng cùng một trip card như trang tìm chuyến và trang tuyến để giữ trải nghiệm đồng nhất và gọn nhẹ.",
      customerReviews: "Đánh giá khách hàng",
      bookingNotes: "Lưu ý đặt chỗ",
      bookingNoteOne:
        "Hãy xác nhận điểm lên xe và quy định hành lý trước giờ khởi hành, đặc biệt với các dịch vụ đón ở sân bay hoặc khách sạn.",
      bookingNoteTwo:
        "Với các tuyến quốc tế, hãy mang giấy tờ tùy thân và kiểm tra yêu cầu nhập cảnh trước. Về sau, VNBus có thể kết nối hồ sơ nhà xe này với cổng đối tác và luồng xác thực thật.",
      faqs: "Hỏi đáp",
      faqTitle: "Câu hỏi và trả lời về nhà xe",
      ctaTitle: `So sánh ${data.operator.name} với các nhà xe khác`,
      ctaBody:
        "Tìm tuyến để so sánh giá, điểm đón và loại xe của nhà xe này với các lựa chọn khác đang hoạt động trên marketplace.",
      searchTrips: "Tìm chuyến",
    },
    ko: {
      home: "홈",
      search: "노선 검색",
      profile: "운영사 프로필",
      rating: "평점",
      verified: "인증된 운영사",
      highlights: "운영사 하이라이트",
      tripsInFeed: "샘플 피드 내 운행 수",
      vehicleTypes: "차량 유형",
      website: "웹사이트",
      amenities: "편의시설",
      popularRoutes: "인기 노선",
      routesServed: "이 운영사가 운행하는 노선",
      trips: "운행",
      upcomingDepartures: "이 운영사의 예정 출발편",
      upcomingBody:
        "운영사 페이지는 검색 페이지와 노선 페이지와 같은 trip card 컴포넌트를 재사용해 일관성과 성능을 유지합니다.",
      customerReviews: "고객 리뷰",
      bookingNotes: "예약 메모",
      bookingNoteOne:
        "출발 전에 탑승 위치와 수하물 허용량을 확인하세요. 특히 공항이나 호텔 픽업 서비스에서 중요합니다.",
      bookingNoteTwo:
        "국경 간 노선은 신분증과 입국 요건을 미리 확인하세요. 나중에는 이 운영사 레코드를 실제 인증 및 파트너 포털 흐름과 연결할 수 있습니다.",
      faqs: "FAQ",
      faqTitle: "운영사 관련 자주 묻는 질문",
      ctaTitle: `${data.operator.name}을 다른 운영사와 비교`,
      ctaBody:
        "노선을 검색해 이 운영사의 가격, 탑승 지점, 차량 유형을 다른 활성 운영사와 비교하세요.",
      searchTrips: "운행 검색",
    },
    ja: {
      home: "ホーム",
      search: "検索",
      profile: "運行会社プロフィール",
      rating: "評価",
      verified: "認証済みの運行会社",
      highlights: "運行会社の特徴",
      tripsInFeed: "サンプルフィードの便数",
      vehicleTypes: "車両タイプ",
      website: "ウェブサイト",
      amenities: "設備",
      popularRoutes: "人気路線",
      routesServed: "この運行会社の対応路線",
      trips: "便",
      upcomingDepartures: "この運行会社の今後の便",
      upcomingBody:
        "運行会社ページでは、検索ページや路線ページと同じ trip card コンポーネントを再利用し、一貫性と性能を保ちます。",
      customerReviews: "利用者レビュー",
      bookingNotes: "予約メモ",
      bookingNoteOne:
        "出発前に乗車場所と荷物許容量を確認してください。特に空港・ホテル送迎では重要です。",
      bookingNoteTwo:
        "越境路線では身分証明書を持参し、入国条件を事前に確認してください。将来的にこの運行会社データを実際の認証やパートナーポータルと連携できます。",
      faqs: "FAQ",
      faqTitle: "運行会社に関する質問と回答",
      ctaTitle: `${data.operator.name} を他の運行会社と比較`,
      ctaBody:
        "路線を検索して、この運行会社の料金、乗車地点、車両タイプを他の運行会社と比較してください。",
      searchTrips: "便を検索",
    },
  }[locale];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: copy.home, path: "/" },
    { name: copy.search, path: "/search" },
    { name: data.operator.name, path: `/operators/${data.operator.slug}` },
  ]);

  const faqSchema = data.operator.faqs.length
    ? buildFaqSchema(
        data.operator.faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
      )
    : null;

  const routes = data.popularRoutes
    .map((route) =>
      data.operator.trips.find((trip) => trip.route.id === route.id)?.route,
    )
    .filter(Boolean);

  const amenities = Array.from(new Set(data.operator.trips.flatMap((trip) => trip.amenities)));
  const websiteHost = data.operator.website.replace("https://", "");
  const trustMetrics = [
    { label: copy.rating, value: `${data.operator.rating.toFixed(1)} / 5` },
    { label: copy.tripsInFeed, value: data.operator.trips.length.toString() },
    { label: copy.vehicleTypes, value: data.vehicleTypes.length.toString() },
    { label: copy.amenities, value: amenities.length.toString() },
  ];
  const whyChoosePoints =
    locale === "vi"
      ? [
          "Điểm đón và lịch trình hiển thị rõ, dễ so sánh nhanh.",
          "Loại xe đa dạng theo nhu cầu: cabin, giường, ghế ngồi.",
          "Đánh giá và độ tin cậy hiển thị trực tiếp trên từng chuyến.",
        ]
      : [
          "Clear pickup and schedule details for fast comparison.",
          "Multiple vehicle formats to match different trip needs.",
          "Rating and trust signals are visible on every trip.",
        ];

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
              { label: data.operator.name },
            ]}
          />

          <div className="card-surface overflow-hidden p-7 sm:p-9">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#F8FBFF_0%,#FFFFFF_55%,#FDF2E8_100%)] p-6 sm:p-8">
              <p className="eyebrow">{copy.profile}</p>
              <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {data.operator.name}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                {data.operator.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  {copy.rating} {data.operator.rating.toFixed(1)} / 5
                </span>
                {data.operator.verified ? (
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    {copy.verified}
                  </span>
                ) : null}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={withLang("/search", locale)}
                  className="inline-flex items-center justify-center rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  {copy.searchTrips}
                </Link>
                <Link
                  href={data.operator.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {copy.website}: {websiteHost}
                </Link>
              </div>
            </div>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {trustMetrics.map((metric) => (
              <div key={metric.label} className="card-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                  {metric.value}
                </p>
              </div>
            ))}
          </section>

          <section className="card-surface p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
              {copy.highlights}
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
              {whyChoosePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow={copy.trips}
              title={copy.upcomingDepartures}
              description={copy.upcomingBody}
            />
            {data.operator.trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} showRoute locale={locale} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="card-surface p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {locale === "vi" ? "Dịch vụ & phương tiện" : "Service & vehicle mix"}
              </h2>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                {copy.vehicleTypes}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.vehicleTypes.map((vehicleType) => (
                  <span
                    key={vehicleType.id}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  >
                    {vehicleType.name}
                  </span>
                ))}
              </div>
              <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                {copy.amenities}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {amenities.slice(0, 10).map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.popularRoutes}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted">{copy.routesServed}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {routes.slice(0, 4).map((route) =>
                  route ? <RouteCard key={route.id} route={route} locale={locale} /> : null,
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="card-surface p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.bookingNotes}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
                <p>{copy.bookingNoteOne}</p>
                <p>{copy.bookingNoteTwo}</p>
              </div>
            </div>
          </section>

          <ReviewSection
            locale={locale}
            reviews={data.operator.reviews}
            operatorId={data.operator.id}
            returnTo={withLang(`/operators/${data.operator.slug}`, locale)}
            reviewStatus={search.review}
            eyebrow={copy.customerReviews}
            emptyBody={
              locale === "vi"
                ? "Nếu bạn từng đi với nhà xe này, hãy để lại đánh giá về điểm đón, thái độ phục vụ, độ thoải mái và độ đúng giờ."
                : undefined
            }
          />

          {data.operator.faqs.length ? (
            <section className="space-y-5">
              <SectionHeader eyebrow={copy.faqs} title={copy.faqTitle} />
              <FAQAccordion items={data.operator.faqs} />
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
                href={withLang("/search", locale)}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                {copy.searchTrips}
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
