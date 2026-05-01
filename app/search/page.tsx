import type { Metadata } from "next";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchSummaryBar } from "@/components/SearchSummaryBar";
import { SmartRecommendationTabs } from "@/components/SmartRecommendationTabs";
import { TripCard } from "@/components/TripCard";
import { getSearchFormOptions, searchTrips, type SearchFilters } from "@/lib/data";
import { resolveLocale } from "@/lib/i18n";
import { buildItemListSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getSearchUiLabels } from "@/lib/site-settings";
import { getTripPriorityScore, type SmartSearchMode } from "@/lib/travel-ui";

export const metadata: Metadata = buildMetadata({
  title: "Choose the right trip with confidence",
  description:
    "Compare comfort, pickup clarity, confirmation notes, and operator trust before you request a booking.",
  path: "/search",
});

export const dynamic = "force-dynamic";

function resolveSmartMode(value?: string): SmartSearchMode {
  if (
    value === "recommended" ||
    value === "value" ||
    value === "comfortable" ||
    value === "pickup" ||
    value === "fastest" ||
    value === "border"
  ) {
    return value;
  }

  return "recommended";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchFilters>;
}) {
  const filters = await searchParams;
  const locale = resolveLocale(filters.lang);
  const [searchData, results, searchUiLabels] = await Promise.all([
    getSearchFormOptions(),
    searchTrips(filters),
    getSearchUiLabels(),
  ]);
  const smartMode = resolveSmartMode(filters.smart);
  const rankedTrips = [...results.trips].sort((left, right) => {
    const leftScore = getTripPriorityScore(
      {
        operatorRating: left.operator.rating,
        vehicleTypeName: left.vehicleType.name,
        amenities: left.amenities,
        pickupPoint: left.pickupPoint,
        duration: left.duration,
        price: left.price,
        currency: left.currency,
        availableSeats: left.availableSeats,
        isInternational: left.route.isInternational,
      },
      smartMode,
    );
    const rightScore = getTripPriorityScore(
      {
        operatorRating: right.operator.rating,
        vehicleTypeName: right.vehicleType.name,
        amenities: right.amenities,
        pickupPoint: right.pickupPoint,
        duration: right.duration,
        price: right.price,
        currency: right.currency,
        availableSeats: right.availableSeats,
        isInternational: right.route.isInternational,
      },
      smartMode,
    );

    return rightScore - leftScore;
  });

  const copy = {
    en: {
      title: "Choose the right trip, not just the cheapest one.",
      description:
        "Compare comfort, pickup clarity, confirmation notes, and operator trust before you request a booking.",
      anyOrigin: "Any origin",
      anyDestination: "Any destination",
      anyVehicle: "All vehicles",
      noTrips: "No matching trips found",
      noTripsBody:
        "Try removing one or two filters, switching vehicle type, or choosing a nearby departure or arrival city.",
      smartHelp: "Use quick ranking to reorder results by what matters most to you.",
    },
    vi: {
      title: "Chọn đúng chuyến phù hợp, không chỉ nhìn chuyến rẻ nhất.",
      description:
        "So sánh độ thoải mái, độ rõ điểm đón, ghi chú xác nhận và độ tin cậy nhà xe trước khi gửi yêu cầu đặt chỗ.",
      anyOrigin: "Mọi điểm đi",
      anyDestination: "Mọi điểm đến",
      anyVehicle: "Tất cả loại xe",
      noTrips: "Không tìm thấy chuyến phù hợp",
      noTripsBody:
        "Hãy thử bỏ bớt một vài bộ lọc, đổi loại xe hoặc chọn điểm đi và điểm đến lân cận.",
      smartHelp: "Dùng ưu tiên kết quả để sắp xếp nhanh theo điều bạn quan tâm nhất.",
    },
    ko: {
      title: "가장 싼 좌석보다, 내 여행에 맞는 이동을 고르세요.",
      description:
        "예약 요청 전에 편안함, 픽업 명확도, 확인 메모, 운영사 신뢰도를 함께 비교하세요.",
      anyOrigin: "전체 출발지",
      anyDestination: "전체 도착지",
      anyVehicle: "전체 차량",
      noTrips: "조건에 맞는 운행이 없습니다",
      noTripsBody:
        "필터를 일부 해제하거나 차량 유형을 바꾸고, 인근 출발지 또는 도착지를 선택해 보세요.",
      smartHelp: "빠른 우선순위로 내가 더 중요하게 보는 기준에 맞게 결과를 다시 정렬하세요.",
    },
    ja: {
      title: "最安値だけでなく、自分に合う便を選ぶ。",
      description:
        "予約リクエスト前に、快適さ、乗車案内、確認メモ、運行会社の信頼性を比較できます。",
      anyOrigin: "すべての出発地",
      anyDestination: "すべての到着地",
      anyVehicle: "すべての車両",
      noTrips: "一致する便が見つかりません",
      noTripsBody:
        "いくつかのフィルターを外すか、車両タイプを変更するか、近くの出発地・到着地を選んでください。",
      smartHelp: "クイック優先順位で、重視したい条件に合わせて結果を並べ替えられます。",
    },
  }[locale];

  const itemListSchema = buildItemListSchema(
    copy.title,
    results.trips.map((trip) => ({
      name: `${trip.route.fromCity.name} to ${trip.route.toCity.name} · ${trip.operator.name}`,
      path: `/routes/${trip.route.slug}`,
    })),
  );

  const fromLabel = filters.from
    ? searchData.cities.find((city) => city.slug === filters.from)?.name ?? copy.anyOrigin
    : copy.anyOrigin;
  const toLabel = filters.to
    ? searchData.cities.find((city) => city.slug === filters.to)?.name ?? copy.anyDestination
    : copy.anyDestination;
  const vehicleTypeLabel = filters.vehicleType
    ? searchData.vehicleTypes.find((item) => item.slug === filters.vehicleType)?.name ??
      copy.anyVehicle
    : copy.anyVehicle;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="section-space">
        <div className="container-shell space-y-8">
          <SearchSummaryBar
            locale={locale}
            summary={{
              fromLabel,
              toLabel,
              departureDate: filters.departureDate,
              passengers: filters.passengers ?? "1",
              vehicleTypeLabel,
            }}
            cities={searchData.cities}
            vehicleTypes={searchData.vehicleTypes}
            defaults={{
              from: filters.from,
              to: filters.to,
              departureDate: filters.departureDate,
              returnDate: filters.returnDate,
              passengers: filters.passengers,
              vehicleType: filters.vehicleType,
            }}
          />

          <div className="space-y-4">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
              {copy.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted">{copy.description}</p>
            <SmartRecommendationTabs locale={locale} filters={filters} labels={searchUiLabels} />
            <p className="text-sm text-slate-500">{copy.smartHelp}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
            <FilterSidebar
              filters={filters}
              operators={results.operators}
              pickupOptions={results.pickupOptions}
              dropoffOptions={results.dropoffOptions}
              amenityOptions={results.amenityOptions}
              vehicleTypes={searchData.vehicleTypes}
              locale={locale}
              uiLabels={searchUiLabels}
            />

            <div className="space-y-5">
              {rankedTrips.length ? (
                rankedTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    showRoute
                    departureDate={filters.departureDate}
                    returnDate={filters.returnDate}
                    passengers={Number(filters.passengers ?? 1)}
                    locale={locale}
                    uiLabels={searchUiLabels}
                  />
                ))
              ) : (
                <div className="card-surface p-10 text-center">
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                    {copy.noTrips}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted">{copy.noTripsBody}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
