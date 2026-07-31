import slugify from 'slugify';
import { CategoryRepository } from '../repositories/category.repository';
import { ICategory, ICreateCategoryDTO, IUpdateCategoryDTO } from '../interfaces/category.interface';

export class CategoryService {
    private categoryRepo: CategoryRepository;

    constructor() {
        this.categoryRepo = new CategoryRepository();
    }

    // Helper: Generate slug unik dari nama kategori
    private async generateUniqueSlug(nameText: string, currentId?: number): Promise<string> {
        let slug = slugify(nameText, { lower: true, strict: true, trim: true });
        let existingCategory = await this.categoryRepo.findBySlug(slug);
        // Jika slug sudah dipakai oleh kategori lain, tambahkan akhiran unik
        if (existingCategory && existingCategory.id !== currentId) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }
        return slug;
    }

    // 1. Get All Categories
    async getAllCategories(): Promise<ICategory[]> {
        return await this.categoryRepo.findAll();
    }
    // 2. Get Category By ID
    async getCategoryById(id: number): Promise<ICategory> {
        const category = await this.categoryRepo.findById(id);
        if (!category) {
            throw new Error('Kategori tidak ditemukan!');
        }
        return category;
    }

    // 3. Create Category
    async createCategory(dto: ICreateCategoryDTO): Promise<ICategory> {
        if (!dto.name || !dto.name.en || !dto.name.id) {
            throw new Error('Nama kategori wajib diisi dalam bahasa Indonesia (id) dan Inggris (en)!');
        }
        // Slug di-generate utama dari nama Inggris, jika kosong dari nama Indonesia
        const baseName = dto.name.en || dto.name.id;
        const slug = await this.generateUniqueSlug(baseName);
        return await this.categoryRepo.create({
            ...dto,
            slug,
        });
    }

    // 4. Update Category
    async updateCategory(id: number, dto: IUpdateCategoryDTO): Promise<ICategory> {
        // Cek apakah kategori ada
        const category = await this.getCategoryById(id);
        let newSlug: string | undefined = undefined;
        // Jika nama diubah, generate slug baru
        if (dto.name && (dto.name.en || dto.name.id)) {
            const baseName = dto.name.en || dto.name.id;
            newSlug = await this.generateUniqueSlug(baseName, id);
        }
        const updatedCategory = await this.categoryRepo.update(id, {
            ...dto,
            ...(newSlug && { slug: newSlug }),
        });
        if (!updatedCategory) {
            throw new Error('Gagal memperbarui data kategori!');
        }
        return updatedCategory;
    }

    // 5. Delete Category
    async deleteCategory(id: number): Promise<boolean> {
        await this.getCategoryById(id); // Pastikan kategori ada sebelum dihapus
        return await this.categoryRepo.delete(id);
    }
}