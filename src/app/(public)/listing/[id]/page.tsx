"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { getUnitById } from "@/lib/api";
import { notFound } from "next/navigation";
import { SplitText } from "@/components/ui/SplitText";
import { BlurText } from "@/components/ui/BlurText";
import { gooeyToast } from "goey-toast";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Unit } from "@/types/unit";

export default function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [relatedUnits, setRelatedUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      const data = await getUnitById(id);
      setUnit(data);
      
      const { getUnits } = await import('@/lib/api');
      const allUnits = await getUnits();
      setRelatedUnits(allUnits.filter(u => u.id.toString() !== id).slice(0, 3));
      
      setIsLoading(false);
      setTimeout(() => setIsGalleryLoading(false), 600);
    }
    loadData();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!unit) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-6 lg:py-10 overflow-hidden">
      {/* Image Gallery (Bento) */}
      <ScrollReveal direction="down">
      <div className={isGalleryLoading ? "animate-pulse" : ""}>
        <section className="relative w-full h-[40vh] md:h-[60vh] md:grid md:grid-cols-4 md:grid-rows-2 gap-2 overflow-hidden rounded-3xl">
          <div className="relative col-span-2 row-span-2 w-full h-full group overflow-hidden">
            <Image src={(unit.images && unit.images[0]) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"} alt={unit.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
            <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase shadow-md backdrop-blur-md border ${
              unit.status === "Tersedia" ? "bg-td-tertiary/90 text-td-on-tertiary border-td-tertiary/20" : "bg-td-secondary/90 text-td-on-secondary border-td-secondary/20"
            }`}>
              {unit.status}
            </div>
          </div>
          {(unit.images || []).slice(1, 5).map((img, i) => (
            <div key={i} className="hidden md:block relative group overflow-hidden">
              <Image src={img} alt={`${unit.name} foto ${i + 2}`} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          ))}
          {(unit.images || []).length <= 4 && (
            <div className="hidden md:flex relative bg-td-surface-container flex-col items-center justify-center text-td-on-surface-variant group hover:bg-td-surface-container-high transition-colors cursor-pointer">
              <MaterialIcon name="collections" className="text-3xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs font-semibold tracking-wider">LIHAT SEMUA</span>
            </div>
          )}
        </section>
      </div>
      </ScrollReveal>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Details */}
        <div className="flex-1 space-y-10">
          <ScrollReveal direction="up" delay={0.1}>
          {/* Title */}
          <div className="mb-8 border-b border-td-outline-variant pb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-td-on-surface">
                <SplitText text={unit.name} />
              </h1>
              <div className="text-right">
                <span className="block text-2xl md:text-3xl font-heading font-bold text-td-primary">
                  <SplitText text={unit.price.replace("Rp ", "").replace(".000", "")} />
                </span>
                <span className="text-td-on-surface-variant text-sm">/ bulan</span>
              </div>
            </div>
            <p className="flex items-center gap-2 text-td-on-surface-variant">
              <MaterialIcon name="location_on" className="text-td-primary" /> {unit.address}
            </p>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-td-on-surface mb-4">Deskripsi</h2>
            <div className="text-td-on-surface-variant leading-relaxed space-y-4">
              <BlurText text={unit.description} delay={0.2} />
            </div>
          </div>

          {/* Amenities */}
          <section className="border-t border-td-outline-variant pt-10">
            <h2 className="font-heading text-xl font-semibold text-td-on-surface mb-6">Fitur & Fasilitas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {(unit.amenities || []).map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 text-td-on-surface-variant">
                  <MaterialIcon name={amenity.icon} className="text-td-primary" />
                  <span className="font-medium text-sm">{amenity.label}</span>
                </div>
              ))}
              {(!unit.amenities || unit.amenities.length === 0) && (
                <div className="text-td-on-surface-variant col-span-full">Fasilitas tidak tersedia.</div>
              )}
            </div>
          </section>

          {/* Specifications */}
          <section className="border-t border-td-outline-variant pt-10">
            <h2 className="font-heading text-xl font-semibold text-td-on-surface mb-6">Spesifikasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Luas", value: unit.sqft },
                { label: "Tipe Tempat Tidur", value: unit.bed_type },
                { label: "Lantai", value: unit.floor_level },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-td-primary-container pl-6">
                  <p className="text-td-on-surface-variant text-[10px] font-semibold uppercase tracking-wider">{s.label}</p>
                  <p className="font-heading text-xl font-semibold text-td-on-surface">{s.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="border-t border-td-outline-variant pt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-semibold text-td-on-surface">Lokasi</h2>
              <button className="text-td-primary text-xs font-semibold tracking-wider hover:underline">Dapatkan Rute</button>
            </div>
            <div className="w-full h-80 bg-td-surface-container-high rounded-xl overflow-hidden relative border border-td-outline-variant">
              <div className="absolute inset-0 bg-td-surface-container flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-td-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center mx-auto animate-bounce">
                    <MaterialIcon name="apartment" className="text-white" />
                  </div>
                  <p className="mt-4 text-td-on-surface-variant text-sm">{unit.address}</p>
                </div>
              </div>
            </div>
          </section>
          </ScrollReveal>
        </div>

        {/* Right: Booking Sidebar */}
        <aside className="w-full lg:w-[400px]">
          <ScrollReveal direction="left" delay={0.2}>
          <div className="sticky top-28 p-6 bg-white border border-td-outline-variant shadow-lg rounded-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-td-on-surface-variant text-xs font-semibold tracking-wider">Sewa Bulanan</p>
                <h3 className="font-heading text-2xl font-semibold text-td-primary">{unit.price}</h3>
              </div>
              <span className="bg-td-secondary-fixed text-td-on-secondary-fixed px-4 py-1 rounded-full text-xs font-semibold">{unit.status === "Tersedia" ? "Tersedia sekarang" : unit.status}</span>
            </div>
            <div className="space-y-6 mb-10">
              <div className="p-4 bg-td-surface-container-low rounded border border-td-outline-variant flex justify-between items-center cursor-pointer hover:border-td-primary transition-all">
                <div>
                  <p className="text-[10px] font-semibold text-td-on-surface-variant uppercase tracking-wider">Tanggal Masuk</p>
                  <p className="font-semibold">Pilih Tanggal</p>
                </div>
                <MaterialIcon name="calendar_today" className="text-td-outline" />
              </div>
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Nama Lengkap" className="w-full px-4 py-3 bg-td-surface-container rounded-lg border-none focus:ring-1 focus:ring-td-primary text-sm" />
                <input type="tel" placeholder="Nomor Telepon" className="w-full px-4 py-3 bg-td-surface-container rounded-lg border-none focus:ring-1 focus:ring-td-primary text-sm" />
              </div>
              <button 
                onClick={() => gooeyToast.success("Jadwal kunjungan berhasil diajukan!")}
                className="w-full bg-td-primary text-white py-3 rounded-lg text-xs font-semibold tracking-wider uppercase shadow-md hover:bg-td-primary/90 transition-all mb-3"
              >
                Ajukan Jadwal Kunjungan
              </button>
              <button className="w-full border border-td-primary text-td-primary py-3 rounded-lg text-xs font-semibold tracking-wider uppercase hover:bg-td-primary-container transition-colors">
                Tanya via WhatsApp
              </button>
            </div>

            {/* Agent Info */}
          <div className="mt-8 border border-td-outline-variant rounded-3xl p-6 bg-td-surface-container-low flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
              <Image src={(unit.agent && unit.agent.photo) || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"} alt={(unit.agent && unit.agent.name) || "Agen Properti"} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-td-on-surface text-lg">{(unit.agent && unit.agent.name) || "Agen Internal"}</h4>
              <p className="text-td-on-surface-variant text-sm mb-1">{(unit.agent && unit.agent.title) || "Agen Utama"}</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-td-primary">
                <MaterialIcon name="star" className="text-base text-amber-400" />
                {(unit.agent && unit.agent.rating) || 5.0}
              </div>
          </div>
          </div>
          </div>
          </ScrollReveal>
        </aside>
      </div>

      {/* Related Listings */}
      <section className="mt-16 pt-10 border-t border-td-outline-variant">
        <ScrollReveal direction="up" delay={0.2}>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-td-on-surface">Listing Serupa</h2>
            <p className="text-td-on-surface-variant">Jelajahi unit premium lainnya di area sekitar.</p>
          </div>
          <Link href="/listing" className="px-6 py-2 text-td-primary text-xs font-semibold tracking-wider border border-td-outline hover:border-td-primary transition-all rounded-lg uppercase">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedUnits.map((u) => (
            <Link href={`/listing/${u.id}`} key={u.id} className="group bg-white border border-td-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <Image src={(u.images && u.images[0]) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"} alt={u.name} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-semibold text-td-primary">{u.price}/bln</div>
              </div>
              <div className="p-6">
                <h4 className="font-heading text-lg text-td-on-surface mb-1">{u.name}</h4>
                <p className="text-td-on-surface-variant text-sm mb-4">{u.location} • {u.type} • {u.sqft}</p>
                <div className="flex items-center gap-2 text-td-tertiary text-xs font-semibold tracking-wider">
                  <MaterialIcon name="check_circle" className="text-lg" /> {u.status === "Tersedia" ? "Persetujuan Instan" : u.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
