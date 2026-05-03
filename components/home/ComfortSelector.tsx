"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type ComfortVehicle = {
  id: string;
  name: string;
  slug: string;
  description: string;
  passengerCapacity: number;
  amenities: string[];
};

const images = [
  "/images/hero/vnbus-premium-road-hero.png",
  "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp",
  "/images/placeholders/1.webp",
  "/images/placeholders/2.webp",
];

function vehicleImage(slug: string, index: number) {
  if (slug.includes("limousine")) return images[1];
  if (slug.includes("private") || slug.includes("single")) return images[2];
  if (slug.includes("sleeper")) return images[3];
  return images[index % images.length];
}

function bestFor(vehicle: ComfortVehicle) {
  const name = `${vehicle.name} ${vehicle.slug}`.toLowerCase();
  if (name.includes("double")) return "Couples, families with kids, overnight comfort";
  if (name.includes("single")) return "Solo travelers who want quiet overnight rest";
  if (name.includes("private")) return "Families, groups, late arrivals and custom pickup";
  if (name.includes("limousine")) return "Short premium city transfers and airport arrivals";
  if (name.includes("shuttle")) return "Simple airport and hotel-area transfers";
  if (name.includes("sleeper")) return "Long-distance value with better recline";
  return "Travelers comparing comfort, capacity and amenities";
}

function comfortLabel(vehicle: ComfortVehicle) {
  const name = `${vehicle.name} ${vehicle.slug}`.toLowerCase();
  if (name.includes("cabin")) return "Private cabin comfort";
  if (name.includes("private")) return "Door-to-door flexibility";
  if (name.includes("limousine")) return "Fast, compact and direct";
  if (name.includes("shuttle")) return "Practical daily transfer";
  return "Balanced comfort and price";
}

export function ComfortSelector({ vehicles }: { vehicles: ComfortVehicle[] }) {
  const visibleVehicles = vehicles.length ? vehicles : [];
  const [selected, setSelected] = useState(visibleVehicles[0]);

  if (!selected) {
    return null;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        {visibleVehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => setSelected(vehicle)}
            className={`mb-2 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition last:mb-0 ${
              selected.name === vehicle.name ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {vehicle.name}
            {selected.name === vehicle.name ? <CheckCircle2 className="h-4 w-4" /> : null}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1fr_360px]">
          <div className="relative min-h-[320px]">
            <Image src={vehicleImage(selected.slug, visibleVehicles.findIndex((vehicle) => vehicle.id === selected.id))} alt={selected.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 620px" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,23,53,0)_30%,rgba(6,23,53,0.68)_100%)]" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Comfort selector</p>
              <h3 className="mt-2 text-3xl font-black">{selected.name}</h3>
            </div>
          </div>
          <div className="p-6">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">Best for</span>
            <p className="mt-3 text-lg font-black text-ink">{bestFor(selected)}</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600">
              <Info label="Capacity" value={`${selected.passengerCapacity} pax`} />
              <Info label="Comfort level" value={comfortLabel(selected)} />
              <Info label="Description" value={selected.description} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.amenities.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{item}</span>
              ))}
            </div>
            <Link href={`/search?vehicleType=${selected.slug}`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-3 text-sm font-black text-white transition hover:bg-accent-600">
              Find this vehicle <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}
