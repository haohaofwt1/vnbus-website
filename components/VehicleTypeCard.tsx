import { BusFront, Crown, Luggage, Route } from "lucide-react";
import { type Locale } from "@/lib/i18n";
import { getComfortScore, getVehicleUseCase } from "@/lib/travel-ui";
import { ComfortLevel } from "@/components/ComfortLevel";

type VehicleTypeCardProps = {
  vehicleType: {
    name: string;
    description: string;
    passengerCapacity: number;
    amenities: string[];
  };
  locale?: Locale;
};

export function VehicleTypeCard({
  vehicleType,
  locale = "en",
}: VehicleTypeCardProps) {
  const useCase = getVehicleUseCase(vehicleType.name);
  const comfortScore = getComfortScore(vehicleType.name, vehicleType.amenities);
  const copy = {
    en: {
      capacity: "Capacity",
      bestFor: {
        express: "Budget daytime routes",
        limousine: "Comfortable city-to-city travel",
        private: "Door-to-door flexible travel",
        shuttle: "Short airport and resort transfers",
        sleeper: "Overnight long-distance routes",
        cabin: "Premium overnight comfort",
      },
      choose: {
        express: "Choose this if you want a straightforward daytime ride at a sensible fare.",
        limousine: "Choose this if you want a quieter cabin and more legroom than a standard coach.",
        private: "Choose this if pickup flexibility matters more than seat-sharing value.",
        shuttle: "Choose this if you need a simple hotel, airport, or short-transfer option.",
        sleeper: "Choose this if you want to save daytime hours on long routes.",
        cabin: "Choose this if overnight privacy and comfort matter most.",
      },
      routes: {
        express: "Best on Hanoi, Ninh Binh, and coastal daytime corridors",
        limousine: "Typical on Ho Chi Minh City, Da Lat, and tourist city pairs",
        private: "Useful for airport arrivals, groups, and border pickups",
        shuttle: "Common on Da Nang, Hoi An, Hue, and resort transfers",
        sleeper: "Typical on Sapa, Ha Giang, Da Lat, and overnight coast routes",
        cabin: "Best on premium overnight corridors when available",
      },
      amenities: "Amenities",
    },
    vi: {
      capacity: "Sức chứa",
      bestFor: {
        express: "Tuyến ban ngày tiết kiệm",
        limousine: "Di chuyển city-to-city thoải mái",
        private: "Di chuyển linh hoạt tận nơi",
        shuttle: "Chặng ngắn sân bay và resort",
        sleeper: "Tuyến đêm đường dài",
        cabin: "Ngủ đêm cao cấp",
      },
      choose: {
        express: "Chọn loại này nếu bạn muốn một chuyến đi ban ngày gọn gàng với mức giá hợp lý.",
        limousine: "Chọn loại này nếu bạn muốn khoang xe yên hơn và nhiều khoảng để chân hơn xe ghế thường.",
        private: "Chọn loại này nếu sự linh hoạt điểm đón quan trọng hơn việc chia sẻ ghế.",
        shuttle: "Chọn loại này nếu bạn cần trung chuyển khách sạn, sân bay hoặc chặng ngắn đơn giản.",
        sleeper: "Chọn loại này nếu bạn muốn tiết kiệm thời gian ban ngày cho chặng dài.",
        cabin: "Chọn loại này nếu bạn ưu tiên riêng tư và thoải mái khi đi đêm.",
      },
      routes: {
        express: "Phù hợp các tuyến ban ngày như Hà Nội, Ninh Bình, ven biển",
        limousine: "Hay dùng cho TP.HCM, Đà Lạt và các cặp điểm du lịch",
        private: "Hợp cho đón sân bay, nhóm nhỏ và điểm đón linh hoạt",
        shuttle: "Thường gặp ở Đà Nẵng, Hội An, Huế và tuyến resort",
        sleeper: "Phổ biến cho Sapa, Hà Giang, Đà Lạt và các chặng đêm",
        cabin: "Tốt cho các hành lang ngủ đêm cao cấp khi có hỗ trợ",
      },
      amenities: "Tiện ích",
    },
    ko: {
      capacity: "정원",
      bestFor: {
        express: "가성비 주간 노선",
        limousine: "편안한 도시간 이동",
        private: "도어 투 도어 유연한 이동",
        shuttle: "짧은 공항·리조트 이동",
        sleeper: "야간 장거리 노선",
        cabin: "프리미엄 야간 이동",
      },
      choose: {
        express: "합리적인 요금의 단순한 주간 이동을 원한다면 좋습니다.",
        limousine: "일반 코치보다 조용한 객실과 넉넉한 공간이 필요하다면 적합합니다.",
        private: "좌석 공유보다 픽업 유연성이 더 중요하다면 선택하세요.",
        shuttle: "호텔, 공항, 짧은 이동에 간단한 옵션이 필요할 때 좋습니다.",
        sleeper: "장거리에서 낮 시간을 아끼고 싶다면 적합합니다.",
        cabin: "야간 프라이버시와 편안함이 가장 중요할 때 좋습니다.",
      },
      routes: {
        express: "하노이, 닌빈, 해안 주간 구간에 적합",
        limousine: "호치민, 달랏, 관광 도시 구간에 일반적",
        private: "공항 도착, 그룹 이동, 국경 픽업에 유용",
        shuttle: "다낭, 호이안, 후에, 리조트 이동에 흔함",
        sleeper: "사파, 하장, 달랏, 야간 해안 노선에 적합",
        cabin: "가능할 때 프리미엄 야간 구간에 적합",
      },
      amenities: "편의시설",
    },
    ja: {
      capacity: "定員",
      bestFor: {
        express: "日中の節約ルート",
        limousine: "快適な都市間移動",
        private: "柔軟なドアツードア移動",
        shuttle: "短い空港・リゾート送迎",
        sleeper: "夜行長距離ルート",
        cabin: "プレミアム夜行移動",
      },
      choose: {
        express: "手頃な料金でわかりやすい昼便を選びたいときに向いています。",
        limousine: "標準コーチより静かな車内と広めの座席が欲しいときに適しています。",
        private: "相乗りよりも乗車場所の柔軟さを重視するならおすすめです。",
        shuttle: "ホテル、空港、短距離送迎にシンプルな選択肢が必要なときに便利です。",
        sleeper: "長距離で昼の時間を節約したいときに向いています。",
        cabin: "夜行でのプライバシーと快適さを重視するなら最適です。",
      },
      routes: {
        express: "ハノイ、ニンビン、沿岸部の日中ルート向け",
        limousine: "ホーチミン、ダラット、観光都市間で一般的",
        private: "空港到着、グループ、国境ピックアップに便利",
        shuttle: "ダナン、ホイアン、フエ、リゾート送迎で一般的",
        sleeper: "サパ、ハザン、ダラット、夜行海岸ルート向け",
        cabin: "利用可能ならプレミアム夜行ルート向け",
      },
      amenities: "設備",
    },
  }[locale];

  return (
    <article className="card-surface h-full overflow-hidden p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
          <BusFront className="h-3.5 w-3.5" />
          {copy.bestFor[useCase]}
        </span>
        <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
          {copy.capacity}: {vehicleType.passengerCapacity}
        </span>
      </div>

      <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
        {vehicleType.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted">{vehicleType.description}</p>

      <div className="mt-5">
        <ComfortLevel score={comfortScore} locale={locale} />
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Route className="h-4 w-4 text-brand-600" />
            {copy.routes[useCase]}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Crown className="h-4 w-4 text-accent-600" />
            {copy.choose[useCase]}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {copy.amenities}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {vehicleType.amenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              <Luggage className="h-3.5 w-3.5 text-brand-500" />
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
