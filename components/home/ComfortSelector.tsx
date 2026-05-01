"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const vehicles = [
  {
    name: "Cabin Double",
    image: "/images/hero/vnbus-premium-road-hero.png",
    bestFor: "Couples, families with kids, overnight comfort",
    capacity: "2 guests per cabin",
    comfort: "Private cabin comfort",
    amenities: ["Privacy curtain", "USB charging", "WiFi on select routes", "Water and blanket"],
    routes: "Hanoi to Sapa, HCMC to Da Lat, HCMC to Nha Trang",
    href: "/search?vehicleType=cabin-double&smart=comfortable",
  },
  {
    name: "Cabin Single",
    image: "/images/placeholders/1.webp",
    bestFor: "Solo travelers who want quiet overnight rest",
    capacity: "1 guest per cabin",
    comfort: "High personal space",
    amenities: ["Reclining cabin", "Reading light", "Charging", "Luggage help"],
    routes: "Hanoi to Sapa, HCMC to Da Lat",
    href: "/search?vehicleType=cabin-single&smart=comfortable",
  },
  {
    name: "VIP Sleeper 32/34",
    image: "/images/placeholders/2.webp",
    bestFor: "Long-distance value with better recline",
    capacity: "32 to 34 berths",
    comfort: "Balanced comfort and price",
    amenities: ["Sleeper berth", "Air conditioning", "Rest stops", "Blanket"],
    routes: "HCMC to Nha Trang, Hanoi to Sapa",
    href: "/search?vehicleType=vip-sleeper&smart=value",
  },
  {
    name: "Limousine Van",
    image: "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp",
    bestFor: "Short premium city transfers and airport arrivals",
    capacity: "9 to 11 seats",
    comfort: "Fast, compact and direct",
    amenities: ["Wide seats", "Pickup coordination", "Air conditioning", "Small group"],
    routes: "Da Nang to Hoi An, Hanoi to Ninh Binh",
    href: "/search?vehicleType=limousine-van&smart=pickup",
  },
  {
    name: "Shuttle Bus",
    image: "/images/hero/vnbus-premium-road-hero.png",
    bestFor: "Simple airport and hotel-area transfers",
    capacity: "12 to 24 seats",
    comfort: "Practical daily transfer",
    amenities: ["Scheduled pickup", "Shared transfer", "Easy boarding", "Luggage space"],
    routes: "Airport transfers, resort corridors",
    href: "/search?smart=pickup",
  },
  {
    name: "Private Transfer",
    image: "/images/placeholders/1.webp",
    bestFor: "Families, groups, late arrivals and custom pickup",
    capacity: "Private car or van",
    comfort: "Door-to-door flexibility",
    amenities: ["Private vehicle", "Custom timing", "Direct pickup", "Human support"],
    routes: "Custom Vietnam and cross-border routes",
    href: "/contact",
  },
];

export function ComfortSelector() {
  const [selected, setSelected] = useState(vehicles[0]);

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.name}
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
            <Image src={selected.image} alt={selected.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 620px" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,23,53,0)_30%,rgba(6,23,53,0.68)_100%)]" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">Comfort selector</p>
              <h3 className="mt-2 text-3xl font-black">{selected.name}</h3>
            </div>
          </div>
          <div className="p-6">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">Best for</span>
            <p className="mt-3 text-lg font-black text-ink">{selected.bestFor}</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600">
              <Info label="Capacity" value={selected.capacity} />
              <Info label="Comfort level" value={selected.comfort} />
              <Info label="Common routes" value={selected.routes} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.amenities.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{item}</span>
              ))}
            </div>
            <Link href={selected.href} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-3 text-sm font-black text-white transition hover:bg-accent-600">
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
