# 🚀 Progress Pengembangan Website Creative Portfolio & Proofing Portal

Dokumen ini mencatat alur pengembangan, status pengerjaan modul backend/frontend, serta peta jalan (roadmap) fitur untuk platform portofolio dan portal proofing klien.

---

## 📌 Ringkasan Status Proyek

- **Status Backend (API Express + MySQL/MariaDB):** ✅ **Selesai (100%)**
- **Status Database Schemas:** ✅ **Selesai (100%)**
- **Status Frontend Integration:** ⏳ **Akan Dimulai (In Progress)**

---

## 🗄️ Backend API Checklist (`/api`)

### Modul 1: Authentication & User Management

- [x] `POST /api/auth/register` — Registrasi user / admin
- [x] `POST /api/auth/login` — Autentikasi & pengiriman JWT Token
- [x] `GET /api/auth/me` — Ambil data profil user terautentikasi
- [x] `PUT /api/auth/profile` — Update profil & avatar foto

### Modul 2: Portofolio (Fotografi & Videografi)

- [x] `GET /api/portfolios` — Ambil daftar portofolio (Filter Kategori/Search)
- [x] `POST /api/portfolios` — _(Admin)_ Buat portofolio baru + upload thumbnail/video
- [x] `PUT /api/portfolios/:id` — _(Admin)_ Update detail portofolio
- [x] `DELETE /api/portfolios/:id` — _(Admin)_ Hapus portofolio + pembersihan file media fisik

### Modul 3: Editing Services (Before-After & Color Grading)

- [x] `GET /api/editing-services` — List portofolio perbandingan edit
- [x] `POST /api/editing-services` — _(Admin)_ Upload foto Before-After & video preset
- [x] `DELETE /api/editing-services/:id` — _(Admin)_ Hapus sampel editing

### Modul 4: Booking & Inquiry

- [x] `POST /api/bookings` — _(Public)_ Form pemesanan layanan dari calon klien
- [x] `GET /api/bookings` — _(Admin)_ Dashboard list pesanan klien
- [x] `PATCH /api/bookings/:id/status` — _(Admin)_ Update status pesanan (Pending, Approved, Rejected)

### Modul 5: Client Gallery / Proofing Portal

- [x] `POST /api/client-galleries` — _(Admin)_ Buat proyek galeri baru + auto-generate Kode Akses
- [x] `POST /api/client-galleries/verify` — _(Public/Client)_ Verifikasi Kode Akses & kadaluarsa
- [x] `POST /api/client-galleries/:id/media` — _(Admin)_ Bulk upload foto/video draf (`upload.fields` -> Sharp WebP conversion)
- [x] `PATCH /api/client-galleries/media/:mediaId/select` — _(Client)_ Klien memilih/menandai foto & memberi catatan revisi
- [x] `DELETE /api/client-galleries/:id` — _(Admin)_ Hapus galeri proyek & hapus seluruh file fisik media (`ON DELETE CASCADE`)

---

## 💻 Frontend Roadmap & Task Flow

### TAHAP 1: Setup & Design System Base

- [ ] Setup Konfigurasi Tailwind CSS (Skema Dark Mode `#0F0F11`, Accent `#D4AF37`, Typo Sans/Serif)
- [ ] Buat Komponen Global Layout:
  - [ ] `Navbar.tsx` (Transparan on-scroll, Responsive Hamburger Menu)
  - [ ] `Footer.tsx` (Social Links, Quick CTA, Copyright)
  - [ ] `Layout.tsx` (Wrapper & Smooth Transition Container)

### TAHAP 2: Public Website Pages

- [ ] **Halaman Beranda (Landing Page):**
  - [ ] `HeroSection.tsx` — Showreel Video / Parallax Grid Background
  - [ ] `Tagline.tsx` — Typography Hero Text
  - [ ] `QuickPortfolio.tsx` — Highlight karya Fotografi, Editing, Videografi
- [ ] **Halaman Portofolio:**
  - [ ] `MasonryGrid.tsx` — Grid Foto/Video Interaktif + Fullscreen Lightbox
  - [ ] `BeforeAfterSlider.tsx` — Interactive Slider Geser Sebelum & Sesudah Edit
  - [ ] `VideoPlayerModal.tsx` — Custom Clean Video Modal
- [ ] **Halaman About & Team:**
  - [ ] Grid profil talent (Fotografer, Videografer, Editor) + Gear List
- [ ] **Halaman Booking / Contact:**
  - [ ] Form Pemesanan terintegrasi dengan API `POST /api/bookings`
  - [ ] Quick WhatsApp Direct Link

### TAHAP 3: Client Area / Proofing Portal

- [ ] `AccessCodeForm.tsx` — Modal / Halaman Login Kode Akses Unik Klien (`POST /api/client-galleries/verify`)
- [ ] `ProofingGallery.tsx` — Grid Tampilan Foto Draf Klien + Indikator Kuota Terpilih
- [ ] `MediaLightbox.tsx` — Preview Foto Layar Penuh + Tombol Centang Pilih Foto + Column Input Catatan Revisi
- [ ] `SelectionSummary.tsx` — Floating Bar / Panel Ringkasan Foto yang Dipilih Klien

### TAHAP 4: Admin Dashboard Portal (Management)

- [ ] Dashboard Statistik & Pengelolaan Booking
- [ ] Form Upload Bulk Media Galeri Klien (`POST /api/client-galleries/:id/media`)
- [ ] Fitur Manajemen Portofolio (CRUD Foto/Video Portofolio)

---

## 🛠️ Catatan Arsitektur Teknikal Backend

1. **Penyimpanan Media & Optimasi:**
   - Foto draf & portofolio dikompresi otomatis menggunakan **Sharp** ke format `.webp` (Width max 1920px, Quality 80%).
   - Struktur folder penyimpanan fisik terpisah:
     ```text
     uploads/
     ├── images/
     │   ├── avatars/
     │   ├── before-after/
     │   ├── portfolios/
     │   └── proofing/      <-- Folder khusus file draf galeri klien
     └── videos/
         ├── portfolios/
         └── proofing/
     ```

2. **Skema Database Relasional (MariaDB/MySQL):**
   - Ref: `client_galleries` (Parent) $\leftrightarrow$ `client_gallery_media` (Child with `ON DELETE CASCADE`).
