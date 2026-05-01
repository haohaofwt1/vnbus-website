"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resolveLocale, type Locale, withLang } from "@/lib/i18n";

function NotFoundView({ locale }: { locale: Locale }) {
  const copy = {
    en: {
      title: "Page not found",
      description: "The page you requested is missing or no longer available.",
      home: "Go home",
      search: "Search routes",
    },
    vi: {
      title: "Không tìm thấy trang",
      description: "Trang bạn yêu cầu không tồn tại hoặc không còn khả dụng.",
      home: "Về trang chủ",
      search: "Tìm tuyến",
    },
    ko: {
      title: "페이지를 찾을 수 없습니다",
      description: "요청한 페이지가 없거나 더 이상 사용할 수 없습니다.",
      home: "홈으로",
      search: "노선 검색",
    },
    ja: {
      title: "ページが見つかりません",
      description: "指定したページは存在しないか、現在利用できません。",
      home: "ホームへ戻る",
      search: "路線を検索",
    },
  }[locale];

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
            {copy.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-muted">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={withLang("/", locale)}
              className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {copy.home}
            </Link>
            <Link
              href={withLang("/search", locale)}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {copy.search}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotFoundContent() {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  return <NotFoundView locale={locale} />;
}

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundView locale="en" />}>
      <NotFoundContent />
    </Suspense>
  );
}
