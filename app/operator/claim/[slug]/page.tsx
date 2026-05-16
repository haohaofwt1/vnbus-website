import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OperatorClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const operator = await prisma.operator.findUnique({ where: { slug } });

  if (!operator) notFound();

  return (
    <div className="bg-[#F5F8FF] py-10">
      <div className="container-shell">
        <section className="mx-auto max-w-4xl rounded-[28px] border border-[#DDEBFA] bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.07)] sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#1D4ED8]">
            <ShieldCheck className="h-4 w-4" />
            Xác minh hồ sơ nhà xe
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33] sm:text-4xl">
            Xác minh quyền quản lý {operator.name}
          </h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#64748B]">
            Gửi thông tin liên hệ để đội ngũ VNBUS đối chiếu giấy phép, xác nhận chủ sở hữu và mở quyền quản lý hồ sơ, lịch chạy, booking, hình ảnh và chính sách.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Kiểm tra thông tin pháp lý", ClipboardList],
              ["Gắn badge đã xác minh", BadgeCheck],
              ["Mở dashboard nhà xe", CheckCircle2],
            ].map(([label, Icon]) => (
              <div key={label as string} className="rounded-[20px] border border-[#E5EAF2] bg-[#F8FBFF] p-4">
                <Icon className="h-5 w-5 text-[#2563EB]" />
                <p className="mt-3 text-sm font-black text-[#071A33]">{label as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact?type=operator&operator=${operator.slug}`} className="rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white">
              Gửi yêu cầu xác minh
            </Link>
            <Link href="/partner/pricing" className="rounded-2xl border border-[#BFD4FF] bg-white px-5 py-3 text-sm font-black text-[#1D4ED8]">
              Xem gói đối tác
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
