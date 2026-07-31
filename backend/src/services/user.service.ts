import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import {
    IUser,
    ILoginDTO,
    ICreateUserDTO,
    IUpdateUserDTO,
    IJwtPayload,
} from '../interfaces/user.interface';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    // 1. Logika Business Login (Authenticate & Generate JWT)
    async login(loginData: ILoginDTO): Promise<{ token: string; user: Partial<IUser> }> {
        const { email, password } = loginData;
        // Cek apakah user ada berdasarkan email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Email atau password salah');
        }
        // Verifikasi password hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Email atau password salah');
        }
        // Buat JWT Token
        const jwtSecret = process.env.JWT_SECRET;
        // Lempar error secara eksplisit jika JWT_SECRET belum diatur di file .env
        if (!jwtSecret) {
            throw new Error('JWT_SECRET belum dikonfigurasi di file .env!');
        }
        const payload: IJwtPayload = {
            id: user.id!,
            email: user.email,
            role: user.role,
        };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        const { password_hash, ...userWithoutPassword } = user;

        return {
            token,
            user: userWithoutPassword,
        };
    }

    // 2. Register / Tambah User Baru
    async createUser(userData: ICreateUserDTO): Promise<Partial<IUser>> {
        // Cek apakah email sudah terdaftar
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email sudah terdaftar!');
        }
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(userData.password, saltRounds);
        // Simpan ke DB via Repository
        const newUserId = await this.userRepository.create(userData, passwordHash);
        // Ambil data user yang baru dibuat
        const newUser = await this.userRepository.findById(newUserId);
        if (!newUser) {
            throw new Error('Gagal membuat user baru');
        }
        const { password_hash, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    // 3. Ambil Detail User Berdasarkan ID
    async getUserById(id: number): Promise<Partial<IUser>> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User tidak ditemukan');
        }
        return user;
    }

    // 4. Ambil Semua User (Daftar Tim / Talent)
    async getAllUsers(): Promise<IUser[]> {
        return await this.userRepository.findAll();
    }

    // 5. Update Profil / Bio User
    async updateUser(id: number, updateData: IUpdateUserDTO): Promise<Partial<IUser>> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User tidak ditemukan');
        }
        const isUpdated = await this.userRepository.update(id, updateData);
        if (!isUpdated) {
            throw new Error('Tidak ada data yang diperbarui');
        }
        const updatedUser = await this.userRepository.findById(id);
        return updatedUser!;
    }

    // 6. Update Avatar Foto Profil
    async updateAvatar(id: number, filePath?: string): Promise<{ avatar_url: string }> {
        if (!filePath) {
            throw new Error('File avatar wajib diunggah!');
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User tidak ditemukan');
        }
        await this.userRepository.updateAvatar(id, filePath);
        return { avatar_url: filePath };
    }

    // 7. Hapus User
    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User tidak ditemukan');
        }
        await this.userRepository.delete(id);
    }
}