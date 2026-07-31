# 🗄️ Database Documentation - Portfolio Web

Dokumentasi resmi untuk skema database MySQL pada proyek **Portfolio Web (Photographer, Editor & Videographer)**. Database ini dirancang untuk mendukung fitur multi-bahasa (ID & EN) menggunakan format kolom JSON, portal _client proofing_, dan manajemen portofolio visual.

---

## 🛠️ Database Overview

- **DBMS:** MySQL (v8.0+)
- **Database Name:** `portfolio_db`
- **Character Set:** `utf8mb4`
- **Collation:** `utf8mb4_unicode_ci`

---

## 🗺️ Relasi Antar Tabel (Entity Relationship)

```text
[ users ] ────────┐ (1 to Many)
                  ▼
[ categories ] ───► [ portfolios ] ◄─── (1 to Many) ─── [ portfolio_images ]

[ client_galleries ] ◄─── (1 to Many) ─── [ client_gallery_media ]

[ inquiries ] (Tabel Mandiri / Form Kontak)
```

1. **`users` ➔ `portfolios`** _(1 to N)_: Satu user (admin/talent) bisa mengunggah banyak portofolio (`ON DELETE SET NULL`).
2. **`categories` ➔ `portfolios`** _(1 to N)_: Satu kategori menampung banyak karya (`ON DELETE SET NULL`).
3. **`portfolios` ➔ `portfolio_images`** _(1 to N)_: Satu karya foto bisa memiliki banyak gambar detail (`ON DELETE CASCADE`).
4. **`client_galleries` ➔ `client_gallery_media`** _(1 to N)_: Satu sesi proofing milik klien berisi banyak file draf foto/video (`ON DELETE CASCADE`).

---

## 💡 Cheat Sheet Query Utama (MySQL)

### 1. Select Portofolio dengan Fallback Bahasa (Default: EN ➔ Fallback: ID)

```sql
SELECT
    id,
    type,
    thumbnail_url,
    COALESCE(title->>'$.en', title->>'$.id') AS title,
    COALESCE(description->>'$.en', description->>'$.id') AS description
FROM portfolios;
```

### 2. Insert Data Portofolio Baru (Format JSON)

```sql
INSERT INTO portfolios (type, slug, thumbnail_url, title, description)
VALUES (
    'photography',
    'wedding-budi-ani',
    'https://domain.com/uploads/thumb1.jpg',
    '{"id": "Pernikahan Budi & Ani", "en": "Budi & Ani Wedding"}',
    '{"id": "Foto dokumentasi acara nikah.", "en": "Wedding documentation photos."}'
);
```

### 3. Update Teks Bahasa Inggris Saja tanpa Mengganggu Bahasa Indonesia

```sql
UPDATE portfolios
SET title = JSON_SET(title, '$.en', 'Updated English Title')
WHERE id = 1;
```
