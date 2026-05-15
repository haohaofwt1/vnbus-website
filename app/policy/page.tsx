import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getPolicyPageSettings } from "@/lib/site-settings";

export const metadata: Metadata = buildMetadata({
  title: "VNBus policy",
  description: "Booking, change, cancellation, payment, and support policies for VNBus travellers.",
  path: "/policy",
});

function paragraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function PolicyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const settings = await getPolicyPageSettings();

  return (
    <section className="bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_58%)] py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[#E5EAF2] bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.08)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">VNBus</p>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-black tracking-tight text-[#071A33] sm:text-5xl">
            {settings.title[locale]}
          </h1>
          <p className="mt-4 text-base font-semibold leading-8 text-[#64748B]">{settings.intro[locale]}</p>
          {settings.updatedAtText ? (
            <p className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-[#2563EB]">
              {settings.updatedLabel[locale]}: {settings.updatedAtText}
            </p>
          ) : null}

          <div className="mt-8 space-y-5 text-base font-semibold leading-8 text-[#334155]">
            {paragraphs(settings.body[locale]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
