import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
import { upload, processMedia } from '../middlewares/upload.middleware';

const router = Router();
const portfolioController = new PortfolioController();

// ==========================================
// PUBLIC ROUTES (Siapa saja bisa mengakses)
// ==========================================

// 1. GET /api/portfolios - Ambil semua portofolio (Support filter category_id, type, is_featured, search, page, limit)
router.get('/', portfolioController.getAllPortfolios);

// 2. GET /api/portfolios/:id - Ambil detail portofolio berdasarkan ID
// router.get('/:id', portfolioController.getPortfolioById);
router.get('/:slug', portfolioController.getPortfolioBySlug); // by slug

// ==========================================
// PROTECTED ROUTES (Hanya Admin)
// ==========================================

// 3. POST /api/portfolios - Tambah portofolio baru + Multiple File Upload (Thumbnail, Video, Before/After Image)
router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 },
        { name: 'before_image', maxCount: 1 },
        { name: 'after_image', maxCount: 1 },
    ]),
    processMedia, // Kompresi Sharp (gambar -> WebP) & simpan video ke disk
    portfolioController.createPortfolio
);

// 4. PUT /api/portfolios/:id - Update data portofolio + Optional File Upload
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 },
        { name: 'before_image', maxCount: 1 },
        { name: 'after_image', maxCount: 1 },
    ]),
    processMedia,
    portfolioController.updatePortfolio
);

// 5. DELETE /api/portfolios/:id - Hapus portofolio
router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    portfolioController.deletePortfolio
);

export default router;