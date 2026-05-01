import Link from "next/link";
import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Luggage,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { type Locale, getRouteLabel, withLang } from "@/lib/i18n";
import {
  type PickupClarityKey,
  type RecommendationKey,
} from "@/lib/travel-ui";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
} from "@/lib/utils";
import { ComfortLevel } from "@/components/ComfortLevel";
import { PickupClarityBadge } from "@/components/PickupClarityBadge";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";

type TripConfidenceCardProps = {
  trip: {
    departureTime: Date;
    arrivalTime: Date;
    duration: number;
    price: number;
    currency: string;
    pickupPoint: string;
    dropoffPoint: string;
    availableSeats: number;
    amenities: string[];
    operator: {
      name: string;
      slug: string;
      rating: number;
    };
    vehicleType: {
      name: string;
    };
    route: {
      slug: string;
      fromCity: { name: string };
      toCity: { name: string };
      isInternational?: boolean;
    };
  };
  trustScore: number;
  comfortScore: number;
  pickupClarity: PickupClarityKey;
  recommendations: RecommendationKey[];
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  showRoute?: boolean;
  locale?: Locale;
};

function InfoBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
          {icon}
        </span>
        <h5 className="text-sm font-semibold text-slate-800">{title}</h5>
      </div>
      <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">{children}</div>
    </div>
  );
}

