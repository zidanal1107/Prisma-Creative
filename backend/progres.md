# 🚀 Backend Development Progress - Portfolio Web API

Dokumentasi ini digunakan untuk memantau status pengerjaan setiap modul CRUD dan infrastruktur di Backend (`sakuku-backend-bun`).

---

## 🏗️ 0. System Configuration & Infrastructure

- [x] Setup Project Engine (Bun + Express v5 + TypeScript)
- [x] Setup Environment Variables (`.env`)
- [x] Koneksi Database MySQL Pool (`src/config/db.ts`)
- [x] Config Express & Middleware Utama (`src/app.ts`)
- [x] Integrated File Upload System (`src/middlewares/upload.middleware.ts`)
  - [x] Kompresi Gambar Otomatis & Auto-Convert ke WebP (`sharp`)
  - [x] Penanganan File Video (MP4, MOV, WebM)
  - [x] Manajemen Sub-Folder Otomatis (`uploads/images/` & `uploads/videos/`)
  - [x] Static File Serving (`/uploads`)

---

## 🔐 1. User & Auth Module (`/api/auth` & `/api/users`)

Mengelola autentikasi JWT dan manajemen akun Admin, Fotografer, Editor, serta Videografer.

### **Files to Create:**

- [x] `src/interfaces/user.interface.ts`
- [x] `src/repositories/user.repository.ts`
- [x] `src/services/user.service.ts`
- [x] `src/controllers/user.controller.ts`
- [x] `src/routes/user.route.ts`
- [x] `src/middlewares/auth.middleware.ts` (JWT Verification & Role Check)

### **API Endpoints:**

- [ ] `POST /api/auth/login` — Login user & generate JWT Token
- [ ] `GET /api/auth/me` — Ambil data profil user yang sedang aktif
- [ ] `POST /api/users` — _(Admin)_ Tambah user/talent baru
- [ ] `GET /api/users` — Ambil daftar tim/talent untuk halaman About
- [ ] `PUT /api/users/:id` — Update data profil & bio (Multi-language)
- [ ] `PATCH /api/users/:id/avatar` — Upload/ganti foto profil avatar
- [ ] `DELETE /api/users/:id` — _(Admin)_ Hapus user

---

## 📂 2. Category Module (`/api/categories`)

Master data kategori untuk mengelompokkan portofolio (Wedding, Commercial, Portrait, Event, dll).

### **Files to Create:**

- [ ] `src/interfaces/category.interface.ts`
- [ ] `src/repositories/category.repository.ts`
- [ ] `src/services/category.service.ts`
- [ ] `src/controllers/category.controller.ts`
- [ ] `src/routes/category.route.ts`

### **API Endpoints:**

- [ ] `GET /api/categories` — Ambil semua daftar kategori
- [ ] `POST /api/categories` — _(Admin)_ Tambah kategori baru
- [ ] `PUT /api/categories/:id` — _(Admin)_ Edit nama kategori (Multi-language) & slug
- [ ] `DELETE /api/categories/:id` — _(Admin)_ Hapus kategori

---

## 🖼️ 3. Portfolio Module (`/api/portfolios`) — _Core Feature_

Manajemen karya foto, video showreel, dan fitur slider Before-After editing.

### **Files to Create:**

- [ ] `src/interfaces/portfolio.interface.ts`
- [ ] `src/repositories/portfolio.repository.ts`
- [ ] `src/services/portfolio.service.ts`
- [ ] `src/controllers/portfolio.controller.ts`
- [ ] `src/routes/portfolio.route.ts`

### **API Endpoints:**

- [ ] `GET /api/portfolios` — Ambil semua portofolio (Support filter `category`, `type`, `is_featured`)
- [ ] `GET /api/portfolios/:slug` — Detail 1 portofolio + galeri foto di dalamnya
- [ ] `POST /api/portfolios` — _(Authed)_ Create portofolio + Upload Media (Thumbnail / Video / Before-After)
- [ ] `PUT /api/portfolios/:id` — _(Authed)_ Update info portofolio & deskripsi multi-bahasa
- [ ] `DELETE /api/portfolios/:id` — _(Admin)_ Hapus portofolio beserta file fisik dari disk

---

## 📩 4. Inquiry Module (`/api/inquiries`)

Menerima formulir pemesanan (_booking_) atau pertanyaan dari calon klien di website.

### **Files to Create:**

- [ ] `src/interfaces/inquiry.interface.ts`
- [ ] `src/repositories/inquiry.repository.ts`
- [ ] `src/services/inquiry.service.ts`
- [ ] `src/controllers/inquiry.controller.ts`
- [ ] `src/routes/inquiry.route.ts`

### **API Endpoints:**

- [ ] `POST /api/inquiries` — _(Public)_ Klien mengirim form pesan/booking
- [ ] `GET /api/inquiries` — _(Admin)_ Melihat daftar semua pesanan/pesan masuk
- [ ] `PATCH /api/inquiries/:id/status` — _(Admin)_ Update status (`new` ➔ `contacted` ➔ `completed` ➔ `cancelled`)
- [ ] `DELETE /api/inquiries/:id` — _(Admin)_ Hapus data inquiry

---

## 🔒 5. Client Gallery / Proofing Module (`/api/client-galleries`)

Portal galeri privat untuk klien melihat dan memilih foto hasil _shoot_ menggunakan Kode Akses (_Access Code_).

### **Files to Create:**

- [ ] `src/interfaces/client-gallery.interface.ts`
- [ ] `src/repositories/client-gallery.repository.ts`
- [ ] `src/services/client-gallery.service.ts`
- [ ] `src/controllers/client-gallery.controller.ts`
- [ ] `src/routes/client-gallery.route.ts`

### **API Endpoints:**

- [ ] `POST /api/client-galleries` — _(Admin)_ Buat proyek galeri baru + generate Access Code
- [ ] `POST /api/client-galleries/verify` — _(Public)_ Verifikasi Access Code untuk membuka galeri klien
- [ ] `POST /api/client-galleries/:id/media` — _(Admin)_ Bulk upload foto/video draf ke galeri klien
- [ ] `PATCH /api/client-galleries/media/:mediaId/select` — _(Client)_ Klien memilih/menandai foto untuk di-edit
- [ ] `DELETE /api/client-galleries/:id` — _(Admin)_ Hapus galeri proyek yang sudah selesai

---

## 📊 Summary Progress Status

- [x] **Section 0:** 100% Completed
- [ ] **Section 1 (User & Auth):** 0%
- [ ] **Section 2 (Categories):** 0%
- [ ] **Section 3 (Portfolios):** 0%
- [ ] **Section 4 (Inquiries):** 0%
- [ ] **Section 5 (Client Galleries):** 0%
