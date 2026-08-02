"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { heroImage, availableUnits } from "@/lib/mock-data";
import { SplitText } from "@/components/ui/SplitText";
import { BlurText } from "@/components/ui/BlurText";
import { gooeyToast } from "goey-toast";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  const featuredUnits = availableUnits.slice(0, 3);
  const [isGridLoading, setIsGridLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsGridLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[720px] flex items-center justify-center overflow-hidden py-16 px-4 md:px-12">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Gedung residensial modern premium"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.85]"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl w-full text-center space-y-10">
          <h1 className="font-heading text-[32px] md:text-[48px] leading-tight md:leading-[56px] font-bold text-white drop-shadow-lg tracking-tight">
            <SplitText text="Temukan Pengalaman Kost Terbaik Anda" />
          </h1>
          <div className="text-white text-lg max-w-2xl mx-auto drop-shadow-md leading-relaxed">
            <BlurText text="Hunian modern, terpercaya, dan nyaman yang dikurasi untuk profesional dan mahasiswa. Rumah kedua Anda dimulai di sini." delay={0.5} />
          </div>

          {/* Search Bar */}
          <div className="bg-white p-1 md:p-1 rounded-full shadow-lg max-w-3xl mx-auto flex flex-col md:flex-row items-center border border-td-outline-variant">
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-td-outline-variant w-full">
              <MaterialIcon
                name="location_on"
                className="text-td-primary mr-2"
              />
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-base placeholder:text-td-on-surface-variant text-td-on-surface"
                placeholder="Di mana Anda ingin tinggal?"
                type="text"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-2 w-full">
              <MaterialIcon
                name="payments"
                className="text-td-primary mr-2"
              />
              <select className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-base text-td-on-surface-variant cursor-pointer">
                <option value="">Rentang Harga</option>
                <option value="low">Di bawah 2 Juta</option>
                <option value="mid">2 - 5 Juta</option>
                <option value="high">Di atas 5 Juta</option>
              </select>
            </div>
            <button 
              onClick={() => {
                gooeyToast.success("Pencarian berhasil! Memuat properti...");
              }}
              className="w-full md:w-auto bg-td-primary text-white px-10 py-2 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-td-primary-container transition-colors m-1"
            >
              Cari
            </button>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <ScrollReveal direction="up">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-td-primary">
              Unit Kost Premium
            </h2>
            <p className="text-td-on-surface-variant">
              Pilihan terbaik yang dikurasi untuk gaya hidup Anda.
            </p>
          </div>
          <Link
            href="/listing"
            className="text-td-primary text-xs font-semibold tracking-wider flex items-center hover:underline"
          >
            Lihat Semua{" "}
            <MaterialIcon name="arrow_forward" className="ml-1 text-sm" />
          </Link>
        </div>

        <phantom-ui loading={isGridLoading} animation="wave" reveal={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredUnits.map((unit) => (
                <div
                key={unit.id}
                className="group bg-white rounded-lg border border-td-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                <Link href={`/listing/${unit.id}`}>
                    <div className="relative h-64 overflow-hidden">
                        <Image
                        src={unit.images[0]}
                        alt={unit.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                        className={`absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-semibold tracking-wider ${
                            unit.status === "Tersedia"
                            ? "bg-td-tertiary-container text-td-on-tertiary-container"
                            : unit.status === "Maintenance"
                            ? "bg-td-secondary-container text-td-on-secondary-container"
                            : "bg-td-secondary-container text-td-on-secondary-container"
                        }`}
                        >
                        {unit.status}
                        </div>
                    </div>
                </Link>
                <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                    <h3 className="font-heading text-xl font-semibold text-td-on-surface">
                        {unit.name}
                    </h3>
                    <span className="text-td-primary font-bold">
                        {unit.price.replace("Rp ", "").replace(".000", "")}
                        <span className="text-xs font-normal text-td-on-surface-variant ml-0.5">
                        /bln
                        </span>
                    </span>
                    </div>
                    <div className="flex items-center text-td-on-surface-variant text-sm">
                    <MaterialIcon
                        name="location_on"
                        className="text-sm mr-1"
                    />
                    {unit.location}
                    </div>
                    <div className="flex gap-4 pt-2 border-t border-td-outline-variant">
                    {unit.amenities.slice(0, 3).map((a) => (
                        <div
                        key={a.icon}
                        className="flex items-center text-td-on-surface-variant text-xs font-semibold tracking-wider"
                        >
                        <MaterialIcon
                            name={a.icon}
                            className="text-sm mr-1"
                        />
                        {a.label}
                        </div>
                    ))}
                    </div>
                    <button 
                    onClick={(e) => {
                        e.preventDefault();
                        gooeyToast.success(`Berhasil menambahkan ${unit.name} ke daftar pemesanan!`);
                    }}
                    className="w-full bg-td-primary text-white py-2 rounded-lg font-medium hover:bg-td-primary/90 transition-colors"
                    >
                    Pesan Sekarang
                    </button>
                </div>
                </div>
            ))}
          </div>
        </phantom-ui>
        </ScrollReveal>
      </section>

      {/* Why Choose Us */}
      <section className="bg-td-surface-container-low py-16 px-4 md:px-12 overflow-hidden">
        <ScrollReveal direction="up" delay={0.2}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl font-semibold text-td-primary mb-2">
              Mengapa Teridox Property?
            </h2>
            <p className="text-td-on-surface-variant max-w-xl mx-auto">
              Kami mendefinisikan ulang manajemen properti dengan transparansi
              dan layanan berkualitas tinggi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "verified_user",
                title: "Kepercayaan Terverifikasi",
                desc: "Semua listing kami melalui pemeriksaan kualitas 20 poin. Kami memastikan keamanan dan transparansi kontrak Anda sejak hari pertama.",
              },
              {
                icon: "bolt",
                title: "Kenyamanan Tanpa Hambatan",
                desc: "Bayar tagihan, laporkan perawatan, dan lacak riwayat Anda melalui portal penghuni kami. Tidak ada lagi dokumen berantakan.",
              },
              {
                icon: "apartment",
                title: "Fasilitas Premium",
                desc: "Dari internet fiber optik hingga layanan laundry, properti kami dilengkapi dengan fasilitas yang Anda butuhkan untuk berkembang.",
              },
            ].map((item) => (
              <div
                key={item.icon}
                className="bg-white p-10 rounded-lg shadow-sm border border-td-outline-variant space-y-4 text-center md:text-left"
              >
                <div className="w-12 h-12 bg-td-primary-fixed flex items-center justify-center rounded-lg mx-auto md:mx-0">
                  <MaterialIcon
                    name={item.icon}
                    className="text-td-primary text-3xl"
                  />
                </div>
                <h3 className="font-heading text-xl font-semibold text-td-on-surface">
                  {item.title}
                </h3>
                <p className="text-td-on-surface-variant text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-12 overflow-hidden">
        <ScrollReveal direction="up" delay={0.1}>
        <div className="max-w-4xl mx-auto bg-td-primary text-white rounded-3xl py-16 px-10 text-center shadow-xl">
          <h2 className="font-heading text-2xl font-semibold mb-4">
            Siap Menemukan Rumah Baru Anda?
          </h2>
          <p className="text-td-primary-fixed-dim mb-10 max-w-lg mx-auto">
            Jelajahi 500+ listing premium di lokasi paling strategis di
            seluruh kota.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/listing"
              className="bg-white text-td-primary px-10 py-4 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-td-surface-bright transition-colors shadow-lg"
            >
              Jelajahi Semua Listing
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white px-10 py-4 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-white/10 transition-colors"
            >
              Hubungi Support
            </Link>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </>
  );
}
