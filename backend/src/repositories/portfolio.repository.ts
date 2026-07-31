import { db } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {
    IPortfolio,
    ICreatePortfolioDTO,
    IUpdatePortfolioDTO,
    IPortfolioFilter
} from '../interfaces/portfolio.interface';

export class PortfolioRepository {
    private parsePortfolioRow(row: RowDataPacket): IPortfolio {
        return {
            ...row,
            is_featured: Boolean(row.is_featured),
            title: typeof row.title === 'string' ? JSON.parse(row.title) : row.title,
            description: row.description
                ? (typeof row.description === 'string' ? JSON.parse(row.description) : row.description)
                : null,
            category_name: row.category_name
                ? (typeof row.category_name === 'string' ? JSON.parse(row.category_name) : row.category_name)
                : undefined
        } as IPortfolio;
    }

    async findAll(filter: IPortfolioFilter): Promise<{ data: IPortfolio[]; total: number }> {
        const whereClauses: string[] = [];
        const queryParams: any[] = [];

        if (filter.category_id) {
            whereClauses.push('p.category_id = ?');
            queryParams.push(filter.category_id);
        }

        if (filter.user_id) {
            whereClauses.push('p.user_id = ?');
            queryParams.push(filter.user_id);
        }

        if (filter.type) {
            whereClauses.push('p.type = ?');
            queryParams.push(filter.type);
        }

        if (filter.is_featured !== undefined) {
            whereClauses.push('p.is_featured = ?');
            queryParams.push(filter.is_featured ? 1 : 0);
        }

        if (filter.search) {
            whereClauses.push('(LOWER(p.title) LIKE ? OR LOWER(p.slug) LIKE ? OR LOWER(p.client_name) LIKE ?)');
            const searchPattern = `%${filter.search.toLowerCase()}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern);
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const countQuery = `SELECT COUNT(*) as total FROM portfolios p ${whereSql}`;
        const [countRows] = await db.query<RowDataPacket[]>(countQuery, queryParams);
        const total = countRows[0]?.total || 0;

        const limit = filter.limit || 10;
        const page = filter.page || 1;
        const offset = (page - 1) * limit;

        const dataQuery = `
            SELECT 
                p.id, p.user_id, p.category_id, p.slug, p.type, p.title, p.description, 
                p.thumbnail_url, p.video_url, p.before_image_url, p.after_image_url, 
                p.client_name, p.is_featured, p.created_at,
                c.name as category_name
            FROM portfolios p
            LEFT JOIN categories c ON p.category_id = c.id
            ${whereSql}
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [rows] = await db.query<RowDataPacket[]>(dataQuery, [...queryParams, limit, offset]);
        const data = rows.map((row: RowDataPacket) => this.parsePortfolioRow(row));

        return { data, total };
    }

    async findById(id: number): Promise<IPortfolio | null> {
        const query = `
            SELECT 
                p.id, p.user_id, p.category_id, p.slug, p.type, p.title, p.description, 
                p.thumbnail_url, p.video_url, p.before_image_url, p.after_image_url, 
                p.client_name, p.is_featured, p.created_at,
                c.name as category_name
            FROM portfolios p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [id]);
        if (rows.length === 0) return null;

        return this.parsePortfolioRow(rows[0]);
    }

    public async findBySlug(slug: string): Promise<IPortfolio | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM portfolios WHERE slug = ?',
            [slug] // Parameter ditukar ke tempat '?' sebagai string aman
        );

        if (rows.length === 0) return null;

        const portfolio = rows[0];
        return {
            ...portfolio,
            title: typeof portfolio.title === 'string' ? JSON.parse(portfolio.title) : portfolio.title,
            description: portfolio.description
                ? typeof portfolio.description === 'string'
                    ? JSON.parse(portfolio.description)
                    : portfolio.description
                : null,
        } as IPortfolio;
    }

    async create(data: ICreatePortfolioDTO & { slug: string }): Promise<IPortfolio> {
        const query = `
            INSERT INTO portfolios (
                user_id, category_id, slug, type, title, description, 
                thumbnail_url, video_url, before_image_url, after_image_url, 
                client_name, is_featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.user_id || null,
            data.category_id || null,
            data.slug,
            data.type,
            JSON.stringify(data.title),
            data.description ? JSON.stringify(data.description) : null,
            data.thumbnail_url,
            data.video_url || null,
            data.before_image_url || null,
            data.after_image_url || null,
            data.client_name || null,
            data.is_featured ? 1 : 0
        ];

        const [result] = await db.query<ResultSetHeader>(query, values);
        const newPortfolio = await this.findById(result.insertId);
        return newPortfolio!;
    }

    async update(id: number, data: Partial<IUpdatePortfolioDTO> & { slug?: string }): Promise<IPortfolio | null> {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.user_id !== undefined) {
            fields.push('user_id = ?');
            values.push(data.user_id);
        }
        if (data.category_id !== undefined) {
            fields.push('category_id = ?');
            values.push(data.category_id);
        }
        if (data.slug !== undefined) {
            fields.push('slug = ?');
            values.push(data.slug);
        }
        if (data.type !== undefined) {
            fields.push('type = ?');
            values.push(data.type);
        }
        if (data.title !== undefined) {
            fields.push('title = ?');
            values.push(JSON.stringify(data.title));
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description ? JSON.stringify(data.description) : null);
        }
        if (data.thumbnail_url !== undefined) {
            fields.push('thumbnail_url = ?');
            values.push(data.thumbnail_url);
        }
        if (data.video_url !== undefined) {
            fields.push('video_url = ?');
            values.push(data.video_url);
        }
        if (data.before_image_url !== undefined) {
            fields.push('before_image_url = ?');
            values.push(data.before_image_url);
        }
        if (data.after_image_url !== undefined) {
            fields.push('after_image_url = ?');
            values.push(data.after_image_url);
        }
        if (data.client_name !== undefined) {
            fields.push('client_name = ?');
            values.push(data.client_name);
        }
        if (data.is_featured !== undefined) {
            fields.push('is_featured = ?');
            values.push(data.is_featured ? 1 : 0);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        const query = `UPDATE portfolios SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await db.query(query, values);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM portfolios WHERE id = ?`;
        const [result] = await db.query<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    }
}