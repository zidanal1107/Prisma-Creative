import { Request, Response } from 'express';

export const testUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file yang diunggah!' });
        }

        // Path relatif yang siap disimpan ke database MySQL
        const mediaUrl = req.file.path;

        return res.status(200).json({
            message: 'File berhasil diunggah & diproses!',
            data: {
                filename: req.file.filename,
                media_url: mediaUrl,
                full_url: `${req.protocol}://${req.get('host')}/uploads/${mediaUrl}`
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan saat upload file', error });
    }
};