import type { Metadata } from "next";
import { ReviewStatus } from "@prisma/client";
import { ReviewSection } from "@/components/ReviewSection";
import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Traveller reviews",
  description: "Read published VNBus traveller reviews and submit your own feedback.",
  path: "/reviews",
});

export const dynamic = "force-dynamic";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; review?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const reviews = await prisma.review.findMany({
    where: { status: ReviewStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <section className="section-space">
      <div className="container-shell">
        <ReviewSection
          locale={locale}
          reviews={reviews}
          returnTo="/reviews"
          reviewStatus={params.review}
          eyebrow="Reviews"
          title="Traveller reviews"
          description="Published reviews are managed in admin. New public submissions go into the review moderation queue."
        />
      </div>
    </section>
  );
}
