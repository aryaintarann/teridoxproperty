# Architecture — TeridoxProperty

## 1. Ringkasan

Dokumen ini berisi rencana tech stack untuk TeridoxProperty, terpisah dari PRD agar pembahasan fitur dan pembahasan teknis tidak bercampur.

## 2. Tech Stack

| Layer | Teknologi | Peran |
|---|---|---|
| Framework | Next.js | Frontend + API routes/server actions |
| Backend/Data | Supabase | Database (Postgres), Auth, Storage, Realtime |
| Komponen Dasar | shadcn/ui | Base component library (form, dialog, table, dsb) |
| Skeleton Loading | Phantom UI | Skeleton loader otomatis berbasis Web Component — membungkus komponen asli dan menghasilkan shimmer placeholder tanpa bikin skeleton manual |
| Notifikasi | Gooey Toast | Toast notification dengan animasi blob/morphing untuk React, termasuk promise tracking (loading → success/error) |
| Animasi/Interaksi | React Bits | Kumpulan komponen animasi React untuk elemen UI yang lebih hidup (efek teks, background, transisi) |
| Deployment | Vercel | Hosting Next.js |

## 3. Peran Tiap Layer dalam Alur Aplikasi

- **Next.js** — merender halaman (dashboard Owner/Admin, portal Penyewa), menangani routing, dan sebagai layer API tipis (server actions/route handlers) yang berkomunikasi dengan Supabase.
- **Supabase** — sumber data utama: tabel properti, unit, penyewa, kontrak, tagihan; menangani autentikasi (role Owner/Admin/Staff/Penyewa) lewat Supabase Auth; Storage untuk file upload (KTP, foto unit, bukti bayar); Realtime untuk update status (misal status maintenance) tanpa perlu refresh manual.
- **shadcn/ui** — komponen dasar seperti form, table, dialog, dropdown untuk membangun UI dengan cepat dan konsisten.
- **Phantom UI** — dipasang di komponen-komponen yang memuat data dari Supabase (misal tabel tagihan, daftar unit) supaya ada shimmer loading otomatis saat data sedang diambil, tanpa bikin skeleton komponen terpisah.
- **Gooey Toast** — menampilkan notifikasi hasil aksi (berhasil buat kontrak, gagal upload bukti bayar, dsb), termasuk state loading saat proses async (misal saat generate PDF invoice).
- **React Bits** — dipakai di bagian yang butuh kesan visual lebih menarik, misalnya landing page/microsite listing properti atau halaman onboarding, bukan di layar operasional inti (dashboard tagihan tetap fungsional-first).

## 4. Pertimbangan

- Karena Supabase menangani Auth, Storage, dan Realtime, tidak diperlukan backend terpisah (Laravel) untuk MVP — mengurangi kompleksitas infrastruktur.
- Row Level Security (RLS) di Supabase perlu dirancang dari awal untuk memisahkan akses data antar role (Owner/Admin/Staff/Penyewa), dan penting juga jika nanti masuk fase multi-tenant SaaS.
- Phantom UI dan Gooey Toast masih tergolong library kecil/niche — perlu dicek stabilitas rilis dan kompatibilitas versi Next.js/React yang dipakai sebelum dipasang di production.

## 5. Open Questions

- Apakah generate PDF (kontrak, invoice) dilakukan di sisi Next.js (server action) atau via Supabase Edge Function?
- Apakah notifikasi WhatsApp/email (dari PRD) akan pakai Supabase Edge Function + third-party API (misal Fonnte/WA Business API), atau service terpisah?