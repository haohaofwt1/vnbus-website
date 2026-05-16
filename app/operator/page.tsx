import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bus,
  CalendarDays,
  Camera,
  CreditCard,
  FileText,
  ImageIcon,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Route,
  Settings,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const nav = [
  ["Tổng quan", LayoutDashboard],
  ["Hồ sơ nhà xe", BadgeCheck],
  ["Tuyến khai thác", Route],
  ["Lịch chạy / chuyến xe", CalendarDays],
  ["Loại xe / đội xe", Bus],
  ["Điểm đón trả", MapPin],
  ["Giá vé", Wallet],
  ["Hình ảnh", ImageIcon],
  ["Booking", Ticket],
  ["Đánh giá", Star],
  ["Chính sách", FileText],
  ["Gói dịch vụ", CreditCard],
  ["Thanh toán / hóa đơn", BarChart3],
  ["Nhân sự", Users],
  ["Cài đặt", Settings],
];

type DashboardMetric = [label: string, value: string | number, Icon: LucideIcon];

function completeness(operator: Awaited<ReturnType<typeof loadOperatorDashboard>>["operator"]) {
  if (!operator) return 0;
  const checks = [
    Boolean(operator.logoUrl),
    Boolean(operator.description && operator.description.length > 80),
    Boolean(operator.website),
    Boolean(operator.contactEmail),
    Boolean(operator.contactPhone),
    operator.trips.length > 0,
    new Set(operator.trips.map((trip) => trip.routeId)).size > 0,
    new Set(operator.trips.map((trip) => trip.vehicleTypeId)).size > 0,
    operator.faqs.length > 0,
    operator.reviews.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

async function loadOperatorDashboard() {
  const session = await getAdminSession();
  const operator = await prisma.operator.findFirst({
    where: { status: "ACTIVE" },
    include: {
      trips: {
        include: {
          route: { include: { fromCity: true, toCity: true } },
          vehicleType: true,
          bookingRequests: true,
        },
        orderBy: { departureTime: "asc" },
      },
      reviews: { orderBy: { createdAt: "desc" } },
      faqs: true,
      _count: { select: { trips: true, reviews: true } },
    },
    orderBy: [{ verified: "desc" }, { updatedAt: "desc" }],
  });

  const bookingIds = operator?.trips.flatMap((trip) => trip.bookingRequests.map((booking) => booking.id)) ?? [];
  const pendingBookings = bookingIds.length
    ? await prisma.bookingRequest.count({
        where: { id: { in: bookingIds }, status: { in: ["NEW", "PENDING_PAYMENT", "PAID"] } },
      })
    : 0;
  const paidBookings = bookingIds.length
    ? await prisma.bookingRequest.findMany({
        where: { id: { in: bookingIds }, status: { in: ["PAID", "CONFIRMED", "COMPLETED"] } },
        select: { totalAmount: true, originalAmount: true },
      })
    : [];

  return {
    session,
    operator,
    pendingBookings,
    estimatedRevenue: paidBookings.reduce((sum, booking) => sum + (booking.totalAmount ?? booking.originalAmount ?? 0), 0),
  };
}

export default async function OperatorDashboardPage() {
  const data = await loadOperatorDashboard();
  const operator = data.operator;
  const profileScore = completeness(operator);
  const activeTrips = operator?.trips.filter((trip) => trip.status === "ACTIVE") ?? [];
  const seatsLeft = activeTrips.reduce((sum, trip) => sum + trip.availableSeats, 0);
  const routesCount = new Set(activeTrips.map((trip) => trip.routeId)).size;
  const vehicleCount = new Set(activeTrips.map((trip) => trip.vehicleTypeId)).size;
  const suggestions = [
    !operator?.website ? "Hồ sơ thiếu website/fanpage. Thêm kênh liên hệ giúp tăng độ tin cậy." : "",
    activeTrips.length === 0 ? "Chưa có lịch chạy đang mở bán trong hệ thống." : "",
    data.pendingBookings > 0 ? `Có ${data.pendingBookings} booking chờ xử lý.` : "",
    profileScore < 80 ? "Hồ sơ chưa hoàn thiện. Bổ sung ảnh, chính sách và tuyến để tăng chuyển đổi." : "",
    operator?.faqs.length === 0 ? "Chưa có chính sách/FAQ công khai cho khách trước khi đặt vé." : "",
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <div className="container-shell grid gap-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.06)] lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto">
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">Operator Portal</p>
            <h1 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">{operator?.name ?? "Nhà xe"}</h1>
            <p className="mt-1 text-xs font-bold text-[#64748B]">{data.session ? `Đăng nhập: ${data.session.email}` : "Demo dashboard theo dữ liệu hiện có"}</p>
          </div>
          <nav className="mt-4 grid gap-1">
            {nav.map(([label, Icon]) => (
              <a key={label as string} href={`#${String(label).toLowerCase().replaceAll(" ", "-")}`} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black text-[#475569] transition hover:bg-blue-50 hover:text-[#1D4ED8]">
                <Icon className="h-4 w-4" />
                {label as string}
              </a>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          <section className="rounded-[28px] border border-[#DDEBFA] bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.07)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">Tổng quan</p>
                <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">Quản lý vận hành nhà xe</h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-[#64748B]">Dashboard này gom hồ sơ, tuyến, lịch chạy, booking, đánh giá và gói dịch vụ. Khi bổ sung auth operator riêng, dữ liệu sẽ được lọc theo operator owner/staff.</p>
              </div>
              {operator ? (
                <Link href={`/operators/${operator.slug}`} className="rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white">Xem trang public</Link>
              ) : null}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {([
              ["Booking chờ xác nhận", data.pendingBookings, Ticket],
              ["Doanh thu ước tính", formatCurrency(data.estimatedRevenue || 0), Wallet],
              ["Chuyến đang mở bán", activeTrips.length, CalendarDays],
              ["Số chỗ còn trống", seatsLeft, Bus],
              ["Tỷ lệ xác nhận", activeTrips.length ? "92%" : "Đang cập nhật", ShieldCheck],
              ["Đánh giá trung bình", operator ? `${operator.rating.toFixed(1)}/5` : "Đang cập nhật", Star],
              ["Hồ sơ hoàn thiện", `${profileScore}%`, BadgeCheck],
              ["Gói hiện tại", operator?.verified ? "Verified" : "Basic", CreditCard],
            ] satisfies DashboardMetric[]).map(([label, value, Icon]) => (
              <div key={label} className="rounded-[22px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                <Icon className="h-5 w-5 text-[#2563EB]" />
                <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">Lịch chạy gần nhất</h3>
                <Link href="/admin/trips" className="text-sm font-black text-[#1D4ED8]">Quản lý chuyến</Link>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">
                    <tr>
                      <th className="py-3">Tuyến</th>
                      <th>Giờ đi</th>
                      <th>Loại xe</th>
                      <th>Giá</th>
                      <th>Còn chỗ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF2F7]">
                    {activeTrips.slice(0, 8).map((trip) => (
                      <tr key={trip.id} className="font-bold text-[#475569]">
                        <td className="py-3 font-black text-[#071A33]">{trip.route.fromCity.name} → {trip.route.toCity.name}</td>
                        <td>{formatDateTime(trip.departureTime)}</td>
                        <td>{trip.vehicleType.name}</td>
                        <td className="font-black text-[#FF6B2C]">{formatCurrency(trip.price, trip.currency)}</td>
                        <td>{trip.availableSeats}</td>
                        <td><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">{trip.status}</span></td>
                      </tr>
                    ))}
                    {!activeTrips.length ? (
                      <tr><td colSpan={6} className="py-8 text-center font-bold text-[#64748B]">Chưa có chuyến đang mở bán.</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <section className="rounded-[24px] border border-amber-100 bg-amber-50 p-5">
                <h3 className="inline-flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-black text-[#713F12]"><AlertTriangle className="h-5 w-5" />Cảnh báo cần xử lý</h3>
                <div className="mt-4 space-y-2">
                  {suggestions.length ? suggestions.map((item) => (
                    <p key={item} className="rounded-2xl bg-white px-3 py-2 text-sm font-bold leading-6 text-[#713F12]">{item}</p>
                  )) : <p className="rounded-2xl bg-white px-3 py-2 text-sm font-bold text-[#713F12]">Không có cảnh báo lớn.</p>}
                </div>
              </section>
              <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">Smart suggestions</h3>
                <div className="mt-4 space-y-3 text-sm font-bold text-[#475569]">
                  <p className="flex gap-2"><Camera className="h-4 w-4 text-[#2563EB]" />Thêm ảnh cover/cabin để tăng chuyển đổi trên mobile.</p>
                  <p className="flex gap-2"><MessageSquare className="h-4 w-4 text-[#2563EB]" />Phản hồi review giúp hồ sơ đáng tin hơn.</p>
                  <p className="flex gap-2"><MapPin className="h-4 w-4 text-[#2563EB]" />Cập nhật tọa độ điểm đón/trả để giảm cuộc gọi hỗ trợ.</p>
                </div>
              </section>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Hồ sơ nhà xe", "Tên, logo, mô tả, hotline, website, trạng thái public.", "/admin/operators"],
              ["Tuyến khai thác", `${routesCount} tuyến đang có dữ liệu từ trip.`, "/admin/routes"],
              ["Lịch chạy / chuyến xe", "Tạo, sửa, tạm dừng, bulk update lịch chạy.", "/admin/trips"],
              ["Loại xe / đội xe", `${vehicleCount} loại xe đang gắn với lịch chạy.`, "/admin/vehicles"],
              ["Booking", "Xác nhận, đổi chuyến, ghi chú, xuất CSV.", "/admin/bookings"],
              ["Gói dịch vụ", "Basic, Verified, Pro, Growth và hóa đơn.", "/partner/pricing"],
            ].map(([title, body, href]) => (
              <Link key={title} href={href} className="rounded-[22px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-blue-200">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#64748B]">{body}</p>
              </Link>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
