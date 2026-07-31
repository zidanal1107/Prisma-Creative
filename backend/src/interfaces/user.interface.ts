// Role yang tersedia di dalam sistem
export type UserRole = 'admin' | 'fotografer' | 'editor' | 'videografer';

// Struktur Bio Multi-Bahasa (Stored as JSON di Database)
export interface IMultiLangText {
    id?: string; // Bahasa Indonesia
    en?: string; // Bahasa Inggris
}

// Interface Entitas User Utama (Menyesuaikan tabel `users` di MySQL)
export interface IUser {
    id?: number;
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    bio?: IMultiLangText | string | null; // Bisa berupa objek JSON atau string saat diparse
    avatar_url?: string | null;
    instagram_url?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

// Interface Payload untuk JWT Token
export interface IJwtPayload {
    id: number;
    email: string;
    role: UserRole;
}

// Request DTO: Login User
export interface ILoginDTO {
    email: string;
    password: string;
}

// Request DTO: Create/Register User Baru
export interface ICreateUserDTO {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    bio?: IMultiLangText;
    instagram_url?: string;
}

// Request DTO: Update Profil User
export interface IUpdateUserDTO {
    name?: string;
    bio?: IMultiLangText;
    instagram_url?: string;
    role?: UserRole;
}