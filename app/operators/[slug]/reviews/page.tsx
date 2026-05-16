import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingStatus, ReviewStatus } from "@prisma/client";
import { ChevronLeft, Star } from "lucide-react";
import { getRouteLabel, resolveLocale, withLang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const operator = await prisma.operator.findUnique({ where: { slug }, select: { name: true, slug: true } });
  if (!operator) {
    return buildMetadata({ title: "Reviews not found", description: "Operator reviews were not found.", path: "/operators" });
  }

  return buildMetadata({
    title: `${operator.name} reviews`,
    description: `Verified passenger reviews for ${operator.name} on VNBus.`,
    path: `/operators/${operator.slug}/reviews`,
  });
}

export default async function OperatorReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; rating?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const ratingFilter = Number(search.rating);
  const operator = await prisma.operator.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: {
          status: ReviewStatus.PUBLISHED,
          ...(ratingFilter >= 1 && ratingFilter <= 5 ? { rating: ratingFilter } : {}),
          bookingRequest: { is: { status: BookingStatus.COMPLETED } },
        },
        include: {
          bookingRequest: {
            include: {
              trip: {
                include: {
                  route: { include: { fromCity: true, toCity: true } },
                  vehicleType: true,
                },
              },
            },
          },
        },
        orderBy: [{ createdAt: "desc" }],
        take: 100,
      },
    },
  });

  if (!operator) notFound();

  const average = operator.reviews.length
    ? operator.reviews.reduce((sum, review) => sum + review.rating, 0) / operator.reviews.length
    : 0;
  const copy = locale === "vi"
    ? {
        back: "Quay lại hồ sơ nhà xe",
        title: `Đánh giá ${operator.name}`,
        body: "Chỉ hiển thị đánh giá từ khách đã đặt vé và hoàn tất chuyến qua VNBUS.",
        all: "Tất cả",
        empty: "Chưa có đánh giá đã xác minh phù hợp.",
        completed: "Booking đã hoàn tất",
        reply: "Phản hồi từ nhà xe",
      }
    : {
        back: "Back to operator profile",
        title: `${operator.name} reviews`,
        body: "Only reviews from completed VNBus bookings are shown.",
        all: "All",
        empty: "No matching verified reviews yet.",
        completed: "Completed booking",
        reply: "Operator reply",
      };

  return (
    <div className="bg-[#F5F8FF] py-8">
      <div className="container-shell space-y-6">
        <Link href={withLang(`/operators/${operator.slug}`, locale)} className="inline-flex items-center gap-2 text-sm font-black text-[#1D4ED8]">
          <ChevronLeft className="h-4 w-4" />
          {copy.back}
        </Link>

        <section className="rounded-[28px] border border-[#E5EAF2] bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.07)]">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">Verified reviews</p>
              <h1 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">{copy.title}</h1>
              <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">{copy.body}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 px-5 py-4">
              <p className="font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">{operator.reviews.length ? average.toFixed(1) : "0.0"}/5</p>
              <p className="text-sm font-bold text-[#64748B]">{operator.reviews.length} reviews</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={withLang(`/operators/${operator.slug}/reviews`, locale)} className={`rounded-full px-3 py-2 text-xs font-black ${!ratingFilter ? "bg-blue-50 text-[#1D4ED8] ring-1 ring-blue-100" : "bg-slate-50 text-[#64748B]"}`}>
              {copy.all}
            </Link>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Link key={rating} href={withLang(`/operators/${operator.slug}/reviews?rating=${rating}`, locale)} className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-black ${ratingFilter === rating ? "bg-blue-50 text-[#1D4ED8] ring-1 ring-blue-100" : "bg-slate-50 text-[#64748B]"}`}>
                {rating}
                <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {operator.reviews.map((review) => (
            <article key={review.id} className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-[#071A33]">{review.customerName}</p>
                  <p className="mt-1 text-xs font-bold text-[#64748B]">
                    {review.bookingRequest?.trip
                      ? `${getRouteLabel(review.bookingRequest.trip.route.fromCity.name, review.bookingRequest.trip.route.toCity.name, locale)} · ${review.bookingRequest.trip.vehicleType.name}`
                      : copy.completed}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#94A3B8]">{formatDate(review.createdAt)}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">{review.rating}/5</span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-7 text-[#475569]">{review.comment}</p>
              {review.operatorReply ? (
                <div className="mt-4 rounded-2xl bg-[#F8FBFF] p-4 text-sm font-semibold leading-6 text-[#475569]">
                  <p className="font-black text-[#071A33]">{copy.reply}</p>
                  <p className="mt-1">{review.operatorReply}</p>
                </div>
              ) : null}
            </article>
          ))}
          {!operator.reviews.length ? (
            <div className="rounded-[24px] border border-dashed border-[#CBD5E1] bg-white p-8 text-center md:col-span-2">
              <Star className="mx-auto h-8 w-8 text-[#2563EB]" />
              <p className="mt-3 font-black text-[#071A33]">{copy.empty}</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
