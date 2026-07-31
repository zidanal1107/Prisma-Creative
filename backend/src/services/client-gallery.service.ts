import { ClientGalleryRepository } from '../repositories/client-gallery.repository';
import { IClientGallery, ICreateGalleryInput } from '../interfaces/client-gallery.interface';
import { deleteFile } from '../utils/file.util';

export class ClientGalleryService {
    private galleryRepository: ClientGalleryRepository;

    constructor() {
        this.galleryRepository = new ClientGalleryRepository();
    }

    // Helper untuk generate Kode Akses PIN unik 6 Karakter
    private generateAccessCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // 1. Admin: Buat Galeri Baru
    public async createGallery(input: ICreateGalleryInput): Promise<IClientGallery> {
        if (!input.client_name || !input.project_name) {
            throw new Error('Nama klien dan nama proyek wajib diisi.');
        }

        const access_code = this.generateAccessCode();
        return await this.galleryRepository.createGallery({ ...input, access_code });
    }

    // 2. Public / Client: Verifikasi Access Code
    public async verifyAccessCode(accessCode: string): Promise<IClientGallery> {
        if (!accessCode) {
            throw new Error('Kode Akses wajib diisi.');
        }

        const gallery = await this.galleryRepository.findByAccessCode(accessCode.toUpperCase());
        if (!gallery) {
            throw new Error('Kode Akses tidak valid.');
        }

        // Cek Expired Date jika ada
        if (gallery.expired_at) {
            const today = new Date();
            const expiredDate = new Date(gallery.expired_at);
            if (today > expiredDate) {
                throw new Error('Akses ke galeri ini sudah kadaluarsa.');
            }
        }

        return gallery;
    }

    // 3. Admin: Bulk Upload Media
    public async addBulkMediaToGallery(galleryId: number, files: Express.Multer.File[]): Promise<IClientGallery> {
        const gallery = await this.galleryRepository.findById(galleryId);
        if (!gallery) {
            throw new Error(`Galeri dengan ID ${galleryId} tidak ditemukan.`);
        }

        if (!files || files.length === 0) {
            throw new Error('Tidak ada file yang diunggah.');
        }

        const mediaItems = files.map((file) => ({
            client_gallery_id: galleryId,
            media_url: file.path,
            media_type: file.mimetype.startsWith('video/') ? ('video' as const) : ('image' as const),
        }));

        await this.galleryRepository.addBulkMedia(mediaItems);
        return (await this.galleryRepository.findById(galleryId))!;
    }

    // 4. Client: Toggle Select Foto + Catatan Revisi
    public async toggleMediaSelection(mediaId: number, notes?: string): Promise<{ media_id: number; is_selected: boolean; notes?: string }> {
        const media = await this.galleryRepository.findMediaById(mediaId);
        if (!media) {
            throw new Error(`Media dengan ID ${mediaId} tidak ditemukan.`);
        }

        const newSelectedStatus = !media.is_selected;

        await this.galleryRepository.updateMediaSelection(mediaId, newSelectedStatus, notes);

        return {
            media_id: mediaId,
            is_selected: newSelectedStatus,
            notes: notes || undefined,
        };
    }

    // 5. Admin: Hapus Galeri + Hapus File Fisik
    public async deleteGallery(id: number): Promise<void> {
        const gallery = await this.galleryRepository.findById(id);
        if (!gallery) {
            throw new Error(`Galeri dengan ID ${id} tidak ditemukan.`);
        }

        // Hapus semua file fisik media di server
        if (gallery.media && gallery.media.length > 0) {
            gallery.media.forEach((item) => {
                deleteFile(item.media_url);
            });
        }

        await this.galleryRepository.deleteGallery(id);
    }
}