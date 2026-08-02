"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { heroImage, availableUnits } from "@/lib/mock-data";
import { SplitText } from "@/components/ui/SplitText";
import { BlurText } from "@/components/ui/BlurText";
import { gooeyToast } from "goey-toast";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

export default function HomePage() {
  const featuredUnits = availableUnits.slice(0, 3);
  const [isGridLoading, setIsGridLoading] = useState(true);
  const ctaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctaRef.current.style.setProperty("--mouse-x", `${x}px`);
    ctaRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsGridLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero Section - Glassmorphism floating UI */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4 md:px-12 mt-4 md:mt-8 mx-4 md:mx-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Gedung residensial modern premium"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.7] dark:brightness-[0.4] scale-105"
            priority
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative z-10 glass-card rounded-3xl p-8 md:p-12 max-w-4xl w-full text-center space-y-8"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold tracking-widest uppercase mb-2">
            Teridox Property
          </div>
          <h1 className="font-heading text-[36px] md:text-[56px] leading-tight md:leading-[1.1] font-bold text-foreground drop-shadow-md tracking-tight">
            <SplitText text="Temukan Rumah Keduamu" />
          </h1>
          <div className="text-foreground/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            <BlurText text="Hunian modern dan nyaman yang dikurasi khusus untuk gaya hidup dinamis Anda." delay={0.3} />
          </div>

          {/* Search Bar */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-background/90 dark:bg-background/60 backdrop-blur-md p-1.5 md:p-2 rounded-[2rem] shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center border border-border/50 mt-8"
          >
            <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-border/50 w-full">
              <MaterialIcon
                name="location_on"
                className="text-primary mr-3 text-xl"
              />
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-base placeholder:text-muted-foreground text-foreground font-medium"
                placeholder="Di mana Anda ingin tinggal?"
                type="text"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 w-full">
              <MaterialIcon
                name="payments"
                className="text-primary mr-3 text-xl"
              />
              <select className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-base text-foreground font-medium cursor-pointer">
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
              className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-bold tracking-wider hover-bouncy shadow-lg m-1 md:ml-2"
            >
              Cari Sekarang
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-4 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
        <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Unit Premium
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Pilihan hunian estetik dengan fasilitas lengkap untuk mendukung produktivitasmu.
            </p>
          </div>
          <Link
            href="/listing"
            className="group flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full text-sm font-semibold hover-bouncy transition-colors"
          >
            Lihat Semua Unit
            <MaterialIcon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <phantom-ui loading={isGridLoading} animation="wave" reveal={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredUnits.map((unit, i) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-card rounded-[2rem] border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <Link href={`/listing/${unit.id}`}>
                    <div className="relative h-72 overflow-hidden p-3">
                        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                          <Image
                          src={unit.images[0]}
                          alt={unit.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          />
                          {/* Modern Badge */}
                          <div
                          className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-sm ${
                              unit.status === "Tersedia"
                              ? "bg-primary/90 text-primary-foreground border border-primary/20"
                              : "bg-background/80 text-foreground border border-border/50"
                          }`}
                          >
                          {unit.status}
                          </div>
                        </div>
                    </div>
                </Link>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-heading text-2xl font-bold text-foreground leading-tight">
                          {unit.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-primary font-bold text-lg block">
                            {unit.price.replace("Rp ", "").replace(".000", "")}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">/ bulan</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground text-sm font-medium">
                      <MaterialIcon
                          name="location_on"
                          className="text-base mr-1.5 text-primary/70"
                      />
                      {unit.location}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
                      {unit.amenities.slice(0, 3).map((a) => (
                          <div
                          key={a.icon}
                          className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-lg text-secondary-foreground text-xs font-bold"
                          >
                          <MaterialIcon
                              name={a.icon}
                              className="text-sm mr-1.5"
                          />
                          {a.label}
                          </div>
                      ))}
                    </div>

                    <button 
                      onClick={(e) => {
                          e.preventDefault();
                          gooeyToast.success(`Berhasil menambahkan ${unit.name} ke daftar!`);
                      }}
                      className="w-full mt-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground py-3.5 rounded-xl font-bold transition-colors duration-300"
                    >
                      Pesan Sekarang
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        </phantom-ui>
        </ScrollReveal>
      </section>

      {/* Why Choose Us - Bento Box Layout */}
      <section className="py-24 px-4 md:px-12 overflow-hidden bg-background">
        <ScrollReveal direction="up" delay={0.2}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Standar Baru <span className="text-primary">Hunian.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Kami mendefinisikan ulang cara kamu menyewa properti dengan proses yang transparan, mudah, dan serba digital.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Bento Item 1 - Large */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-2 bg-card rounded-[2.5rem] p-10 border border-border relative overflow-hidden group shadow-lg"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-border">
                    <MaterialIcon name="verified_user" className="text-primary text-3xl" />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-foreground mb-4">
                    Kepercayaan Terverifikasi
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Semua listing kami melalui pemeriksaan kualitas 20 poin. Kami memastikan keamanan, kebersihan, dan transparansi kontrak sejak hari pertama kamu masuk.
                  </p>
                </div>
                <div className="mt-8 flex gap-3">
                  <div className="bg-background px-4 py-2 rounded-full text-sm font-semibold border border-border shadow-sm">100% Aman</div>
                  <div className="bg-background px-4 py-2 rounded-full text-sm font-semibold border border-border shadow-sm">Tanpa Biaya Tersembunyi</div>
                </div>
              </div>
            </motion.div>

            {/* Bento Item 2 - Small */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-primary text-primary-foreground rounded-[2.5rem] p-8 relative overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <MaterialIcon name="bolt" className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold mb-3">
                  Kenyamanan Digital
                </h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  Bayar tagihan, laporkan perawatan, dan perpanjang sewa langsung dari smartphone. Semua ada di genggaman.
                </p>
              </div>
            </motion.div>

            {/* Bento Item 3 - Small */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-secondary rounded-[2.5rem] p-8 border border-border shadow-lg flex flex-col justify-between"
            >
               <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border">
                <MaterialIcon name="apartment" className="text-primary text-2xl" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Fasilitas Premium
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Dari internet fiber optik berkecepatan tinggi hingga layanan pembersihan mingguan.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* CTA Section - Mesh Gradient */}
      <section className="py-24 px-4 md:px-12 overflow-hidden">
        <ScrollReveal direction="up" delay={0.1}>
        <div 
          ref={ctaRef}
          onMouseMove={handleMouseMove}
          className="max-w-[1400px] mx-auto mesh-gradient rounded-[3rem] py-20 px-8 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Glass overlay to tone down the gradient if needed */}
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10 pointer-events-none">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6 drop-shadow-sm pointer-events-auto">
              Siap Pindah ke Rumah Baru?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-12 max-w-2xl mx-auto font-medium pointer-events-auto">
              Jelajahi ratusan listing premium di lokasi paling strategis. Jadikan hari-harimu lebih produktif dengan hunian yang tepat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
              <Link
                href="/listing"
                className="w-full sm:w-auto bg-background text-foreground px-10 py-4 rounded-full text-sm font-bold tracking-wide hover-bouncy shadow-xl border border-border/20"
              >
                Mulai Eksplorasi
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-black/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-black/30 transition-colors"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </>
  );
}
