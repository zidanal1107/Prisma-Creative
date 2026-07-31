## 💻 Frontend Roadmap & Task Flow

### TAHAP 1: Setup & Design System Base

- [x] Setup Konfigurasi Tailwind CSS (Skema Dark Mode `#0F0F11`, Accent `#D4AF37`, Typo Sans/Serif)
- [x] Buat Komponen Global Layout:
  - [x] `Navbar.tsx` (Transparan on-scroll, Responsive Hamburger Menu)
  - [x] `Footer.tsx` (Social Links, Quick CTA, Copyright)
  - [x] `Layout.tsx` (Wrapper & Smooth Transition Container)

### TAHAP 2: Public Website Pages

- [x] **Halaman Beranda (Landing Page):**
  - [x] `HeroSection.tsx` — Showreel Video / Parallax Grid Background
  - [x] `Tagline.tsx` — Typography Hero Text
  - [x] `QuickPortfolio.tsx` — Highlight karya Fotografi, Editing, Videografi
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

- [x] Service API `clientGallery.service.ts` (`verifyAccessCode`, `toggleSelectMedia`)
- [x] `AccessCodeForm.tsx` — Modal / Halaman Login Kode Akses Unik Klien (`POST /api/client-galleries/verify`)
- [ ] `ProofingGallery.tsx` — Grid Tampilan Foto Draf Klien + Indikator Kuota Terpilih
- [ ] `MediaLightbox.tsx` — Preview Foto Layar Penuh + Tombol Centang Pilih Foto + Column Input Catatan Revisi
- [ ] `SelectionSummary.tsx` — Floating Bar / Panel Ringkasan Foto yang Dipilih Klien

### TAHAP 4: Admin Dashboard Portal (Management)

- [ ] Dashboard Statistik & Pengelolaan Booking
- [ ] Form Upload Bulk Media Galeri Klien (`POST /api/client-galleries/:id/media`)
- [ ] Fitur Manajemen Portofolio (CRUD Foto/Video Portofolio)

---
