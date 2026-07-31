import fs from 'fs';
import path from 'path';

/**
 * Memotong URL/Path publik dan menghapus file fisik dari folder uploads
 * @param relativePath Contoh: "uploads/images/portfolios/thumbnail-123.webp"
 */
export const deleteFile = (relativePath?: string | null): void => {
    if (!relativePath) return;

    try {
        // Arahkan ke root folder project
        const absolutePath = path.join(process.cwd(), relativePath);

        // Cek apakah file benar-benar ada di server, lalu hapus
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log(`[FILE DELETED]: ${relativePath}`);
        }
    } catch (error) {
        console.error(`[FILE DELETE ERROR]: Gagal menghapus file ${relativePath}`, error);
    }
};