import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Helper: Membuat folder otomatis jika belum ada
const ensureDirExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Helper: Menentukan sub-folder berdasarkan fieldname atau req.body
const getSubFolder = (req: Request, fieldname: string): string => {
    // 1. Avatar Foto Profil User
    if (fieldname === 'avatar') {
        return 'avatars';
    }

    // 2. Proofing / Client Gallery
    if (fieldname === 'client_gallery' || fieldname === 'proofing') {
        return 'proofing';
    }

    // 3. Khusus Foto Sebelum & Sesudah Edit (Editing Services)
    if (fieldname === 'before_image' || fieldname === 'after_image') {
        return 'before-after';
    }

    // 4. Custom folder dari frontend jika ada
    if (req.body && req.body.category_folder) {
        return req.body.category_folder;
    }

    // 5. Default fallback untuk thumbnail portofolio & video
    return 'portfolios';
};

// Memory storage agar file diolah di RAM sebelum disimpan via Sharp / FS
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Maximum limit 100MB (untuk video)
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Format file tidak didukung! Hanya diperbolehkan Gambar (JPG, PNG, WebP) atau Video (MP4, MOV).'));
        }
    },
});

// Helper privat untuk memproses 1 buah file
const processSingleFile = async (req: Request, file: Express.Multer.File): Promise<void> => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const subFolder = getSubFolder(req, file.fieldname);

    // 1. PROSES GAMBAR (Sharp -> WebP)
    if (file.mimetype.startsWith('image/')) {
        const folderPath = path.join(__dirname, '../../uploads/images', subFolder);
        ensureDirExists(folderPath);

        const filename = `${file.fieldname}-${uniqueSuffix}.webp`;
        const outputPath = path.join(folderPath, filename);

        const sharpPipeline = sharp(file.buffer);

        if (file.fieldname === 'avatar') {
            sharpPipeline.resize(500, 500, { fit: 'cover' });
        } else {
            sharpPipeline.resize(1920, null, { withoutEnlargement: true });
        }

        await sharpPipeline.webp({ quality: 80 }).toFile(outputPath);

        file.filename = filename;
        file.path = `uploads/images/${subFolder}/${filename}`;
    }

    // 2. PROSES VIDEO (Direct Write)
    if (file.mimetype.startsWith('video/')) {
        const folderPath = path.join(__dirname, '../../uploads/videos', subFolder);
        ensureDirExists(folderPath);

        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        const outputPath = path.join(folderPath, filename);

        await fs.promises.writeFile(outputPath, file.buffer);

        file.filename = filename;
        file.path = `uploads/videos/${subFolder}/${filename}`;
    }
};

// Middleware Async Handler: Bisa untuk Single File (req.file) dan Multiple Fields (req.files)
export const processMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Jika upload single file (upload.single)
        if (req.file) {
            await processSingleFile(req, req.file);
        }

        // Jika upload multiple fields (upload.fields)
        if (req.files) {
            const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };

            for (const fieldname in filesMap) {
                const filesArray = filesMap[fieldname];
                for (const file of filesArray) {
                    await processSingleFile(req, file);
                }
            }
        }

        return next();
    } catch (error) {
        return next(error);
    }
};