import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Helper function: Membuat folder otomatis jika belum ada
const ensureDirExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Helper function: Menentukan sub-folder berdasarkan fieldname atau req.body
const getSubFolder = (req: Request, fieldname: string): string => {
    // 1. Jika dikirim dari field 'avatar'
    if (fieldname === 'avatar') {
        return 'avatars';
    }
    // 2. Jika dikirim dari field 'client_gallery'
    if (fieldname === 'client_gallery') {
        return 'client-galleries';
    }
    // 3. Jika ada req.body.category_folder khusus dari frontend
    if (req.body && req.body.category_folder) {
        return req.body.category_folder;
    }
    // 4. Default fallback untuk portfolio / media
    return 'portfolios';
};

// Gunakan memoryStorage agar file diolah di RAM dulu sebelum dikompresi
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Maximum limit 100MB (untuk video)
    },
    fileFilter: (req, file, cb) => {
        // Memastikan hanya file Gambar dan Video yang diizinkan
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Format file tidak didukung! Hanya diperbolehkan Gambar (JPG, PNG, WebP) atau Video (MP4, MOV).'));
        }
    },
});

export const processMedia = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    // Otomatis tentukan sub-folder berdasarkan fieldname input file
    const subFolder = getSubFolder(req, req.file.fieldname);

    // PROSES FILE GAMBAR
    if (req.file.mimetype.startsWith('image/')) {
        try {
            const folderPath = path.join(__dirname, '../../uploads/images', subFolder);
            ensureDirExists(folderPath);

            const filename = `${req.file.fieldname}-${uniqueSuffix}.webp`;
            const outputPath = path.join(folderPath, filename);

            // Resizing khusus jika yang di-upload adalah avatar (misal: 500x500 square)
            const sharpPipeline = sharp(req.file.buffer);

            if (req.file.fieldname === 'avatar') {
                sharpPipeline.resize(500, 500, { fit: 'cover' }); // Crop persegi khusus foto profil
            } else {
                sharpPipeline.resize(1920, null, { withoutEnlargement: true }); // Lebar max 1920px untuk portfolio
            }

            // Compress & Convert ke WebP
            await sharpPipeline
                .webp({ quality: 80 })
                .toFile(outputPath);

            req.file.filename = filename;
            // Relative Path yang siap disimpan ke kolom DB MySQL
            req.file.path = `images/${subFolder}/${filename}`;
            return next();
        } catch (error) {
            return next(error);
        }
    }

    // PROSES FILE VIDEO
    if (req.file.mimetype.startsWith('video/')) {
        try {
            const folderPath = path.join(__dirname, '../../uploads/videos', subFolder);
            ensureDirExists(folderPath);

            const ext = path.extname(req.file.originalname);
            const filename = `${req.file.fieldname}-${uniqueSuffix}${ext}`;
            const outputPath = path.join(folderPath, filename);

            // Simpan langsung file video tanpa Sharp
            await fs.promises.writeFile(outputPath, req.file.buffer);

            req.file.filename = filename;
            // Relative Path yang siap disimpan ke kolom DB MySQL
            req.file.path = `videos/${subFolder}/${filename}`;
            return next();
        } catch (error) {
            return next(error);
        }
    }

    next();
};