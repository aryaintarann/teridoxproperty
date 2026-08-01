import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { aboutImages } from "@/lib/mock-data";
import { SplitText } from "@/components/ui/SplitText";
import { BlurText } from "@/components/ui/BlurText";

export const metadata = {
  title: "Tentang Kami | Teridox Property",
  description: "Pelajari lebih lanjut tentang Teridox Property — mendefinisikan ulang hunian modern melalui keunggulan arsitektural dan manajemen yang teliti.",
};

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={aboutImages.banner} alt="Gedung arsitektur modern" fill sizes="100vw" className="object-cover brightness-[0.7]" priority />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-[32px] md:text-[48px] font-bold text-white mb-1 drop-shadow-md">
            <SplitText text="Tentang Kami" />
          </h1>
          <p className="text-white/90 text-lg">
            <BlurText text="Membangun Komunitas, Menyediakan Kenyamanan" delay={0.4} />
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold tracking-[0.2em] text-td-primary uppercase mb-2 block">Profesionalisme Utama</span>
            <h2 className="font-heading text-2xl font-semibold text-td-primary mb-6">Mengangkat Pengalaman &quot;Kost-Kostan&quot;</h2>
            <div className="space-y-4 text-td-on-surface-variant">
              <p>Didirikan berdasarkan prinsip modernisme korporat, Teridox Property mengkhususkan diri dalam manajemen ruang hunian dengan utilitas tinggi. Kami menyadari adanya celah di pasar di mana &quot;kost-kostan&quot; tradisional sering kali kurang memiliki transparansi dan keandalan struktural dari perusahaan modern.</p>
              <p>Perjalanan kami dimulai dengan satu properti dan komitmen terhadap integritas arsitektural. Saat ini, kami mengelola portofolio unit yang beragam, memastikan setiap penghuni merasakan kehangatan hunian yang seimbang dengan efisiensi platform SaaS premium.</p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { val: "10+", label: "TAHUN PENGALAMAN" },
                { val: "500+", label: "UNIT" },
                { val: "98%", label: "KEPUASAN PENGHUNI" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-td-primary font-heading text-[32px] font-bold">{s.val}</div>
                  <div className="text-xs font-semibold tracking-wider text-td-outline">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
              <Image src={aboutImages.hallway} alt="Interior hunian modern" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-td-primary-container -z-10 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-td-surface-container-low py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-td-primary">
              <BlurText text="Fondasi Kami" />
            </h2>
            <p className="text-td-on-surface-variant mt-1">Dibangun di atas kepercayaan, transparansi, dan stabilitas arsitektural.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white border border-td-outline-variant p-10 flex flex-col items-start hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-td-primary-fixed rounded-full flex items-center justify-center mb-6">
                <MaterialIcon name="visibility" className="text-td-primary text-[28px]" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-td-primary mb-4">Visi Kami</h3>
              <p className="text-td-on-surface-variant">Menjadi standar emas dalam manajemen properti berbasis teknologi, di mana setiap unit hunian diperlakukan sebagai aset premium dan setiap penghuni merasa dihargai serta aman dalam lingkungan yang terstruktur.</p>
            </div>
            <div className="bg-white border border-td-outline-variant p-10 flex flex-col items-start hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-td-tertiary-fixed rounded-full flex items-center justify-center mb-6">
                <MaterialIcon name="rocket_launch" className="text-td-tertiary text-[28px]" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-td-primary mb-4">Misi Kami</h3>
              <p className="text-td-on-surface-variant">Menjembatani kesenjangan antara pemilik properti dan penghuni melalui antarmuka digital berkegunaan tinggi, protokol perawatan yang ketat, dan komitmen terhadap pelaporan keuangan yang transparan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Excellence */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="font-heading text-2xl font-semibold text-td-primary">Keunggulan Layanan</h2>
            <p className="text-td-on-surface-variant mt-1">Nilai-nilai inti kami mendorong setiap interaksi, dari tur pertama hingga inspeksi akhir.</p>
          </div>
          <Link href="/contact" className="border border-td-primary text-td-primary px-10 py-2 rounded text-xs font-semibold tracking-wider uppercase hover:bg-td-primary-fixed transition-colors">
            Bergabung Dengan Kami
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "verified_user", title: "INTEGRITAS", desc: "Transparansi mutlak dalam perawatan dan penagihan." },
            { icon: "construction", title: "PERAWATAN", desc: "Respon cepat 24/7 untuk semua masalah fasilitas." },
            { icon: "speed", title: "EFISIENSI", desc: "Pendekatan digital-first untuk mengurangi hambatan." },
            { icon: "groups", title: "KOMUNITAS", desc: "Membangun ekosistem hunian yang saling menghormati." },
          ].map((v) => (
            <div key={v.icon} className="p-6 border border-td-outline-variant rounded-lg flex flex-col items-center text-center group hover:border-td-primary transition-colors">
              <MaterialIcon name={v.icon} className="text-[40px] text-td-primary mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-semibold tracking-wider text-td-primary mb-2">{v.title}</h4>
              <p className="text-sm text-td-on-surface-variant">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team Highlight */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white border border-td-outline-variant p-10 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded overflow-hidden relative">
              <Image src={aboutImages.teamFemale} alt="Manajer properti" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="aspect-square rounded overflow-hidden mt-10 relative">
              <Image src={aboutImages.teamMale} alt="Direktur operasi" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold text-td-primary mb-4">Tim di Balik Teridox</h3>
            <p className="text-td-on-surface-variant mb-6">Tim kami terdiri dari para veteran industri dari perhotelan, teknik sipil, dan pengembangan perangkat lunak. Pendekatan multidisiplin ini memungkinkan kami mengelola properti dengan perpaduan unik antara presisi struktural dan layanan berorientasi pelanggan.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-td-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-2xl font-semibold mb-6">Siap merasakan hunian yang lebih baik?</h2>
          <p className="mb-10 opacity-80">Jelajahi listing yang kami kelola dan temukan rumah modern Anda berikutnya bersama Teridox Property.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listing" className="bg-td-on-primary-container text-td-primary text-xs font-semibold tracking-wider uppercase px-10 py-3 rounded-lg hover:brightness-110 transition-all">Lihat Listing</Link>
            <Link href="/contact" className="border border-white text-white text-xs font-semibold tracking-wider uppercase px-10 py-3 rounded-lg hover:bg-white/10 transition-all">Hubungi Agen</Link>
          </div>
        </div>
      </section>
    </>
  );
}
