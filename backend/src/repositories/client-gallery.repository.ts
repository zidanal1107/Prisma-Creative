import { db } from '../config/db';
import { IClientGallery, IClientGalleryMedia, ICreateGalleryInput } from '../interfaces/client-gallery.interface';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class ClientGalleryRepository {
    // 1. Buat Galeri Baru
    public async createGallery(data: ICreateGalleryInput & { access_code: string }): Promise<IClientGallery> {
        const query = `
            INSERT INTO client_galleries (client_name, project_name, access_code, expired_at)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            data.client_name,
            data.project_name,
            data.access_code,
            data.expired_at || null,
        ];

        const [result] = await db.query<ResultSetHeader>(query, values);
        return {
            id: result.insertId,
            ...data,
            created_at: new Date(),
        };
    }

    // 2. Cari Galeri berdasarkan Access Code (Beserta Media)
    public async findByAccessCode(accessCode: string): Promise<IClientGallery | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM client_galleries WHERE access_code = ?',
            [accessCode]
        );
        if (rows.length === 0) return null;

        const gallery = rows[0] as IClientGallery;

        // Ambil media milik galeri ini
        const [mediaRows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM client_gallery_media WHERE client_gallery_id = ? ORDER BY id ASC',
            [gallery.id]
        );

        gallery.media = mediaRows as IClientGalleryMedia[];
        return gallery;
    }

    // 3. Cari Galeri berdasarkan ID
    public async findById(id: number): Promise<IClientGallery | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM client_galleries WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;

        const gallery = rows[0] as IClientGallery;
        const [mediaRows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM client_gallery_media WHERE client_gallery_id = ? ORDER BY id ASC',
            [gallery.id]
        );
        gallery.media = mediaRows as IClientGalleryMedia[];
        return gallery;
    }

    // 4. Bulk Insert Media Draf
    public async addBulkMedia(mediaItems: { client_gallery_id: number; media_url: string; media_type: string }[]): Promise<void> {
        if (mediaItems.length === 0) return;

        // Buat placeholder (?, ?, ?), (?, ?, ?), dst.
        const placeholders = mediaItems.map(() => '(?, ?, ?)').join(', ');
        const query = `INSERT INTO client_gallery_media (client_gallery_id, media_url, media_type) VALUES ${placeholders}`;

        // Flatten array parameter
        const values = mediaItems.flatMap((item) => [item.client_gallery_id, item.media_url, item.media_type]);

        await db.query(query, values);
    }

    // 5. Cari Media berdasarkan Media ID
    public async findMediaById(mediaId: number): Promise<IClientGalleryMedia | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM client_gallery_media WHERE id = ?',
            [mediaId]
        );
        if (rows.length === 0) return null;
        return rows[0] as IClientGalleryMedia;
    }

    // 6. Toggle Selection & Notes Foto/Video
    public async updateMediaSelection(mediaId: number, isSelected: boolean, notes?: string): Promise<void> {
        await db.query(
            'UPDATE client_gallery_media SET is_selected = ?, notes = ? WHERE id = ?',
            [isSelected, notes || null, mediaId]
        );
    }

    // 7. Hapus Galeri (Otomatis CASCADE hapus media di DB)
    public async deleteGallery(id: number): Promise<void> {
        await db.query('DELETE FROM client_galleries WHERE id = ?', [id]);
    }
}