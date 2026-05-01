import type { Metadata } from "next";
import { FAQAccordion } from "@/components/FAQAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { getFaqPageData } from "@/lib/data";
import { resolveLocale } from "@/lib/i18n";
import { buildFaqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Frequently asked questions",
  description: "Route, destination, operator, and booking FAQs for VNBus.",
  path: "/faq",
});

export const dynamic = "force-dynamic";

export default async function FAQPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const faqs = await getFaqPageData();
  const copy = {
    en: {
      eyebrow: "FAQ",
      title: "Answers for booking, operators, destinations, and route planning",
      description:
        "This page aggregates FAQs from the database and keeps a semantic structure that can also be reused on route, destination, and operator pages.",
    },
    vi: {
      eyebrow: "Hỏi đáp",
      title: "Giải đáp về đặt chỗ, nhà xe, điểm đến và kế hoạch hành trình",
      description:
        "Trang này tổng hợp FAQ từ database và giữ cấu trúc ngữ nghĩa có thể tái sử dụng cho trang tuyến, điểm đến và nhà xe.",
    },
    ko: {
      eyebrow: "FAQ",
      title: "예약, 운영사, 목적지, 노선 계획에 대한 답변",
      description:
        "이 페이지는 데이터베이스의 FAQ를 집계하며 노선, 목적지, 운영사 페이지에서도 재사용 가능한 시맨틱 구조를 유지합니다.",
    },
    ja: {
      eyebrow: "FAQ",
      title: "予約、運行会社、目的地、路線計画に関する回答",
      description:
        "このページはデータベースのFAQを集約し、路線・目的地・運行会社ページでも再利用できるセマンティック構造を保ちます。",
    },
  }[locale];
  const faqSchema = buildFaqSchema(
    faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="section-space">
        <div className="container-shell space-y-10">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />

          <FAQAccordion
            items={faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
              category:
                faq.route
                  ? `${faq.category} • ${faq.route.fromCity.name} to ${faq.route.toCity.name}`
                  : faq.city
                    ? `${faq.category} • ${faq.city.name}`
                    : faq.operator
                      ? `${faq.category} • ${faq.operator.name}`
                      : faq.category,
            }))}
          />
        </div>
      </section>
    </>
  );
}
