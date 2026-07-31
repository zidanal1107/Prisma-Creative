import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();
const categoryController = new CategoryController();

// ==========================================
// PUBLIC ROUTES (Siapa saja bisa melihat)
// ==========================================

// 1. GET /api/categories - Ambil semua kategori
router.get('/', categoryController.getAllCategories);

// 2. GET /api/categories/:id - Ambil detail kategori berdasarkan ID
router.get('/:id', categoryController.getCategoryById);

// ==========================================
// PROTECTED ROUTES (Hanya Admin yang bisa mengolah)
// ==========================================

// 3. POST /api/categories - Tambah kategori baru
router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    categoryController.createCategory
);

// 4. PUT /api/categories/:id - Update data kategori
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    categoryController.updateCategory
);

// 5. DELETE /api/categories/:id - Hapus kategori
router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    categoryController.deleteCategory
);

export default router;