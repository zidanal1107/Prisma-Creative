import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    // 1. GET /api/categories - Ambil semua kategori
    public getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil daftar kategori.',
                data: categories,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Terjadi kesalahan pada server.',
            });
        }
    };

    // 2. GET /api/categories/:id - Ambil detail kategori berdasarkan ID
    public getCategoryById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const category = await this.categoryService.getCategoryById(id);
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil detail kategori.',
                data: category,
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 3. POST /api/categories - Tambah kategori baru (Protected / Admin Only)
    public createCategory = async (req: Request, res: Response) => {
        try {
            const newCategory = await this.categoryService.createCategory(req.body);
            return res.status(201).json({
                status: 'success',
                message: 'Kategori baru berhasil dibuat.',
                data: newCategory,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 4. PUT /api/categories/:id - Update data kategori (Protected / Admin Only)
    public updateCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const updatedCategory = await this.categoryService.updateCategory(id, req.body);
            return res.status(200).json({
                status: 'success',
                message: 'Data kategori berhasil diperbarui.',
                data: updatedCategory,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 5. DELETE /api/categories/:id - Hapus kategori (Protected / Admin Only)
    public deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            await this.categoryService.deleteCategory(id);
            return res.status(200).json({
                status: 'success',
                message: 'Kategori berhasil dihapus.',
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message,
            });
        }
    };
}