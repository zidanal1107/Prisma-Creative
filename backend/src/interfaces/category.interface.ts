// Interface untuk mendukung field multi-bahasa (ID & EN)
export interface IMultilingualText {
    id: string; // Bahasa Indonesia
    en: string; // Bahasa Inggris
}

// Interface utama untuk Entity Category di MySQL
export interface ICategory {
    id: number;
    slug: string;
    name: IMultilingualText; // Disimpan sebagai JSON di DB
    description?: IMultilingualText | null; // Disimpan sebagai JSON di DB (opsional)
    icon_url?: string | null;
    sort_order: number;
    created_at?: Date;
    updated_at?: Date;
}

// DTO untuk Request Body saat Membuat Kategori Baru (POST /api/categories)
export interface ICreateCategoryDTO {
    name: IMultilingualText;
    description?: IMultilingualText;
    icon_url?: string;
    sort_order?: number;
}

// DTO untuk Request Body saat Memperbarui Kategori (PUT /api/categories/:id)
export interface IUpdateCategoryDTO {
    name?: IMultilingualText;
    description?: IMultilingualText;
    icon_url?: string;
    sort_order?: number;
}