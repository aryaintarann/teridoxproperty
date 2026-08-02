"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { getUnits } from "@/lib/api";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Unit } from "@/types/unit";

export default function ListingPage() {
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [isGridLoading, setIsGridLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getUnits();
      setAvailableUnits(data);
      setIsGridLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-10">
      {/* Page Header */}
      <ScrollReveal direction="down">
      <div className="mb-10">
        <h1 className="font-heading text-[32px] md:text-[48px] leading-tight font-bold text-td-primary mb-2">Unit Tersedia</h1>
        <p className="text-td-on-surface-variant max-w-2xl text-lg">Temukan ruang tinggal sempurna Anda dari daftar properti yang dikurasi. Lokasi premium, listing terverifikasi, dan pemesanan mudah.</p>
      </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white p-4 rounded-xl border border-td-outline-variant shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold">Filter</h2>
              <button className="text-td-primary text-xs font-semibold tracking-wider hover:underline">Reset Semua</button>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-xs font-semibold tracking-wider text-td-on-surface-variant mb-2">LOKASI</label>
              <div className="relative">
                <MaterialIcon name="location_on" className="absolute left-2 top-1/2 -translate-y-1/2 text-td-on-surface-variant text-sm" />
                <select className="w-full pl-8 pr-4 py-2 border border-td-outline-variant rounded-lg bg-td-surface text-sm focus:ring-2 focus:ring-td-primary/10 focus:border-td-primary outline-none appearance-none">
                  <option>Jakarta Pusat</option>
                  <option>Jakarta Selatan</option>
                  <option>Jakarta Barat</option>
                  <option>Tangerang</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-xs font-semibold tracking-wider text-td-on-surface-variant mb-2">RENTANG HARGA (BULANAN)</label>
              <div className="space-y-2">
                <input className="w-full h-1 bg-td-secondary-container rounded-lg appearance-none cursor-pointer accent-td-primary" max={10000000} min={1000000} step={500000} type="range" />
                <div className="flex justify-between text-sm text-td-on-surface-variant">
                  <span>1 Jt</span>
                  <span>10 Jt</span>
                </div>
              </div>
            </div>

            {/* Room Type */}
            <div className="mb-6">
              <label className="block text-xs font-semibold tracking-wider text-td-on-surface-variant mb-2">TIPE KAMAR</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1 py-2 px-3 border border-td-primary bg-td-primary-fixed text-td-primary rounded-lg text-xs font-semibold">
                  <MaterialIcon name="ac_unit" className="text-sm" filled /> AC
                </button>
                <button className="flex items-center justify-center gap-1 py-2 px-3 border border-td-outline-variant text-td-on-surface-variant rounded-lg text-xs font-semibold hover:border-td-primary">
                  <MaterialIcon name="mode_fan" className="text-sm" /> Non-AC
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-xs font-semibold tracking-wider text-td-on-surface-variant mb-2">FASILITAS</label>
              <div className="space-y-2">
                {["WiFi Termasuk", "Kamar Mandi Dalam", "Layanan Kebersihan"].map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer group">
                    <input className="w-4 h-4 rounded border-td-outline-variant text-td-primary focus:ring-td-primary" type="checkbox" />
                    <span className="text-sm text-td-on-surface group-hover:text-td-primary transition-colors">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
                onClick={() => gooeyToast.success("Filter berhasil diterapkan!")}
                className="w-full bg-td-primary text-white py-3 rounded-lg text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              Terapkan Filter
            </button>
          </div>
        </aside>

        {/* Listing Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-td-on-surface-variant">
              <span className="font-bold text-td-on-surface">{availableUnits.length}</span> unit ditemukan
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-td-on-surface-variant">Urutkan:</span>
              <select className="bg-transparent border-none text-sm font-bold text-td-primary focus:ring-0 cursor-pointer">
                <option>Popularitas Tertinggi</option>
                <option>Harga Terendah</option>
                <option>Rating Tertinggi</option>
              </select>
            </div>
          </div>
          <phantom-ui loading={isGridLoading} animation="pulse" reveal={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableUnits.map((unit) => (
                <div key={unit.id} className="relative bg-white rounded-xl border border-td-outline-variant overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
                  <Link href={`/listing/${unit.id}`} className="absolute inset-0 z-0" aria-label={`Lihat detail ${unit.name}`} />
                  <div className="relative h-56 overflow-hidden pointer-events-none">
                    <Image src={(unit.images && unit.images[0]) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"} alt={unit.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                      unit.status === "Tersedia" ? "bg-td-tertiary text-td-on-tertiary" : "bg-td-secondary text-td-on-secondary"
                    }`}>
                      {unit.status}
                    </div>
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-td-primary hover:text-td-error transition-colors z-10 pointer-events-auto">
                    <MaterialIcon name="favorite" />
                  </button>
                  <div className="p-4 flex-1 flex flex-col pointer-events-none">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-heading text-xl font-semibold text-td-primary group-hover:text-td-primary-container transition-colors">{unit.name}</h3>
                      <div className="flex items-center gap-1 text-td-on-secondary-container">
                        <MaterialIcon name="star" className="text-sm" filled />
                        <span className="text-sm font-bold">{unit.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-td-on-surface-variant mb-4 flex items-center gap-1">
                      <MaterialIcon name="location_on" className="text-sm" /> {unit.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4 pointer-events-none">
                      {(unit.amenities || []).slice(0, 3).map((a) => (
                        <div key={a.icon} className="flex items-center text-xs text-td-on-surface-variant bg-td-surface-container px-2 py-1 rounded">
                          <MaterialIcon name={a.icon} className="text-[14px] mr-1" /> {a.label}
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-td-outline-variant flex items-center gap-3">
                      <div className="flex-1">
                        <span className="text-td-primary font-bold text-xl font-heading">{unit.price.replace("Rp ", "").replace(".000", "")}</span>
                        <span className="text-sm text-td-on-surface-variant">/bln</span>
                      </div>
                      <button 
                        onClick={(e) => gooeyToast.success(`Pemesanan ${unit.name} ditambahkan!`)}
                        className="relative z-10 pointer-events-auto bg-td-primary text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-all"
                      >
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </phantom-ui>

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-td-outline-variant text-td-on-surface-variant hover:border-td-primary hover:text-td-primary transition-colors">
              <MaterialIcon name="chevron_left" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-td-primary text-white text-xs font-semibold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-td-outline-variant text-td-on-surface hover:border-td-primary hover:text-td-primary transition-colors text-xs font-semibold">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-td-outline-variant text-td-on-surface hover:border-td-primary hover:text-td-primary transition-colors text-xs font-semibold">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-td-outline-variant text-td-on-surface-variant hover:border-td-primary hover:text-td-primary transition-colors">
              <MaterialIcon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
