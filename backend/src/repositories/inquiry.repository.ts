import { db } from '../config/db';
import { IInquiry, ICreateInquiryInput, IInquiryQueryFilters, InquiryStatus } from '../interfaces/inquiry.interface';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class InquiryRepository {
    // 1. Tambah Inquiry Baru (Public)
    public async create(data: ICreateInquiryInput): Promise<IInquiry> {
        const query = `
            INSERT INTO inquiries (
                client_name, email, whatsapp_number, service_type, project_date, budget_range, message
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.client_name,
            data.email,
            data.whatsapp_number,
            data.service_type,
            data.project_date || null,
            data.budget_range || null,
            data.message,
        ];

        const [result] = await db.query<ResultSetHeader>(query, values);

        return {
            id: result.insertId,
            ...data,
            status: 'new',
            created_at: new Date(),
        };
    }

    // 2. Ambil Semua Inquiry + Filter & Paginasi (Admin)
    public async findAll(filters: IInquiryQueryFilters): Promise<{ data: IInquiry[]; total: number }> {
        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 10;
        const offset = (page - 1) * limit;

        const whereClauses: string[] = [];
        const params: any[] = [];

        if (filters.status) {
            whereClauses.push('status = ?');
            params.push(filters.status);
        }

        if (filters.service_type) {
            whereClauses.push('service_type = ?');
            params.push(filters.service_type);
        }

        if (filters.search) {
            whereClauses.push('(client_name LIKE ? OR email LIKE ? OR whatsapp_number LIKE ?)');
            const searchKeyword = `%${filters.search}%`;
            params.push(searchKeyword, searchKeyword, searchKeyword);
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Hitung total data
        const [countRows] = await db.query<RowDataPacket[]>(
            `SELECT COUNT(*) as total FROM inquiries ${whereSql}`,
            params
        );
        const total = countRows[0].total;

        // Ambil data dengan Limit & Offset
        const query = `
            SELECT * FROM inquiries 
            ${whereSql} 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query<RowDataPacket[]>(query, [...params, limit, offset]);

        return {
            data: rows as IInquiry[],
            total,
        };
    }

    // 3. Cari Inquiry berdasarkan ID
    public async findById(id: number): Promise<IInquiry | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM inquiries WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;
        return rows[0] as IInquiry;
    }

    // 4. Update Status Inquiry (Admin)
    public async updateStatus(id: number, status: InquiryStatus): Promise<IInquiry> {
        await db.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
        return (await this.findById(id))!;
    }

    // 5. Hapus Inquiry (Admin)
    public async delete(id: number): Promise<void> {
        await db.query('DELETE FROM inquiries WHERE id = ?', [id]);
    }
}