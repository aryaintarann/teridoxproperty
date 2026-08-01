# PRD — TeridoxProperty
**Product Requirement Document**

| | |
|---|---|
| Produk | TeridoxProperty |
| Tipe | Property Management System (PMS) — Sewa/Kos |
| Dibuat oleh | Teridox |
| Versi Dokumen | 1.0 |
| Status | Draft |

---

## 1. Latar Belakang & Tujuan

TeridoxProperty adalah sistem manajemen properti berbasis web (dengan potensi mobile companion app) yang ditujukan untuk pemilik/pengelola properti sewa dan kos di Indonesia. Tujuan utama produk ini adalah menyederhanakan pengelolaan penyewa, kontrak, dan tagihan, sekaligus membuka peluang menjadi produk SaaS multi-tenant di masa depan.

## 2. Target Pengguna

| Role | Deskripsi |
|---|---|
| Owner/Admin | Pemilik properti, akses penuh ke semua data dan laporan |
| Staff/Pengelola | Karyawan yang mengelola operasional harian (input pembayaran, maintenance) |
| Penyewa (Tenant) | Pengguna portal mandiri untuk cek tagihan, kontrak, dan ajukan komplain |

## 3. FASE 1 — MVP

Fokus MVP: operasional inti pengelolaan penyewa, kontrak, dan tagihan berjalan lancar untuk 1 pemilik/1-beberapa properti.

### 4.1 Manajemen Properti & Unit
- CRUD data properti (nama, alamat, foto, fasilitas)
- CRUD unit/kamar per properti (tipe, harga sewa, status: kosong/terisi/maintenance)

### 4.2 Manajemen Penyewa
- CRUD data penyewa (identitas, kontak, upload KTP/KK)
- Riwayat sewa per penyewa

### 4.3 Kontrak Sewa
- Buat kontrak (durasi, harga, deposit, aturan dasar)
- Generate kontrak ke PDF
- Reminder kontrak akan habis (H-30, H-7)

### 4.4 Tagihan & Pembayaran
- Generate tagihan bulanan otomatis
- Tracking status pembayaran (lunas/belum/terlambat)
- Upload bukti bayar manual (transfer) — payment gateway masuk fase berikut jika diperlukan lebih cepat
- Invoice/kwitansi otomatis (PDF)

### 4.5 Notifikasi Dasar
- Reminder jatuh tempo via WhatsApp/email
- Notifikasi kontrak akan habis

### 4.6 Maintenance Sederhana
- Penyewa ajukan laporan kerusakan (teks + foto)
- Admin update status (pending/proses/selesai)

### 4.7 Laporan Dasar
- Pendapatan per properti/unit
- Occupancy rate
- Daftar tunggakan

### 4.8 Dashboard & Akses
- Dashboard ringkas untuk Owner/Admin
- Portal mandiri sederhana untuk penyewa (lihat tagihan & kontrak sendiri)
- Role: Owner/Admin, Staff, Penyewa

**Kriteria Sukses MVP:** Owner bisa mengelola minimal 1 properti penuh (unit, penyewa, kontrak, tagihan) tanpa Excel manual sama sekali.

---

## 4. FASE 2 — Advanced (Growth)

Fitur untuk meningkatkan efisiensi, retensi, dan mulai membuka potensi SaaS.

### 5.1 Financial Advance
- Integrasi payment gateway (Midtrans/Xendit)
- Auto-reconciliation mutasi pembayaran
- Manajemen deposit & refund otomatis
- Split payment/cicilan sewa fleksibel

### 5.2 AI & Otomatisasi
- OCR scan KTP otomatis isi data penyewa
- Prediksi risiko telat bayar (scoring sederhana dari riwayat)
- Chatbot AI untuk calon penyewa (ketersediaan unit, harga, syarat)
- Rekomendasi auto-pricing berdasarkan data internal

### 5.3 Penyewa Experience
- E-signature kontrak digital (integrasi Privy/Digisign)
- In-app maintenance request dengan tracking real-time
- Marketplace layanan tambahan (laundry, cleaning)

### 5.4 Analytics & BI
- Proyeksi cashflow 3-6 bulan
- Heatmap occupancy dari waktu ke waktu
- Prediksi churn penyewa (kemungkinan tidak perpanjang)

### 5.5 Marketing & Acquisition
- Microsite listing publik per properti (SEO-friendly)
- Virtual tour/360° foto unit
- Referral program otomatis

---

## 5. FASE 3 — Advanced (Scale / SaaS Multi-tenant)

Fitur untuk menjadikan TeridoxProperty produk SaaS yang dijual ke pemilik properti lain.

### 6.1 Multi-tenant Infrastructure
- Self-service onboarding untuk pemilik properti baru
- White-label/custom branding per klien
- Role granular (sub-admin per cabang, staff lapangan)
- API terbuka untuk integrasi pihak ketiga
- Audit log lengkap

### 6.2 Smart Access & IoT
- Integrasi smart lock (buka otomatis saat check-in, revoke saat kontrak habis)
- Integrasi sensor listrik/air per unit untuk billing utilitas otomatis
- Integrasi CCTV area umum

### 6.3 Compliance & Legal (Indonesia)
- Auto-generate laporan untuk PPh sewa
- Template kontrak sesuai hukum sewa-menyewa Indonesia
- Integrasi lapor domisili (opsional, untuk kos)

### 6.4 Marketplace Sync
- Sinkronisasi listing ke platform eksternal (Mamikos, OLX, dll)
- Multi-currency (untuk penyewa ekspat/turis)

---

## 6. Non-Functional Requirements

- Responsive (mobile-first untuk portal penyewa)
- Data penyewa (KTP/KK) disimpan terenkripsi
- Backup database berkala
- Uptime target 99% untuk versi produksi
- Skalabilitas: struktur database sudah mempertimbangkan multi-tenant sejak awal meski fitur SaaS baru di Fase 3

## 7. Metrik Keberhasilan (Overall)

| Metrik | Target Awal |
|---|---|
| Waktu input tagihan bulanan | Berkurang signifikan dari proses manual |
| Keterlambatan pembayaran | Menurun dengan reminder otomatis |
| Occupancy rate | Termonitor real-time |
| Adopsi (jika jadi SaaS) | Jumlah properti/klien terdaftar per kuartal |

## 8. Open Questions

- Apakah MVP langsung butuh payment gateway atau cukup upload bukti bayar manual dulu?
- Berapa jumlah properti/unit yang jadi target awal (untuk internal Teridox atau langsung multi-klien)?
- Prioritas mobile app (Flutter) masuk di fase mana — MVP atau setelah web stabil?