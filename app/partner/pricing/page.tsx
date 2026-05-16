import Link from "next/link";
import { CheckCircle2, Crown, Rocket, ShieldCheck, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "0đ",
    icon: ShieldCheck,
    features: ["Hồ sơ cơ bản", "Hiển thị trong danh sách nhà xe", "Cập nhật thông tin cơ bản"],
  },
  {
    name: "Verified",
    price: "Liên hệ",
    icon: CheckCircle2,
    features: ["Badge đã xác minh", "Tự quản lý hồ sơ", "Thêm ảnh xe/cabin", "Quản lý tuyến/lịch cơ bản"],
  },
  {
    name: "Pro",
    price: "Liên hệ",
    icon: Rocket,
    features: ["Ưu tiên hiển thị", "Quản lý booking nâng cao", "Báo cáo hiệu suất", "Tăng hiển thị trên tuyến"],
  },
  {
    name: "Growth",
    price: "Liên hệ",
    icon: Crown,
    features: ["Banner quảng bá", "Campaign tuyến", "Dashboard nâng cao", "Hỗ trợ ưu tiên"],
  },
];

export default function PartnerPricingPage() {
  return (
    <div className="bg-[#F5F8FF] py-10">
      <div className="container-shell space-y-8">
        <section className="rounded-[28px] bg-gradient-to-r from-[#1747D5] to-[#2563EB] p-8 text-white shadow-[0_18px_46px_rgba(37,99,235,0.24)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 text-xs font-black">
            <Sparkles className="h-4 w-4" />
            VNBUS Partner
          </span>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-black tracking-tight">
            Gói dịch vụ giúp nhà xe tăng hiển thị và nhận nhiều booking hơn
          </h1>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-blue-100">
            Bắt đầu với hồ sơ cơ bản, sau đó nâng cấp lên Verified, Pro hoặc Growth khi cần thêm công cụ quản lý, ưu tiên hiển thị và chiến dịch thương mại.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
              <plan.icon className="h-7 w-7 text-[#2563EB]" />
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{plan.name}</h2>
              <p className="mt-2 font-black text-[#FF6B2C]">{plan.price}</p>
              <ul className="mt-5 space-y-3 text-sm font-semibold text-[#475569]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact?type=operator" className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white">
                Tư vấn gói này
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
