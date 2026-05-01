import {
  BadgeCheck,
  BusFront,
  Headset,
  MapPinned,
} from "lucide-react";
import { type Locale } from "@/lib/i18n";

type TrustBadgesProps = {
  locale?: Locale;
};

export function TrustBadges({ locale = "en" }: TrustBadgesProps) {
  const copy = {
    en: [
      {
        label: "Pickup guide",
        title: "Clear pickup guidance",
        description:
          "See pickup notes, boarding instructions, and location details before you request a booking.",
        icon: MapPinned,
      },
      {
        label: "Verified",
        title: "Verified operators",
        description:
          "Operators are shown with route coverage, ratings, vehicle types, and contact-ready booking information.",
        icon: BadgeCheck,
      },
      {
        label: "Comfort first",
        title: "Comfort before price",
        description:
          "Compare sleeper buses, limousine vans, shuttles, express coaches, and private transfers by comfort level.",
        icon: BusFront,
      },
      {
        label: "Human support",
        title: "Support handoff",
        description:
          "Booking requests can be followed up by phone, email, or WhatsApp when human support is needed.",
        icon: Headset,
      },
    ],
    vi: [
      {
        label: "Điểm đón",
        title: "Hướng dẫn điểm đón rõ ràng",
        description:
          "Xem ghi chú đón khách, hướng dẫn lên xe và thông tin vị trí trước khi gửi yêu cầu đặt chỗ.",
        icon: MapPinned,
      },
      {
        label: "Đã xác minh",
        title: "Nhà xe đã xác minh",
        description:
          "Nhà xe được hiển thị cùng độ phủ tuyến, đánh giá, loại xe và thông tin sẵn sàng hỗ trợ đặt chỗ.",
        icon: BadgeCheck,
      },
      {
        label: "Thoải mái trước",
        title: "Ưu tiên độ thoải mái trước giá",
        description:
          "So sánh sleeper bus, limousine van, shuttle, express coach và private transfer theo mức thoải mái.",
        icon: BusFront,
      },
      {
        label: "Có hỗ trợ",
        title: "Bàn giao hỗ trợ",
        description:
          "Yêu cầu đặt chỗ có thể được theo dõi tiếp qua điện thoại, email hoặc WhatsApp khi cần hỗ trợ thủ công.",
        icon: Headset,
      },
    ],
    ko: [
      {
        label: "픽업 안내",
        title: "명확한 픽업 가이드",
        description:
          "예약 요청 전 탑승 메모, 안내, 위치 정보를 먼저 확인할 수 있습니다.",
        icon: MapPinned,
      },
      {
        label: "검증됨",
        title: "검증된 운영사",
        description:
          "운영사는 노선 범위, 평점, 차량 유형, 연락 가능한 예약 정보와 함께 표시됩니다.",
        icon: BadgeCheck,
      },
      {
        label: "편안함 우선",
        title: "가격보다 편안함",
        description:
          "슬리퍼 버스, 리무진 밴, 셔틀, 익스프레스 코치, 프라이빗 이동을 편안함 기준으로 비교합니다.",
        icon: BusFront,
      },
      {
        label: "사람 상담",
        title: "지원 인계",
        description:
          "사람 지원이 필요할 때 전화, 이메일, WhatsApp으로 이어서 도와줄 수 있습니다.",
        icon: Headset,
      },
    ],
    ja: [
      {
        label: "乗車案内",
        title: "わかりやすい乗車ガイド",
        description:
          "予約リクエスト前に乗車メモ、案内、場所の情報を確認できます。",
        icon: MapPinned,
      },
      {
        label: "認証済み",
        title: "認証済みの運行会社",
        description:
          "運行会社は路線カバー、評価、車両タイプ、連絡可能な予約情報とともに表示されます。",
        icon: BadgeCheck,
      },
      {
        label: "快適性重視",
        title: "価格より快適さ",
        description:
          "スリーパー、リムジンバン、シャトル、エクスプレスコーチ、専用送迎を快適性で比較します。",
        icon: BusFront,
      },
      {
        label: "有人対応",
        title: "サポート引き継ぎ",
        description:
          "必要に応じて電話、メール、WhatsApp による有人フォローにつなげられます。",
        icon: Headset,
      },
    ],
  }[locale];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {copy.map((badge) => {
        const Icon = badge.icon;

        return (
          <div
            key={badge.title}
            className="card-surface group relative overflow-hidden p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#2f67f6_0%,#ff8a2d_100%)]" />
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              {badge.label}
            </span>
            <div className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-brand-700">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-bold text-ink">
              {badge.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
