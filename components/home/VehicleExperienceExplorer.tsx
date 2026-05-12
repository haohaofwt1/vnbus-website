"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { HomeVehicleExperience } from "@/lib/future-home-data";
import { formatCurrency } from "@/lib/utils";

export function VehicleExperienceExplorer({ vehicles }: { vehicles: HomeVehicleExperience[] }) {
  const [activeId, setActiveId] = useState(vehicles[0]?.id ?? "");
  const active = vehicles.find((vehicle) => vehicle.id === activeId) ?? vehicles[0];

  if (!active) return null;

  return (
    <section className="bg-[#F6F9FC] py-8 sm:py-12">
      <div className="container-shell">
        <div className="grid gap-5 rounded-[28px] border border-[#E5EAF2] bg-white p-4 shadow-[0_16px_48px_rgba(15,23,42,.06)] lg:grid-cols-[330px_minmax(0,1fr)] lg:p-6">
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33] sm:text-3xl">
                  Khám phá trải nghiệm xe
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">Chọn kiểu xe theo sự riêng tư, tiện nghi và ngân sách.</p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setActiveId(vehicle.id)}
                  className={`min-w-40 rounded-2xl border px-4 py-3 text-left transition lg:min-w-0 ${
                    active.id === vehicle.id
                      ? "border-blue-200 bg-blue-50 text-[#1D4ED8]"
                      : "border-[#E5EAF2] bg-white text-[#334155] hover:border-blue-100 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-sm font-black">{vehicle.name}</span>
                  <span className="mt-1 block text-xs font-semibold text-[#64748B]">
                    Từ {formatCurrency(vehicle.priceFrom, vehicle.currency)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-[#E5EAF2] bg-[#F8FAFC] lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-5 sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Vehicle intelligence</p>
              <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">
                {active.name}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#64748B]">{active.description}</p>
              <p className="mt-5 text-sm font-bold text-[#64748B]">
                Giá từ{" "}
                <span className="text-xl font-black text-[#F97316]">
                  {formatCurrency(active.priceFrom, active.currency)}
                </span>
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {active.features.map((feature) => (
                  <span key={feature} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#334155] shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {feature}
                  </span>
                ))}
              </div>
              <Link href={active.href} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#071A33] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0B2A52]">
                Xem tuyến có {active.name.toLowerCase()}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-64 lg:min-h-full">
              <Image src={active.image} alt={active.name} fill sizes="(min-width:1024px) 360px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/28 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
