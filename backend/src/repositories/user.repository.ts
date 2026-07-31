import { db } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { IUser, ICreateUserDTO, IUpdateUserDTO } from '../interfaces/user.interface';

export class UserRepository {
    // 1. Cari user berdasarkan Email (digunakan saat Login / Cek Duplikasi)
    async findByEmail(email: string): Promise<IUser | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        if (rows.length === 0) return null;
        const user = rows[0] as IUser;
        // Parse bio jika tersimpan sebagai JSON string
        if (user.bio && typeof user.bio === 'string') {
            try {
                user.bio = JSON.parse(user.bio);
            } catch {
                // Biarkan tetap string jika gagal parse
            }
        }
        return user;
    }

    // 2. Cari user berdasarkan ID (digunakan untuk Get Profile & Auth Middleware)
    async findById(id: number): Promise<IUser | null> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT id, name, email, role, bio, avatar_url, instagram_url, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;
        const user = rows[0] as IUser;
        if (user.bio && typeof user.bio === 'string') {
            try {
                user.bio = JSON.parse(user.bio);
            } catch {
                // Biarkan tetap string jika gagal parse
            }
        }
        return user;
    }

    // 3. Ambil Semua User / Team (Untuk halaman Tim / Public)
    async findAll(): Promise<IUser[]> {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT id, name, email, role, bio, avatar_url, instagram_url, created_at FROM users ORDER BY created_at DESC'
        );
        return rows.map((row) => {
            const user = row as IUser;
            if (user.bio && typeof user.bio === 'string') {
                try {
                    user.bio = JSON.parse(user.bio);
                } catch {
                    // Ignore parse error
                }
            }
            return user;
        });
    }

    // 4. Tambah User Baru (Register / Add Talent)
    async create(userData: ICreateUserDTO, passwordHash: string): Promise<number> {
        const { name, email, role, bio, instagram_url } = userData;
        // Bio disimpan dalam format stringified JSON
        const bioJson = bio ? JSON.stringify(bio) : null;
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO users (name, email, password_hash, role, bio, instagram_url) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, passwordHash, role, bioJson, instagram_url || null]
        );
        return result.insertId;
    }

    // 5. Update Profile / Bio User
    async update(id: number, userData: IUpdateUserDTO): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];
        if (userData.name !== undefined) {
            fields.push('name = ?');
            values.push(userData.name);
        }
        if (userData.role !== undefined) {
            fields.push('role = ?');
            values.push(userData.role);
        }
        if (userData.instagram_url !== undefined) {
            fields.push('instagram_url = ?');
            values.push(userData.instagram_url);
        }
        if (userData.bio !== undefined) {
            fields.push('bio = ?');
            values.push(userData.bio ? JSON.stringify(userData.bio) : null);
        }
        if (fields.length === 0) return false;
        values.push(id);
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.query<ResultSetHeader>(sql, values);
        return result.affectedRows > 0;
    }

    // 6. Update Avatar URL
    async updateAvatar(id: number, avatarUrl: string): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE users SET avatar_url = ? WHERE id = ?',
            [avatarUrl, id]
        );
        return result.affectedRows > 0;
    }

    // 7. Hapus User
    async delete(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}