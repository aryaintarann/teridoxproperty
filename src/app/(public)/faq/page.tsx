"use client";

import Link from "next/link";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("booking");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const categories = [
    { id: "booking", icon: "calendar_today", label: "Pemesanan & Sewa" },
    { id: "payments", icon: "payments", label: "Pembayaran & Tagihan" },
    { id: "facilities", icon: "apartment", label: "Fasilitas & Perawatan" },
    { id: "rules", icon: "gavel", label: "Peraturan Hunian" },
  ];

  const faqs = [
    {
      category: "booking",
      icon: "calendar_today",
      title: "Pemesanan & Sewa",
      items: [
        {
          q: "Bagaimana cara menjadwalkan kunjungan properti?",
          a: "Menjadwalkan kunjungan sangat mudah. Arahkan ke halaman 'Unit Tersedia', pilih properti yang Anda minati, lalu klik tombol 'Jadwalkan Tur'. Anda dapat memilih tanggal dan waktu yang sesuai, dan agen properti kami akan mengonfirmasi janji temu dalam waktu 24 jam.",
        },
        {
          q: "Dokumen apa saja yang diperlukan untuk pengajuan?",
          a: "Pengajuan standar memerlukan KTP, bukti penghasilan (slip gaji 3 bulan terakhir), dan kontak darurat. Semua dokumen dapat diunggah langsung melalui Portal Penghuni kami yang aman setelah Anda memulai proses pengajuan.",
        },
      ],
    },
    {
      category: "payments",
      icon: "payments",
      title: "Pembayaran & Tagihan",
      items: [
        {
          q: "Kapan sewa bulanan jatuh tempo?",
          a: "Sewa biasanya jatuh tempo pada tanggal 1 setiap bulannya. Kami memberikan masa tenggang 3 hari, setelah itu denda keterlambatan dapat dikenakan sesuai perjanjian sewa Anda. Anda dapat mengatur pembayaran otomatis melalui Portal Penghuni untuk menghindari denda.",
        },
        {
          q: "Apakah saya bisa membayar sewa menggunakan kartu kredit?",
          a: "Ya, kami menerima kartu kredit utama (Visa, Mastercard) melalui portal kami. Harap dicatat bahwa transaksi kartu kredit mungkin dikenakan biaya pemrosesan kecil. Transfer bank langsung (Virtual Account) bebas biaya.",
        },
      ],
    },
    {
      category: "facilities",
      icon: "apartment",
      title: "Fasilitas & Perawatan",
      items: [
        {
          q: "Bagaimana cara mengajukan perbaikan?",
          a: "Semua permintaan perbaikan non-darurat harus diajukan melalui Portal Penghuni. Sertakan foto dan deskripsi detail untuk membantu tim kami mengatasi masalah dengan lebih cepat. Untuk keadaan darurat (kebocoran air parah, masalah listrik), silakan hubungi hotline 24/7 kami segera.",
        },
      ],
    },
    {
      category: "rules",
      icon: "gavel",
      title: "Peraturan Hunian",
      items: [
        {
          q: "Bagaimana kebijakan mengenai hewan peliharaan?",
          a: "Kebijakan hewan peliharaan bergantung pada unit masing-masing. Beberapa properti kami ramah hewan peliharaan, namun mungkin ada batasan jenis peliharaan. Silakan merujuk pada detail masing-masing unit atau hubungi manajer properti Anda.",
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  let globalItemIndex = 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-td-primary overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 text-center">
          <h1 className="font-heading text-[32px] md:text-[48px] text-td-on-primary mb-4 font-bold">Frequently Asked Questions</h1>
          <p className="text-td-primary-fixed-dim text-lg max-w-2xl mx-auto opacity-90">
            Temukan semua yang perlu Anda ketahui tentang pengelolaan properti, pembayaran, dan pengalaman tinggal bersama Teridox.
          </p>
        </div>
      </section>

      {/* FAQ Content & Search */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-12">
        <div className="mb-10 lg:hidden">
            <div className="relative">
              <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-td-outline" />
              <input 
                type="text" 
                placeholder="Cari pertanyaan..." 
                className="w-full pl-10 pr-4 py-3 border border-td-outline-variant rounded-lg bg-td-surface-container-lowest focus:ring-2 focus:ring-td-primary/10 focus:border-td-primary outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar Categories */}
          <aside className="lg:col-span-3 space-y-1">
            <h3 className="text-xs font-semibold tracking-widest text-td-outline uppercase mb-6">Kategori</h3>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery("");
                }}
                className={`w-full text-left p-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeCategory === cat.id && !searchQuery
                    ? "bg-td-primary-fixed text-td-on-primary-fixed"
                    : "text-td-on-surface-variant hover:bg-td-surface-container-high"
                }`}
              >
                <MaterialIcon name={cat.icon} className="text-xl" /> {cat.label}
              </button>
            ))}
            
            <div className="mt-8 hidden lg:block">
              <div className="relative">
                <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-td-outline" />
                <input 
                  type="text" 
                  placeholder="Cari pertanyaan..." 
                  className="w-full pl-10 pr-4 py-2 border border-td-outline-variant rounded-lg bg-td-surface-container-lowest focus:ring-2 focus:ring-td-primary/10 focus:border-td-primary outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* Accordions */}
          <div className="lg:col-span-9 space-y-10">
            {filteredFaqs.map((category) => {
              if (!searchQuery && activeCategory !== category.category) return null;

              return (
                <div key={category.category} className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-td-secondary-container rounded-lg">
                      <MaterialIcon name={category.icon} className="text-td-primary" filled />
                    </div>
                    <h2 className="font-heading text-2xl font-semibold">{category.title}</h2>
                  </div>

                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const currentIndex = globalItemIndex++;
                      const isOpen = openItems.includes(currentIndex);

                      return (
                        <div
                          key={currentIndex}
                          className="border-b border-td-outline-variant bg-td-surface-container-lowest rounded-lg px-6 cursor-pointer hover:bg-td-surface-bright transition-colors overflow-hidden"
                          onClick={() => toggleItem(currentIndex)}
                        >
                          <div className="flex justify-between items-center py-6">
                            <h4 className="font-heading text-xl font-semibold text-td-on-surface">{item.q}</h4>
                            <MaterialIcon
                              name="expand_more"
                              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                          <div
                            className="faq-content"
                            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                          >
                            <div>
                              <p className="text-td-on-surface-variant leading-relaxed pb-6">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {filteredFaqs.length === 0 && (
               <div className="text-center py-10 text-td-on-surface-variant">
                  Tidak ada pertanyaan yang cocok dengan pencarian Anda.
               </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-td-surface-container py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-12 text-center">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-td-primary mb-6 shadow-md">
            <MaterialIcon name="support_agent" className="text-[40px] text-td-on-primary" />
          </div>
          <h2 className="font-heading text-[32px] md:text-[48px] font-bold text-td-on-surface mb-4">Masih punya pertanyaan?</h2>
          <p className="text-lg text-td-on-surface-variant mb-10 max-w-2xl mx-auto">
            Tim dukungan khusus kami siap membantu Anda dengan pertanyaan apa pun yang belum tercakup dalam FAQ kami.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/contact" className="w-full sm:w-auto bg-td-primary text-td-on-primary px-16 py-4 rounded-lg text-xs font-semibold tracking-wider uppercase hover:shadow-lg transition-all text-center">
              Hubungi Kami
            </Link>
            <Link href="#" className="w-full sm:w-auto border border-td-primary text-td-primary px-16 py-4 rounded-lg text-xs font-semibold tracking-wider uppercase hover:bg-td-primary-container/10 transition-all text-center">
              Live Chat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
