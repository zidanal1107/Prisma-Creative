import { db } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { ICategory, ICreateCategoryDTO, IUpdateCategoryDTO } from '../interfaces/category.interface';

export class CategoryRepository {
    // 1. Ambil semua kategori (Diurutkan berdasarkan sort_order terkecil)
    async findAll(): Promise<ICategory[]> {
        const query = `
            SELECT id, slug, name, description, icon_url, sort_order, created_at, updated_at
            FROM categories
            ORDER BY sort_order ASC, created_at DESC
        `;
        const [rows] = await db.query<RowDataPacket[]>(query);
        // Menambahkan tipe : RowDataPacket pada parameter row
        return rows.map((row: RowDataPacket) => ({
            ...row,
            name: typeof row.name === 'string' ? JSON.parse(row.name) : row.name,
            description: row.description
                ? (typeof row.description === 'string' ? JSON.parse(row.description) : row.description)
                : null
        })) as ICategory[];
    }

    // 2. Cari kategori berdasarkan ID
    async findById(id: number): Promise<ICategory | null> {
        const query = `
            SELECT id, slug, name, description, icon_url, sort_order, created_at, updated_at
            FROM categories
            WHERE id = ?
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            ...row,
            name: typeof row.name === 'string' ? JSON.parse(row.name) : row.name,
            description: row.description
                ? (typeof row.description === 'string' ? JSON.parse(row.description) : row.description)
                : null
        } as ICategory;
    }

    // 3. Cari kategori berdasarkan Slug (Untuk cek duplikasi / URL SEO)
    async findBySlug(slug: string): Promise<ICategory | null> {
        const query = `
            SELECT id, slug, name, description, icon_url, sort_order, created_at, updated_at
            FROM categories
            WHERE slug = ?
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [slug]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            ...row,
            name: typeof row.name === 'string' ? JSON.parse(row.name) : row.name,
            description: row.description
                ? (typeof row.description === 'string' ? JSON.parse(row.description) : row.description)
                : null
        } as ICategory;
    }

    // 4. Tambah Kategori Baru
    async create(data: ICreateCategoryDTO & { slug: string }): Promise<ICategory> {
        const query = `
            INSERT INTO categories (slug, name, description, icon_url, sort_order)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            data.slug,
            JSON.stringify(data.name),
            data.description ? JSON.stringify(data.description) : null,
            data.icon_url || null,
            data.sort_order ?? 0
        ];
        const [result] = await db.query<ResultSetHeader>(query, values);
        const newCategory = await this.findById(result.insertId);
        return newCategory!;
    }

    // 5. Perbarui Data Kategori berdasarkan ID
    async update(id: number, data: Partial<IUpdateCategoryDTO> & { slug?: string }): Promise<ICategory | null> {
        const fields: string[] = [];
        const values: any[] = [];
        if (data.slug !== undefined) {
            fields.push('slug = ?');
            values.push(data.slug);
        }
        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(JSON.stringify(data.name));
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description ? JSON.stringify(data.description) : null);
        }
        if (data.icon_url !== undefined) {
            fields.push('icon_url = ?');
            values.push(data.icon_url);
        }
        if (data.sort_order !== undefined) {
            fields.push('sort_order = ?');
            values.push(data.sort_order);
        }
        if (fields.length === 0) {
            return this.findById(id);
        }
        const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);
        await db.query(query, values);
        return this.findById(id);
    }

    // 6. Hapus Kategori berdasarkan ID
    async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM categories WHERE id = ?`;
        const [result] = await db.query<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    }
}