import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // 1. Auth: Login User
    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email dan password wajib diisi!',
                });
            }
            const result = await this.userService.login({ email, password });
            return res.status(200).json({
                status: 'success',
                message: 'Login berhasil!',
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                status: 'error',
                message: error.message || 'Gagal melakukan login',
            });
        }
    };

    // 2. Auth: Ambil Profil User yang Sedang Login
    getMe = async (req: Request, res: Response): Promise<Response> => {
        try {
            // req.user diisi oleh auth.middleware.ts
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Pengguna tidak terautentikasi',
                });
            }
            const user = await this.userService.getUserById(userId);
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil data profil',
                data: user,
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message || 'User tidak ditemukan',
            });
        }
    };

    // 3. User: Tambah Talent / User Baru (Admin)
    createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { name, email, password, role, bio, instagram_url } = req.body;
            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Field name, email, password, dan role wajib diisi!',
                });
            }
            const newUser = await this.userService.createUser({
                name,
                email,
                password,
                role,
                bio,
                instagram_url,
            });
            return res.status(201).json({
                status: 'success',
                message: 'User baru berhasil dibuat!',
                data: newUser,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Gagal membuat user baru',
            });
        }
    };

    // 4. User: Ambil Semua User (Tim/Talent)
    getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil daftar user',
                data: users,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Gagal mengambil data user',
            });
        }
    };

    // 5. User: Ambil 1 User Berdasarkan ID
    getUserById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID user tidak valid',
                });
            }
            const user = await this.userService.getUserById(id);
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil detail user',
                data: user,
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message || 'User tidak ditemukan',
            });
        }
    };

    // 6. User: Update Profil
    updateUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID user tidak valid',
                });
            }
            const updatedUser = await this.userService.updateUser(id, req.body);
            return res.status(200).json({
                status: 'success',
                message: 'Profil user berhasil diperbarui',
                data: updatedUser,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Gagal memperbarui profil user',
            });
        }
    };

    // 7. User: Upload / Ganti Avatar Foto Profil
    updateAvatar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID user tidak valid',
                });
            }
            const filePath = req.file?.path;
            const result = await this.userService.updateAvatar(id, filePath);
            return res.status(200).json({
                status: 'success',
                message: 'Foto avatar berhasil diperbarui',
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Gagal memperbarui avatar',
            });
        }
    };

    // 8. User: Hapus User
    deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID user tidak valid',
                });
            }
            await this.userService.deleteUser(id);
            return res.status(200).json({
                status: 'success',
                message: 'User berhasil dihapus',
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Gagal menghapus user',
            });
        }
    };
}