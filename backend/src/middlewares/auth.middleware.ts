import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJwtPayload, UserRole } from '../interfaces/user.interface';

// Extend Express Request interface agar properti req.user bertipe Type-Safe
export interface AuthenticatedRequest extends Request {
    user?: IJwtPayload;
}

// 1. Middleware Verifikasi JWT Token
export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    // Format Header: "Bearer <TOKEN>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Akses ditolak! Token autentikasi tidak ditemukan.',
        });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({
            status: 'error',
            message: 'Konfigurasi JWT_SECRET belum diatur di server!',
        });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret) as IJwtPayload;
        req.user = decoded; // Menyimpan data user dari payload token ke req.user
        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Token tidak valid atau sudah kadaluarsa!',
        });
    }
};

// 2. Middleware Otorisasi Berdasarkan Role (misal: 'admin', 'editor', dll.)
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Pengguna tidak terautentikasi.',
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Akses dilarang! Peran (${req.user.role}) tidak memiliki izin untuk tindakan ini.`,
            });
        }
        next();
    };
};