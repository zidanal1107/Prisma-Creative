CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- =============================================================================
-- 1. TABLE: users (Admin & Tim Talent)
-- =============================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'fotografer', 'editor', 'videografer') NOT NULL,
    bio JSON,                           -- Format JSON: {"id": "Bio Indo", "en": "English Bio"}
    avatar_url VARCHAR(255),
    instagram_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. TABLE: categories (Kategori Portofolio)
-- =============================================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,   -- e.g., 'wedding', 'commercial'
    name JSON NOT NULL                  -- Format JSON: {"id": "Pernikahan", "en": "Wedding"}
);

-- =============================================================================
-- 3. TABLE: portfolios (Karya Utama Foto, Video, & Editing)
-- =============================================================================
CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,                   -- Relasi ke tabel users
    category_id INT NULL,               -- Relasi ke tabel categories
    slug VARCHAR(150) NOT NULL UNIQUE,
    type ENUM('photography', 'videography', 'editing') NOT NULL,
    
    -- Multi-Language Text using JSON
    title JSON NOT NULL,                -- Format JSON: {"id": "Judul ID", "en": "Title EN"}
    description JSON,                   -- Format JSON: {"id": "Deskripsi ID", "en": "Description EN"}
    
    -- Assets & Links
    thumbnail_url VARCHAR(255) NOT NULL,
    video_url VARCHAR(255),             -- URL YouTube/Vimeo (Khusus Videografi)
    before_image_url VARCHAR(255),      -- Untuk Editor (Slider Before)
    after_image_url VARCHAR(255),       -- Untuk Editor (Slider After)
    
    client_name VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,  -- Tampil di Landing Page / Hero?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Definitions
    CONSTRAINT fk_portfolio_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_portfolio_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =============================================================================
-- 4. TABLE: portfolio_images (Galeri Banyak Foto per Project)
-- =============================================================================
CREATE TABLE portfolio_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT NOT NULL,          -- Relasi ke tabel portfolios
    image_url VARCHAR(255) NOT NULL,
    caption JSON,                       -- Format JSON: {"id": "Keterangan", "en": "Caption"}
    display_order INT DEFAULT 0,
    
    -- Foreign Key Definition
    CONSTRAINT fk_images_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- =============================================================================
-- 5. TABLE: inquiries (Form Kontak & Booking Klien)
-- =============================================================================
CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    service_type ENUM('photography', 'videography', 'editing', 'all_in') NOT NULL,
    project_date DATE,
    budget_range VARCHAR(50),
    message TEXT NOT NULL,
    status ENUM('new', 'contacted', 'completed', 'cancelled') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 6. TABLE: client_galleries (Proofing Portal Induk)
-- =============================================================================
CREATE TABLE client_galleries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    access_code VARCHAR(50) NOT NULL UNIQUE, -- PIN/Password Unik Akses Klien
    expired_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 7. TABLE: client_gallery_media (File Media Draf untuk Klien Pilih/Proofing)
-- =============================================================================
CREATE TABLE client_gallery_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_gallery_id INT NOT NULL,     -- Relasi ke tabel client_galleries
    media_url VARCHAR(255) NOT NULL,
    media_type ENUM('image', 'video') DEFAULT 'image',
    is_selected BOOLEAN DEFAULT FALSE,  -- Status centang pilihan klien
    notes TEXT,                         -- Catatan/Revisi dari klien
    
    -- Foreign Key Definition
    CONSTRAINT fk_media_client_gallery FOREIGN KEY (client_gallery_id) REFERENCES client_galleries(id) ON DELETE CASCADE
);