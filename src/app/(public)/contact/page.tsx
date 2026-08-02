"use client";

import Image from "next/image";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { SplitText } from "@/components/ui/SplitText";
import { BlurText } from "@/components/ui/BlurText";
import { gooeyToast } from "goey-toast";
import { contactImages } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      gooeyToast.success("Pesan terkirim! Tim kami akan segera menghubungi Anda.");
      
      setTimeout(() => {
        setIsSent(false);
        (e.target as HTMLFormElement).reset();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen selection:bg-td-primary-fixed selection:text-td-on-primary-fixed">
      {/* Header Banner */}
      <section className="relative h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={contactImages.banner} alt="Lobi properti modern" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-td-primary/40 mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 w-full">
          <div className="max-w-2xl">
            <h1 className="font-heading text-[48px] font-bold text-white mb-1 drop-shadow-md">
              <SplitText text="Hubungi Kami" />
            </h1>
            <p className="text-lg text-td-surface-container-lowest opacity-90 max-w-lg mt-4 drop-shadow">
              <BlurText text="Tim berdedikasi kami siap membantu Anda dengan segala kebutuhan manajemen properti Anda. Layanan yang andal dimulai dengan percakapan sederhana." delay={0.2} />
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 overflow-hidden">
        <ScrollReveal direction="up" delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Form Section */}
          <div className="lg:col-span-7">
            <div className="glass-card p-10 rounded-xl shadow-sm">
              <div className="mb-10">
                <h2 className="font-heading text-2xl font-semibold text-td-primary mb-2">Kirim Pesan</h2>
                <p className="text-td-secondary">Isi formulir di bawah ini dan kami akan menghubungi Anda kembali dalam waktu 24 jam.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-td-on-surface-variant">NAMA LENGKAP</label>
                    <input required type="text" placeholder="Budi Santoso" className="w-full px-4 py-3 border border-td-outline-variant rounded-lg focus:outline-none focus:border-td-primary focus:ring-2 focus:ring-td-primary/10 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-td-on-surface-variant">ALAMAT EMAIL</label>
                    <input required type="email" placeholder="budi@example.com" className="w-full px-4 py-3 border border-td-outline-variant rounded-lg focus:outline-none focus:border-td-primary focus:ring-2 focus:ring-td-primary/10 transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-td-on-surface-variant">NOMOR TELEPON</label>
                  <input required type="tel" placeholder="0812 3456 7890" className="w-full px-4 py-3 border border-td-outline-variant rounded-lg focus:outline-none focus:border-td-primary focus:ring-2 focus:ring-td-primary/10 transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-td-on-surface-variant">PESAN</label>
                  <textarea required rows={5} placeholder="Bagaimana kami bisa membantu Anda hari ini?" className="w-full px-4 py-3 border border-td-outline-variant rounded-lg focus:outline-none focus:border-td-primary focus:ring-2 focus:ring-td-primary/10 transition-all resize-none"></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting || isSent}
                  className={`w-full md:w-auto px-10 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    isSent 
                      ? 'bg-td-tertiary-container text-td-on-tertiary-container'
                      : 'bg-td-primary text-td-on-primary hover:bg-td-primary-container'
                  }`}
                >
                  {isSubmitting ? 'Mengirim...' : isSent ? 'Pesan Terkirim!' : 'Kirim Pesan'}
                  {!isSubmitting && !isSent && <MaterialIcon name="send" className="text-[18px]" />}
                </button>
              </form>
            </div>
          </div>

          {/* Info & Map Section */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-semibold text-td-primary">Informasi Kantor</h3>
              
              <div className="flex gap-4 items-start">
                <div className="bg-td-secondary-fixed w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <MaterialIcon name="location_on" className="text-td-primary" filled />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-td-on-surface-variant mb-1">KANTOR PUSAT</p>
                  <p className="text-base text-td-on-surface leading-relaxed">
                    123 Corporate Plaza, Suite 400<br/>
                    Kuningan, Jakarta Selatan 12940
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-td-tertiary-fixed w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <MaterialIcon name="chat" className="text-td-tertiary" filled />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-td-on-surface-variant mb-1">DUKUNGAN WHATSAPP</p>
                  <p className="text-base text-td-primary font-semibold">+62 811-2345-6789</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-td-secondary-fixed w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <MaterialIcon name="mail" className="text-td-primary" filled />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-td-on-surface-variant mb-1">EMAIL ENQUIRIES</p>
                  <p className="text-base text-td-on-surface">hello@teridox.com</p>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="w-full aspect-square md:aspect-video lg:aspect-auto flex-grow bg-td-surface-container rounded-xl border border-td-outline-variant overflow-hidden relative group">
              <div className="absolute inset-0">
                <Image src={contactImages.map} alt="Peta Lokasi" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute inset-0 bg-td-primary/5 pointer-events-none" />
              
              {/* Marker Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-td-primary text-white p-2 rounded-lg shadow-lg mb-2 whitespace-nowrap">
                  <p className="text-[10px] font-bold">TERIDOX HQ</p>
                </div>
                <MaterialIcon name="location_on" className="text-td-primary text-4xl drop-shadow-md" filled />
              </div>
              
              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center text-td-primary hover:bg-td-surface-bright"><MaterialIcon name="add" /></button>
                <button className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center text-td-primary hover:bg-td-surface-bright"><MaterialIcon name="remove" /></button>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Quick FAQ Mini-Section */}
      <section className="bg-td-surface-container-low py-16 overflow-hidden">
        <ScrollReveal direction="up" delay={0.2}>
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-semibold text-td-primary">Pertanyaan Umum</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg border border-td-outline-variant hover:shadow-md transition-shadow">
              <h4 className="font-heading text-base font-semibold text-td-primary mb-2">Seberapa cepat Anda merespon?</h4>
              <p className="text-sm text-td-secondary leading-relaxed">Waktu respon standar kami adalah di bawah 4 jam kerja untuk semua pertanyaan digital.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-td-outline-variant hover:shadow-md transition-shadow">
              <h4 className="font-heading text-base font-semibold text-td-primary mb-2">Bisakah saya mengunjungi kantor?</h4>
              <p className="text-sm text-td-secondary leading-relaxed">Ya, kantor pusat kami terbuka untuk publik dari jam 9 pagi hingga 5 sore, Senin hingga Jumat.</p>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
