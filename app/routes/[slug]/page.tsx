import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3, Luggage, MapPinned, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComfortLevel } from "@/components/ComfortLevel";
import { CrossBorderNotice } from "@/components/CrossBorderNotice";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OperatorCard } from "@/components/OperatorCard";
import { ReviewSection } from "@/components/ReviewSection";
import { RouteCard } from "@/components/RouteCard";
import { SearchBox } from "@/components/SearchBox";
import { SectionHeader } from "@/components/SectionHeader";
import { TripCard } from "@/components/TripCard";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { getRouteBySlug, getSearchFormOptions } from "@/lib/data";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getComfortScore, getRouteTrustScore } from "@/lib/travel-ui";
import { formatCurrency } from "@/lib/utils";
import { getRouteLabel, resolveLocale, withLang } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRouteBySlug(slug);

  if (!data) {
    return buildMetadata({
      title: "Route not found",
      description: "The requested route could not be found.",
      path: "/routes",
    });
  }

  return buildMetadata({
    title: data.route.seoTitle,
    description: data.route.seoDescription,
    path: `/routes/${data.route.slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function RoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; review?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const [data, searchData] = await Promise.all([getRouteBySlug(slug), getSearchFormOptions()]);

  if (!data) {
    notFound();
  }

  const { route, relatedRoutes } = data;
  const routeName = getRouteLabel(route.fromCity.name, route.toCity.name, locale);
  const trustScore = getRouteTrustScore({
    estimatedDuration: route.estimatedDuration,
    tripCount: route.trips.length,
    isInternational: route.isInternational,
  });
  const pickupPoints = Array.from(new Set(route.trips.map((trip) => trip.pickupPoint)));
  const dropoffPoints = Array.from(new Set(route.trips.map((trip) => trip.dropoffPoint)));
  const vehicleTypes = Array.from(
    new Map(route.trips.map((trip) => [trip.vehicleType.id, trip.vehicleType])).values(),
  );
  const operators = Array.from(
    new Map(
      route.trips.map((trip) => [
        trip.operator.id,
        {
          ...trip.operator,
          trips: route.trips
            .filter((candidate) => candidate.operator.id === trip.operator.id)
            .map((candidate) => ({
              routeId: candidate.routeId,
              route: { isInternational: route.isInternational },
              vehicleType: { name: candidate.vehicleType.name },
            })),
        },
      ]),
    ).values(),
  );

  const copy = {
    en: {
      home: "Home",
      routes: "Routes",
      guide: "Route guide",
      title: `Bus from ${route.fromCity.name} to ${route.toCity.name}`,
      subtitle:
        route.shortDescription ||
        `${routeName} is best planned with clear pickup expectations, the right vehicle style, and realistic comfort notes before booking.`,
      routeOverview: "Route overview",
      routeOverviewBody:
        `${routeName} is a ${
          route.isInternational ? "cross-border" : "traveller-friendly"
        } route suited to ${
          route.isInternational
            ? "travellers who want operator guidance, border notes, and manual confirmation before payment."
            : "airport arrivals, hotel transfers, and straightforward city-to-city planning."
        }`,
      bestWay: `Best way from ${route.fromCity.name} to ${route.toCity.name}`,
      bestWayBody:
        "The best option depends on how much comfort, luggage space, and pickup flexibility you need. VNBus highlights the trade-offs clearly before you request a booking.",
      whatToKnow: "What to know before you go",
      pickupQuestion: "Where is the pickup point?",
      pickupAnswer:
        "Pickup can vary by operator, so VNBus highlights common pickup locations and asks for manual confirmation before payment to reduce confusion.",
      durationQuestion: "How long does the trip take?",
      durationAnswer: `Most trips are planned around ${route.estimatedDuration}, though traffic, border timing, and weather can affect actual arrival time.`,
      firstTimeQuestion: "Is this route good for first-time travellers?",
      firstTimeAnswer:
        route.isInternational
          ? "Yes, if you want clearer border notes and operator guidance before committing. Travellers should still confirm passport and visa requirements themselves."
          : "Yes. It is particularly helpful for travellers who want clear pickup details and a simple city-to-city comparison before booking.",
      luggageQuestion: "Luggage notes",
      luggageAnswer:
        "Luggage rules vary by vehicle type and operator. Carry-ons are usually straightforward, while larger bags should be confirmed during the manual confirmation step.",
      departures: "Available departures",
      departuresTitle: "Compare live departures for this route",
      departuresBody:
        "Review comfort, pickup clarity, trust score, and manual confirmation notes before requesting a booking.",
      operators: "Popular operators",
      operatorsTitle: "Operators travellers usually compare on this route",
      operatorsBody:
        "Look beyond price and compare who is best for clear pickup, comfort, and tourist-friendly support.",
      faq: "FAQ",
      faqTitle: "Common questions for this route",
      related: "Related routes",
      relatedTitle: "Keep planning nearby routes",
      relatedBody:
        "If this route is not the right fit, nearby route guides can help you compare alternative departure cities and comfort options.",
      metrics: {
        distance: "Distance",
        duration: "Duration",
        priceFrom: "From price",
        departures: "Daily departures",
      },
      notes: {
        arrival: "Arrive 20-30 minutes before departure",
        border: "Allow extra time for border processing",
        support: "Support handoff available if needed",
      },
      compareVehicle: "Should I choose shuttle, limousine, or private transfer?",
      comfortFit: "Best for",
      seoGuide: "Route planning notes",
      pickupList: "Pickup",
      dropoffList: "Drop-off",
      exploreAll: "Search all routes",
    },
    vi: {
      home: "Trang chủ",
      routes: "Tuyến xe",
      guide: "Cẩm nang tuyến",
      title: `Xe từ ${route.fromCity.name} đến ${route.toCity.name}`,
      subtitle:
        route.shortDescription ||
        `${routeName} phù hợp hơn khi bạn biết rõ điểm đón, chọn đúng loại xe và hiểu trước mức độ thoải mái.`,
      routeOverview: "Tổng quan tuyến",
      routeOverviewBody:
        `${routeName} là ${
          route.isInternational ? "tuyến quốc tế" : "tuyến thân thiện với hành khách"
        } phù hợp cho ${
          route.isInternational
            ? "người muốn có ghi chú qua biên giới, hỗ trợ từ nhà xe và xác nhận thủ công trước thanh toán."
            : "khách vừa ra sân bay, trung chuyển khách sạn hoặc cần so sánh city-to-city rõ ràng."
        }`,
      bestWay: `Cách đi phù hợp từ ${route.fromCity.name} đến ${route.toCity.name}`,
      bestWayBody:
        "Phương án phù hợp nhất phụ thuộc vào mức thoải mái, hành lý và độ linh hoạt điểm đón bạn cần. VNBus làm rõ các đánh đổi đó trước khi bạn gửi yêu cầu đặt chỗ.",
      whatToKnow: "Điều cần biết trước khi đi",
      pickupQuestion: "Điểm đón ở đâu?",
      pickupAnswer:
        "Điểm đón có thể thay đổi theo nhà xe, vì vậy VNBus hiển thị các điểm phổ biến và yêu cầu xác nhận thủ công trước thanh toán để hạn chế nhầm lẫn.",
      durationQuestion: "Mất bao lâu?",
      durationAnswer: `Phần lớn chuyến được lên kế hoạch khoảng ${route.estimatedDuration}, nhưng giao thông, thủ tục cửa khẩu và thời tiết có thể ảnh hưởng đến giờ đến thực tế.`,
      firstTimeQuestion: "Tuyến này có phù hợp người đi lần đầu không?",
      firstTimeAnswer:
        route.isInternational
          ? "Có, nếu bạn muốn có ghi chú cửa khẩu rõ hơn và hướng dẫn từ nhà xe trước khi quyết định. Tuy vậy, hành khách vẫn cần tự kiểm tra yêu cầu hộ chiếu và visa."
          : "Có. Tuyến này đặc biệt hữu ích cho người muốn xem rõ điểm đón và so sánh city-to-city đơn giản trước khi đặt.",
      luggageQuestion: "Lưu ý hành lý",
      luggageAnswer:
        "Quy định hành lý thay đổi theo loại xe và nhà xe. Hành lý xách tay thường đơn giản, còn kiện lớn nên xác nhận ở bước xác nhận thủ công.",
      departures: "Các chuyến đang có",
      departuresTitle: "So sánh các chuyến đang mở cho tuyến này",
      departuresBody:
        "Xem độ thoải mái, độ rõ điểm đón, trust score và ghi chú xác nhận thủ công trước khi gửi yêu cầu đặt chỗ.",
      operators: "Nhà xe nổi bật",
      operatorsTitle: "Các nhà xe hành khách thường so sánh trên tuyến này",
      operatorsBody:
        "Đừng chỉ nhìn giá. Hãy so sánh nhà xe nào phù hợp hơn về điểm đón, độ thoải mái và hỗ trợ thân thiện cho du khách.",
      faq: "Hỏi đáp",
      faqTitle: "Câu hỏi thường gặp cho tuyến này",
      related: "Tuyến liên quan",
      relatedTitle: "Khám phá thêm các tuyến lân cận",
      relatedBody:
        "Nếu tuyến này chưa thật sự phù hợp, các tuyến lân cận có thể giúp bạn so sánh thêm điểm đi khác và mức thoải mái khác.",
      metrics: {
        distance: "Quãng đường",
        duration: "Thời lượng",
        priceFrom: "Giá từ",
        departures: "Chuyến mỗi ngày",
      },
      notes: {
        arrival: "Nên có mặt trước giờ đi 20-30 phút",
        border: "Nên chừa thêm thời gian cho thủ tục cửa khẩu",
        support: "Có thể bàn giao hỗ trợ nếu cần",
      },
      compareVehicle: "Nên chọn shuttle, limousine hay xe riêng?",
      comfortFit: "Phù hợp cho",
      seoGuide: "Ghi chú lên kế hoạch tuyến",
      pickupList: "Điểm đón",
      dropoffList: "Điểm trả",
      exploreAll: "Tìm tất cả tuyến",
    },
    ko: {
      home: "홈",
      routes: "노선",
      guide: "노선 가이드",
      title: `${route.fromCity.name}에서 ${route.toCity.name}까지`,
      subtitle:
        route.shortDescription ||
        `${routeName}는 픽업 위치, 차량 유형, 편안함을 먼저 확인하면 훨씬 쉬워집니다.`,
      routeOverview: "노선 개요",
      routeOverviewBody:
        `${routeName}는 ${
          route.isInternational ? "국경 간" : "여행자 친화적인"
        } 이동으로 ${
          route.isInternational
            ? "운영사 안내와 국경 메모, 수동 확인이 필요한 여행자에게 적합합니다."
            : "공항 도착 후 이동, 호텔 환승, 도시간 이동 계획에 적합합니다."
        }`,
      bestWay: `${route.fromCity.name}에서 ${route.toCity.name}까지 가장 잘 맞는 이동 방식`,
      bestWayBody:
        "가장 좋은 선택은 필요한 편안함, 수하물 공간, 픽업 유연성에 따라 달라집니다. VNBus는 예약 요청 전에 그 차이를 명확히 보여줍니다.",
      whatToKnow: "출발 전 알아둘 점",
      pickupQuestion: "픽업은 어디서 하나요?",
      pickupAnswer:
        "픽업 위치는 운영사마다 다를 수 있으므로, VNBus는 일반적인 픽업 장소를 보여주고 결제 전 수동 확인을 진행합니다.",
      durationQuestion: "소요 시간은 얼마나 걸리나요?",
      durationAnswer: `대부분의 편은 약 ${route.estimatedDuration} 기준으로 계획되지만, 교통 상황과 날씨, 국경 절차에 따라 달라질 수 있습니다.`,
      firstTimeQuestion: "처음 가는 여행자에게 괜찮은가요?",
      firstTimeAnswer:
        route.isInternational
          ? "네. 더 명확한 국경 메모와 운영사 안내가 필요할 때 도움이 됩니다. 다만 여권과 비자 조건은 직접 확인해야 합니다."
          : "네. 픽업 위치를 명확히 알고 단순한 도시간 비교를 원하는 여행자에게 특히 적합합니다.",
      luggageQuestion: "수하물 메모",
      luggageAnswer:
        "수하물 규정은 차량 유형과 운영사에 따라 다릅니다. 기내용 가방은 일반적이지만 큰 짐은 수동 확인 단계에서 확인하는 것이 좋습니다.",
      departures: "이용 가능한 출발편",
      departuresTitle: "이 노선의 실시간 출발편 비교",
      departuresBody:
        "예약 요청 전 편안함, 픽업 명확도, 신뢰 점수, 수동 확인 메모를 확인하세요.",
      operators: "추천 운영사",
      operatorsTitle: "이 노선에서 자주 비교되는 운영사",
      operatorsBody:
        "가격만 보지 말고, 픽업 명확도와 편안함, 여행자 지원 관점에서 비교하세요.",
      faq: "FAQ",
      faqTitle: "이 노선의 자주 묻는 질문",
      related: "연관 노선",
      relatedTitle: "주변 노선도 함께 계획하기",
      relatedBody:
        "이 노선이 맞지 않으면 인근 노선 가이드로 다른 출발지와 편안함 विकल्प을 비교해 보세요.",
      metrics: {
        distance: "거리",
        duration: "소요 시간",
        priceFrom: "최저가",
        departures: "일일 출발편",
      },
      notes: {
        arrival: "출발 20-30분 전 도착 권장",
        border: "국경 절차를 위해 여유 시간 확보",
        support: "필요 시 사람 지원 연결 가능",
      },
      compareVehicle: "셔틀, 리무진, 프라이빗 중 무엇이 좋을까요?",
      comfortFit: "적합한 경우",
      seoGuide: "노선 계획 메모",
      pickupList: "탑승 위치",
      dropoffList: "하차 위치",
      exploreAll: "전체 노선 검색",
    },
    ja: {
      home: "ホーム",
      routes: "路線",
      guide: "路線ガイド",
      title: `${route.fromCity.name}から${route.toCity.name}へ`,
      subtitle:
        route.shortDescription ||
        `${routeName} は乗車場所、車両タイプ、快適さを先に確認すると計画しやすくなります。`,
      routeOverview: "路線概要",
      routeOverviewBody:
        `${routeName} は ${
          route.isInternational ? "越境" : "旅行者向け"
        } ルートで ${
          route.isInternational
            ? "運行会社の案内、国境メモ、手動確認を重視する旅行者に向いています。"
            : "空港到着後の移動、ホテル送迎、都市間移動に向いています。"
        }`,
      bestWay: `${route.fromCity.name}から${route.toCity.name}へのおすすめ移動方法`,
      bestWayBody:
        "最適な選択は、必要な快適さ、荷物スペース、乗車場所の柔軟さによって変わります。VNBus は予約前にその違いをわかりやすく示します。",
      whatToKnow: "出発前に知っておきたいこと",
      pickupQuestion: "乗車場所はどこですか？",
      pickupAnswer:
        "乗車場所は運行会社によって異なるため、VNBus は一般的な場所を示し、支払い前に手動確認を行います。",
      durationQuestion: "どれくらい時間がかかりますか？",
      durationAnswer: `多くの便は約 ${route.estimatedDuration} を目安にしていますが、交通状況、天候、国境手続きで前後することがあります。`,
      firstTimeQuestion: "初めての旅行者にも向いていますか？",
      firstTimeAnswer:
        route.isInternational
          ? "はい。より明確な国境メモや運行会社案内がほしい旅行者に向いています。ただし、パスポートやビザ条件は各自で確認してください。"
          : "はい。乗車場所を事前に把握しながら、シンプルに都市間比較をしたい旅行者に向いています。",
      luggageQuestion: "荷物メモ",
      luggageAnswer:
        "荷物ルールは車両タイプや運行会社により異なります。機内持込サイズは問題ないことが多いですが、大きな荷物は手動確認時に確認すると安心です。",
      departures: "利用可能な出発便",
      departuresTitle: "この路線の便を比較する",
      departuresBody:
        "予約リクエスト前に、快適さ、乗車案内、信頼スコア、手動確認メモを確認できます。",
      operators: "人気の運行会社",
      operatorsTitle: "この路線でよく比較される運行会社",
      operatorsBody:
        "価格だけでなく、乗車場所のわかりやすさ、快適さ、旅行者向けサポートでも比較しましょう。",
      faq: "FAQ",
      faqTitle: "この路線でよくある質問",
      related: "関連路線",
      relatedTitle: "近くのルートも計画する",
      relatedBody:
        "この路線が合わない場合でも、近隣ルートを見れば別の出発地や快適さの選択肢が見つかります。",
      metrics: {
        distance: "距離",
        duration: "所要時間",
        priceFrom: "最安料金",
        departures: "1日の便数",
      },
      notes: {
        arrival: "出発20〜30分前の到着がおすすめ",
        border: "国境手続きのため余裕を持つ",
        support: "必要に応じて有人サポートへ引き継ぎ可能",
      },
      compareVehicle: "シャトル、リムジン、専用送迎のどれを選ぶべき？",
      comfortFit: "向いている旅",
      seoGuide: "ルート計画メモ",
      pickupList: "乗車場所",
      dropoffList: "降車場所",
      exploreAll: "すべての路線を検索",
    },
  }[locale];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: copy.home, path: "/" },
    { name: copy.routes, path: "/search" },
    { name: routeName, path: `/routes/${route.slug}` },
  ]);
  const faqSchema = route.faqs.length
    ? buildFaqSchema(
        route.faqs.map((faq) => ({
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
              { label: copy.routes, href: withLang("/search", locale) },
              { label: routeName },
            ]}
          />

          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_62%,#f8fafc_100%)] p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
              <div>
                <p className="eyebrow">{copy.guide}</p>
                <h1 className="mt-5 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {copy.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{copy.subtitle}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <TrustScoreBadge score={trustScore} locale={locale} />
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    {route.isInternational ? copy.notes.border : copy.notes.arrival}
                  </span>
                  <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                    {copy.notes.support}
                  </span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4">
                    <p className="text-sm text-slate-500">{copy.metrics.distance}</p>
                    <p className="mt-2 text-xl font-bold text-ink">{route.distanceKm} km</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4">
                    <p className="text-sm text-slate-500">{copy.metrics.duration}</p>
                    <p className="mt-2 text-xl font-bold text-ink">{route.estimatedDuration}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4">
                    <p className="text-sm text-slate-500">{copy.metrics.priceFrom}</p>
                    <p className="mt-2 text-xl font-bold text-ink">
                      {formatCurrency(route.priceFrom, route.currency)}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4">
                    <p className="text-sm text-slate-500">{copy.metrics.departures}</p>
                    <p className="mt-2 text-xl font-bold text-ink">{route.trips.length}</p>
                  </div>
                </div>
              </div>

              <SearchBox
                cities={searchData.cities}
                vehicleTypes={searchData.vehicleTypes}
                compact
                locale={locale}
                defaults={{
                  from: route.fromCity.slug,
                  to: route.toCity.slug,
                  vehicleType: "",
                }}
              />
            </div>
          </div>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="card-surface p-6 sm:p-8">
              <SectionHeader
                eyebrow={copy.routeOverview}
                title={copy.bestWay}
                description={copy.bestWayBody}
              />
              <div className="mt-6 space-y-5 text-base leading-8 text-muted">
                <p>{copy.routeOverviewBody}</p>
                {route.longDescription.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="card-surface p-6 sm:p-8">
              <SectionHeader eyebrow={copy.whatToKnow} title={copy.compareVehicle} />
              <div className="mt-6 grid gap-4">
                {vehicleTypes.map((vehicleType) => (
                  <div
                    key={vehicleType.id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{vehicleType.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {copy.comfortFit}: {vehicleType.description}
                        </p>
                      </div>
                      <ComfortLevel
                        score={getComfortScore(vehicleType.name, vehicleType.amenities)}
                        locale={locale}
                        compact
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="card-surface p-6 sm:p-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.durationQuestion}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">{copy.durationAnswer}</p>
              <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold text-ink">
                <MapPinned className="h-5 w-5 text-brand-600" />
                {copy.pickupQuestion}
              </h3>
              <p className="mt-3 text-base leading-8 text-muted">{copy.pickupAnswer}</p>
              <div className="mt-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {copy.pickupList}
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                  {pickupPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-surface p-6 sm:p-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.firstTimeQuestion}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">{copy.firstTimeAnswer}</p>
              <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold text-ink">
                <Luggage className="h-5 w-5 text-brand-600" />
                {copy.luggageQuestion}
              </h3>
              <p className="mt-3 text-base leading-8 text-muted">{copy.luggageAnswer}</p>
              <div className="mt-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {copy.dropoffList}
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                  {dropoffPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {route.isInternational ? <CrossBorderNotice locale={locale} /> : null}

          <section className="space-y-5">
            <SectionHeader
              eyebrow={copy.departures}
              title={copy.departuresTitle}
              description={copy.departuresBody}
            />
            {route.trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={{
                  ...trip,
                  route: {
                    id: route.id,
                    slug: route.slug,
                    isInternational: route.isInternational,
                    fromCity: route.fromCity,
                    toCity: route.toCity,
                  },
                }}
                locale={locale}
              />
            ))}
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow={copy.operators}
              title={copy.operatorsTitle}
              description={copy.operatorsBody}
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {operators.map((operator) => (
                <OperatorCard key={operator.id} operator={operator} locale={locale} />
              ))}
            </div>
          </section>

          <ReviewSection
            locale={locale}
            reviews={route.reviews}
            routeId={route.id}
            returnTo={withLang(`/routes/${route.slug}`, locale)}
            reviewStatus={search.review}
            emptyBody={
              locale === "vi"
                ? "Nếu bạn đã đi tuyến này, hãy chia sẻ cảm nhận thực tế về điểm đón, giờ giấc, độ thoải mái và hỗ trợ."
                : undefined
            }
          />

          {route.faqs.length ? (
            <section className="space-y-5">
              <SectionHeader eyebrow={copy.faq} title={copy.faqTitle} />
              <FAQAccordion items={route.faqs} />
            </section>
          ) : null}

          <section className="space-y-5">
            <SectionHeader
              eyebrow={copy.related}
              title={copy.relatedTitle}
              description={copy.relatedBody}
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedRoutes.map((relatedRoute) => (
                <RouteCard key={relatedRoute.id} route={relatedRoute} locale={locale} />
              ))}
            </div>
          </section>

          <section className="card-surface p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{copy.seoGuide}</span>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {routeName}
              </span>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5">
                <Clock3 className="h-5 w-5 text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-slate-800">{copy.durationQuestion}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{copy.durationAnswer}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5">
                <MapPinned className="h-5 w-5 text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-slate-800">{copy.pickupQuestion}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{copy.pickupAnswer}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm font-semibold text-slate-800">{copy.firstTimeQuestion}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{copy.firstTimeAnswer}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={withLang("/search", locale)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
              >
                {copy.exploreAll}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
