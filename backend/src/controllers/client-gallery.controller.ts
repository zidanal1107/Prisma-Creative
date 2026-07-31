import { Request, Response } from 'express';
import { ClientGalleryService } from '../services/client-gallery.service';

export class ClientGalleryController {
    private galleryService: ClientGalleryService;

    constructor() {
        this.galleryService = new ClientGalleryService();
    }

    // 1. POST /api/client-galleries (Admin)
    public createGallery = async (req: Request, res: Response) => {
        try {
            const { client_name, project_name, expired_at } = req.body;
            const newGallery = await this.galleryService.createGallery({
                client_name,
                project_name,
                expired_at,
            });

            return res.status(201).json({
                status: 'success',
                message: 'Proyek galeri klien berhasil dibuat.',
                data: newGallery,
            });
        } catch (error: any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    };

    // 2. POST /api/client-galleries/verify (Public / Client)
    public verifyAccessCode = async (req: Request, res: Response) => {
        try {
            const { access_code } = req.body;
            const gallery = await this.galleryService.verifyAccessCode(access_code);

            return res.status(200).json({
                status: 'success',
                message: 'Kode akses valid.',
                data: gallery,
            });
        } catch (error: any) {
            return res.status(401).json({ status: 'error', message: error.message });
        }
    };

    // 3. POST /api/client-galleries/:id/media (Admin Bulk Upload)
    public uploadBulkMedia = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ status: 'error', message: 'ID galeri tidak valid.' });
            }

            // Cek apakah req.files ada
            if (!req.files) {
                return res.status(400).json({ status: 'error', message: 'Tidak ada file yang diunggah.' });
            }

            const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };
            const files = filesMap?.['client_gallery'] || [];

            if (files.length === 0) {
                return res.status(400).json({ status: 'error', message: 'File dengan fieldname client_gallery tidak ditemukan.' });
            }

            const updatedGallery = await this.galleryService.addBulkMediaToGallery(Number(id), files);

            return res.status(200).json({
                status: 'success',
                message: 'Media draf berhasil diunggah secara massal ke galeri.',
                data: updatedGallery,
            });
        } catch (error: any) {
            console.error('Error Bulk Upload:', error); // <-- Cetak detail error ke terminal
            return res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
        }
    };

    // 4. PATCH /api/client-galleries/media/:mediaId/select (Client)
    public toggleMediaSelect = async (req: Request, res: Response) => {
        try {
            const { mediaId } = req.params;
            const { notes } = req.body;

            if (!mediaId || isNaN(Number(mediaId))) {
                return res.status(400).json({ status: 'error', message: 'ID Media tidak valid.' });
            }

            const result = await this.galleryService.toggleMediaSelection(Number(mediaId), notes);

            return res.status(200).json({
                status: 'success',
                message: result.is_selected ? 'Foto/video berhasil ditandai.' : 'Tanda foto/video dibatalkan.',
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    };

    // 5. DELETE /api/client-galleries/:id (Admin)
    public deleteGallery = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ status: 'error', message: 'ID galeri tidak valid.' });
            }

            await this.galleryService.deleteGallery(Number(id));

            return res.status(200).json({
                status: 'success',
                message: 'Galeri proyek beserta seluruh media fisiknya berhasil dihapus.',
            });
        } catch (error: any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    };
}