export function TripConfidenceCard({
  trip,
  trustScore,
  comfortScore,
  pickupClarity,
  recommendations,
  departureDate,
  returnDate,
  passengers = 1,
  showRoute = false,
  locale = "en",
}: TripConfidenceCardProps) {
  const copy = {
    en: {
      title: "Before you request this booking",
      body:
        "Review the schedule, pickup guidance, comfort details, and confirmation notes before we hand your request to the operator.",
      operatorProfile: "Operator profile",
      routePage: "Route page",
      schedule: "Schedule",
      pickupDropoff: "Pickup and drop-off",
      comfort: "Comfort and luggage",
      fare: "Fare and confirmation",
      traveller: "Traveller notes",
      departure: "Departure",
      arrival: "Arrival",
      duration: "Duration",
      operatingDate: "Operating date",
      selectedDate: "Selected travel date",
      returnDate: "Return date",
      pickupPoint: "Pickup point",
      dropoffPoint: "Drop-off point",
      pickupStatus: "Pickup clarity",
      arriveEarly: "Suggested arrival",
      vehicleType: "Vehicle type",
      luggage: "Luggage note",
      price: "Price",
      paymentFlow: "Payment flow",
      confirmation: "Confirmation note",
      tourist: "Good for tourists",
      support: "Human support",
      amenities: "Amenities",
      passengers: "Passengers",
      checklistTitle: "Checklist",
      borderTitle: "Border-ready notes",
      checklist: [
        "Clear pickup point",
        "Manual confirmation before payment",
        "Operator details available",
        "Human support available",
      ],
      travellerNotes: [
        "Tourist-friendly departure window",
        "Bring a charged phone and arrive a little early",
        "Support is available by phone, email, or WhatsApp",
      ],
      borderNotes: [
        "Border-ready planning",
        "Passport required",
        "Visa rules may apply",
        "Allow extra time at border",
        "Requirements can change",
      ],
      luggageStandard: "Standard luggage space is usually included. Oversize items should be confirmed with support.",
      luggagePremium: "Comfort-oriented vehicles usually fit cabin bags and medium luggage. Confirm large baggage in advance.",
      hostedCheckout: "Payment link is sent after manual confirmation.",
      confirmNote: "Availability is checked before any payment request is sent.",
      touristFriendly: "Clear for travellers who want pickup and operator details before booking.",
      supportReady: "Traveller-friendly handoff available if you need help with the route or pickup.",
    },
    vi: {
      title: "Trước khi bạn gửi yêu cầu đặt chỗ",
      body:
        "Xem trước lịch trình, độ rõ điểm đón, mức thoải mái và ghi chú xác nhận trước khi VNBus chuyển yêu cầu cho nhà xe.",
      operatorProfile: "Trang nhà xe",
      routePage: "Trang tuyến",
      schedule: "Lịch trình",
      pickupDropoff: "Điểm đón và trả",
      comfort: "Độ thoải mái và hành lý",
      fare: "Giá và xác nhận",
      traveller: "Lưu ý cho hành khách",
      departure: "Khởi hành",
      arrival: "Đến nơi",
      duration: "Thời lượng",
      operatingDate: "Ngày chạy",
      selectedDate: "Ngày đi đã chọn",
      returnDate: "Ngày về",
      pickupPoint: "Điểm đón",
      dropoffPoint: "Điểm trả",
      pickupStatus: "Độ rõ điểm đón",
      arriveEarly: "Nên có mặt trước",
      vehicleType: "Loại xe",
      luggage: "Ghi chú hành lý",
      price: "Giá",
      paymentFlow: "Cách thanh toán",
      confirmation: "Ghi chú xác nhận",
      tourist: "Phù hợp cho khách du lịch",
      support: "Hỗ trợ con người",
      amenities: "Tiện ích",
      passengers: "Số khách",
      checklistTitle: "Checklist",
      borderTitle: "Ghi chú qua biên giới",
      checklist: [
        "Điểm đón rõ ràng",
        "Xác nhận thủ công trước khi thanh toán",
        "Có thông tin nhà xe",
        "Có hỗ trợ con người khi cần",
      ],
      travellerNotes: [
        "Khung giờ đi thân thiện với khách du lịch",
        "Nên sạc điện thoại và đến sớm hơn một chút",
        "Có hỗ trợ qua điện thoại, email hoặc WhatsApp",
      ],
      borderNotes: [
        "Có ghi chú chuẩn bị qua biên giới",
        "Cần hộ chiếu",
        "Có thể áp dụng quy định visa",
        "Nên chừa thêm thời gian ở cửa khẩu",
        "Quy định có thể thay đổi",
      ],
      luggageStandard: "Thường đã có chỗ để hành lý tiêu chuẩn. Hành lý cồng kềnh nên xác nhận trước với hỗ trợ.",
      luggagePremium: "Xe ưu tiên thoải mái thường phù hợp vali cabin và hành lý cỡ vừa. Hành lý lớn nên báo trước.",
      hostedCheckout: "Link thanh toán chỉ được gửi sau khi xác nhận thủ công.",
      confirmNote: "VNBus kiểm tra tình trạng chỗ trước khi gửi yêu cầu thanh toán.",
      touristFriendly: "Phù hợp cho khách muốn xem rõ điểm đón và thông tin nhà xe trước khi đặt.",
      supportReady: "Có thể chuyển sang hỗ trợ thủ công nếu bạn cần trợ giúp về tuyến hoặc điểm đón.",
    },
    ko: {
      title: "예약 요청 전에 확인하세요",
      body:
        "요청이 운영사에 전달되기 전에 시간표, 픽업 안내, 편안함, 확인 메모를 먼저 확인하세요.",
      operatorProfile: "운영사 프로필",
      routePage: "노선 페이지",
      schedule: "시간표",
      pickupDropoff: "탑승 및 하차",
      comfort: "편안함 및 수하물",
      fare: "요금 및 확인",
      traveller: "여행자 메모",
      departure: "출발",
      arrival: "도착",
      duration: "소요 시간",
      operatingDate: "운행일",
      selectedDate: "선택한 날짜",
      returnDate: "복귀일",
      pickupPoint: "탑승 위치",
      dropoffPoint: "하차 위치",
      pickupStatus: "픽업 명확도",
      arriveEarly: "권장 도착 시간",
      vehicleType: "차량 유형",
      luggage: "수하물 메모",
      price: "요금",
      paymentFlow: "결제 방식",
      confirmation: "확인 메모",
      tourist: "여행자 친화도",
      support: "사람 상담 지원",
      amenities: "편의시설",
      passengers: "탑승객",
      checklistTitle: "체크리스트",
      borderTitle: "국경 간 메모",
      checklist: [
        "명확한 탑승 위치",
        "결제 전 수동 확인",
        "운영사 정보 확인 가능",
        "사람 지원 가능",
      ],
      travellerNotes: [
        "여행자 친화적인 출발 시간대",
        "휴대폰을 충전하고 조금 일찍 도착하세요",
        "전화, 이메일, WhatsApp 지원 가능",
      ],
      borderNotes: [
        "국경 통과 준비 메모",
        "여권 필요",
        "비자 규정이 적용될 수 있음",
        "국경에서 여유 시간 확보",
        "규정은 변경될 수 있음",
      ],
      luggageStandard: "기본 수하물 공간이 보통 포함됩니다. 대형 짐은 지원팀에 미리 확인하세요.",
      luggagePremium: "편안한 차량은 기내용 가방과 중형 수하물에 적합합니다. 큰 짐은 사전 확인이 좋습니다.",
      hostedCheckout: "수동 확인 후 결제 링크가 전송됩니다.",
      confirmNote: "결제 요청 전에 가용 여부를 먼저 확인합니다.",
      touristFriendly: "예약 전 픽업 위치와 운영사 정보를 확인하려는 여행자에게 적합합니다.",
      supportReady: "노선이나 픽업 관련 도움이 필요하면 사람 상담으로 연결할 수 있습니다.",
    },
    ja: {
      title: "予約リクエスト前に確認したいこと",
      body:
        "リクエストを運行会社へ送る前に、時刻表、乗車案内、快適性、確認メモを確認できます。",
      operatorProfile: "運行会社ページ",
      routePage: "路線ページ",
      schedule: "スケジュール",
      pickupDropoff: "乗車・降車",
      comfort: "快適さと荷物",
      fare: "料金と確認",
      traveller: "旅行者メモ",
      departure: "出発",
      arrival: "到着",
      duration: "所要時間",
      operatingDate: "運行日",
      selectedDate: "選択した日付",
      returnDate: "復路日",
      pickupPoint: "乗車場所",
      dropoffPoint: "降車場所",
      pickupStatus: "乗車案内の明確さ",
      arriveEarly: "推奨到着時間",
      vehicleType: "車両タイプ",
      luggage: "荷物メモ",
      price: "料金",
      paymentFlow: "支払いフロー",
      confirmation: "確認メモ",
      tourist: "旅行者向け",
      support: "有人サポート",
      amenities: "設備",
      passengers: "人数",
      checklistTitle: "チェックリスト",
      borderTitle: "越境メモ",
      checklist: [
        "明確な乗車場所",
        "支払い前の手動確認",
        "運行会社情報あり",
        "有人サポートあり",
      ],
      travellerNotes: [
        "旅行者にやさしい出発時間",
        "スマートフォンを充電して少し早めに到着しましょう",
        "電話、メール、WhatsApp でのサポートあり",
      ],
      borderNotes: [
        "パスポート必須",
        "ビザ条件が必要な場合あり",
        "国境で余裕を持つ",
        "条件は変更される場合があります",
      ],
      luggageStandard: "標準的な荷物スペースが含まれることが多いです。大型荷物は事前確認をおすすめします。",
      luggagePremium: "快適性重視の車両は機内持込サイズや中型荷物に向いています。大型荷物は事前確認が安心です。",
      hostedCheckout: "手動確認後に支払いリンクをお送りします。",
      confirmNote: "支払い案内の前に空き状況を確認します。",
      touristFriendly: "予約前に乗車場所や運行会社情報を把握したい旅行者向けです。",
      supportReady: "ルートや乗車場所で不安があれば有人サポートへ引き継げます。",
    },
  }[locale];

  const checklist = trip.route.isInternational ? copy.borderNotes : copy.checklist;
  const luggageNote = comfortScore >= 4 ? copy.luggagePremium : copy.luggageStandard;

  return (
    <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TrustScoreBadge score={trustScore} locale={locale} />
            <PickupClarityBadge clarity={pickupClarity} locale={locale} />
            {recommendations.map((recommendation) => (
              <RecommendationBadge
                key={recommendation}
                kind={recommendation}
                locale={locale}
              />
            ))}
          </div>
          <h4 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
            {copy.title}
          </h4>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{copy.body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {copy.checklist.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={withLang(`/operators/${trip.operator.slug}`, locale)}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copy.operatorProfile}
          </Link>
          {showRoute ? (
            <Link
              href={withLang(`/routes/${trip.route.slug}`, locale)}
              className="inline-flex items-center justify-center rounded-2xl border border-brand-200 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              {copy.routePage}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <InfoBlock icon={<Clock3 className="h-4 w-4" />} title={copy.schedule}>
          <p>
            {copy.departure}: <strong>{formatDateTime(trip.departureTime)}</strong>
          </p>
          <p>
            {copy.arrival}: <strong>{formatDateTime(trip.arrivalTime)}</strong>
          </p>
          <p>
            {copy.duration}: <strong>{formatDuration(trip.duration)}</strong>
          </p>
          <p>
            {copy.operatingDate}: <strong>{formatDate(trip.departureTime)}</strong>
          </p>
          {departureDate ? (
            <p>
              {copy.selectedDate}: <strong>{departureDate}</strong>
            </p>
          ) : null}
          {returnDate ? (
            <p>
              {copy.returnDate}: <strong>{returnDate}</strong>
            </p>
          ) : null}
        </InfoBlock>

        <InfoBlock icon={<MapPinned className="h-4 w-4" />} title={copy.pickupDropoff}>
          <p>
            {copy.pickupPoint}: <strong>{trip.pickupPoint}</strong>
          </p>
          <p>
            {copy.dropoffPoint}: <strong>{trip.dropoffPoint}</strong>
          </p>
          <p>
            {copy.pickupStatus}:{" "}
            <PickupClarityBadge clarity={pickupClarity} locale={locale} />
          </p>
          <p>
            {copy.arriveEarly}: <strong>20-30 min</strong>
          </p>
        </InfoBlock>

        <InfoBlock icon={<Luggage className="h-4 w-4" />} title={copy.comfort}>
          <p>
            {copy.vehicleType}: <strong>{trip.vehicleType.name}</strong>
          </p>
          <ComfortLevel score={comfortScore} locale={locale} />
          <p>
            {copy.luggage}: <strong>{luggageNote}</strong>
          </p>
          <p>
            {copy.amenities}: <strong>{trip.amenities.join(", ")}</strong>
          </p>
        </InfoBlock>

        <InfoBlock icon={<CreditCard className="h-4 w-4" />} title={copy.fare}>
          <p>
            {copy.price}: <strong>{formatCurrency(trip.price, trip.currency)}</strong>
          </p>
          <p>
            {copy.paymentFlow}: <strong>{copy.hostedCheckout}</strong>
          </p>
          <p>
            {copy.confirmation}: <strong>{copy.confirmNote}</strong>
          </p>
          <p>
            {copy.passengers}: <strong>{passengers}</strong>
          </p>
        </InfoBlock>

        <InfoBlock icon={<Sparkles className="h-4 w-4" />} title={copy.traveller}>
          <p>
            {copy.tourist}: <strong>{copy.touristFriendly}</strong>
          </p>
          <p>
            {copy.support}: <strong>{copy.supportReady}</strong>
          </p>
          {copy.travellerNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </InfoBlock>

        <InfoBlock
          icon={<BadgeCheck className="h-4 w-4" />}
          title={trip.route.isInternational ? copy.borderTitle : copy.checklistTitle}
        >
          {checklist.map((item) => (
            <p key={item} className="flex items-start gap-2">
              <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{item}</span>
            </p>
          ))}
          <p className="pt-2 text-xs text-slate-500">
            {getRouteLabel(trip.route.fromCity.name, trip.route.toCity.name, locale)}
          </p>
        </InfoBlock>
      </div>
    </div>
  );
}
