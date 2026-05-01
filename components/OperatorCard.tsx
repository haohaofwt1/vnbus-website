import Image from "next/image";
import Link from "next/link";
import { BusFront, Languages, ShieldCheck, Star } from "lucide-react";
import { type Locale, withLang } from "@/lib/i18n";
import { getKnownFor, getSupportLanguages } from "@/lib/travel-ui";

type OperatorCardProps = {
  operator: {
    slug: string;
    name: string;
    description: string;
    rating: number;
    verified: boolean;
    logoUrl: string;
    trips?: Array<{
      routeId: string;
      route?: {
        isInternational?: boolean;
      };
      vehicleType: {
        name: string;
      };
    }>;
  };
  locale?: Locale;
};

export function OperatorCard({ operator, locale = "en" }: OperatorCardProps) {
  const routeCount = new Set(operator.trips?.map((trip) => trip.routeId) ?? []).size || 4;
  const vehicleTypes = Array.from(
    new Set(operator.trips?.map((trip) => trip.vehicleType.name) ?? []),
  ).slice(0, 3);
  const isInternational =
    operator.trips?.some((trip) => trip.route?.isInternational) ?? false;
  const supportLanguages = getSupportLanguages(isInternational, operator.verified);
  const knownFor = getKnownFor(operator.name, operator.description, vehicleTypes);
  const copy = {
    en: {
      verified: "Verified",
      routes: "Active routes",
      support: "Support language",
      knownForLabel: "Known for",
      knownFor: {
        "premium-city": "premium limousine routes with city-center pickup",
        border: "cross-border planning with operator-ready support",
        shuttle: "simple airport and city shuttle coordination",
        reliable: "clear route coverage and reliable traveller handoff",
      },
      viewOperator: "View operator",
    },
    vi: {
      verified: "Đã xác minh",
      routes: "Tuyến đang khai thác",
      support: "Ngôn ngữ hỗ trợ",
      knownForLabel: "Nổi bật ở",
      knownFor: {
        "premium-city": "tuyến limousine cao cấp với điểm đón trung tâm",
        border: "tuyến quốc tế có hỗ trợ nhà xe rõ ràng",
        shuttle: "điều phối shuttle sân bay và nội đô gọn gàng",
        reliable: "độ phủ tuyến rõ và hỗ trợ hành khách đáng tin cậy",
      },
      viewOperator: "Xem nhà xe",
    },
    ko: {
      verified: "인증됨",
      routes: "활성 노선",
      support: "지원 언어",
      knownForLabel: "특징",
      knownFor: {
        "premium-city": "도심 픽업이 포함된 프리미엄 리무진 노선",
        border: "운영사 지원이 명확한 국경 간 이동",
        shuttle: "공항과 도시 셔틀 연결이 간단함",
        reliable: "명확한 노선 커버리지와 안정적인 지원",
      },
      viewOperator: "운영사 보기",
    },
    ja: {
      verified: "認証済み",
      routes: "公開中の路線",
      support: "対応言語",
      knownForLabel: "特徴",
      knownFor: {
        "premium-city": "市内中心部ピックアップ付きの上質なリムジン路線",
        border: "運行会社サポートがわかりやすい越境移動",
        shuttle: "空港と市内シャトルの手配がシンプル",
        reliable: "わかりやすい路線カバーと安心のサポート",
      },
      viewOperator: "運行会社を見る",
    },
  }[locale];

  return (
    <article className="card-surface flex h-full flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image
            src={operator.logoUrl}
            alt={`${operator.name} logo`}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-ink">
              {operator.name}
            </h3>
            {operator.verified ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {copy.verified}
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-current text-amber-400" />
              {operator.rating.toFixed(1)} / 5
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BusFront className="h-4 w-4 text-brand-600" />
              {routeCount} {copy.routes}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-muted">{operator.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {vehicleTypes.map((vehicleType) => (
          <span
            key={vehicleType}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
          >
            {vehicleType}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {copy.support}
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Languages className="h-4 w-4 text-brand-600" />
            {supportLanguages.join(" / ")}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {copy.knownForLabel}
          </p>
          <p className="mt-2 inline-flex items-start gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {copy.knownFor[knownFor]}
          </p>
        </div>
      </div>

      <Link
        href={withLang(`/operators/${operator.slug}`, locale)}
        className="mt-6 inline-flex items-center justify-center rounded-2xl border border-brand-200 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
      >
        {copy.viewOperator}
      </Link>
    </article>
  );
}
