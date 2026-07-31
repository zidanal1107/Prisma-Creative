import { Router } from 'express';
import { InquiryController } from '../controllers/inquiry.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();
const inquiryController = new InquiryController();

// ==========================================
// PUBLIC ROUTE
// ==========================================
// 1. POST /api/inquiries - Klien mengirimkan booking/pesan
router.post('/', inquiryController.createInquiry);

// ==========================================
// PROTECTED ROUTES (Admin Only)
// ==========================================
// 2. GET /api/inquiries - Melihat daftar semua pesan/booking
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    inquiryController.getAllInquiries
);

// 3. PATCH /api/inquiries/:id/status - Update status inquiry
router.patch(
    '/:id/status',
    authenticateToken,
    authorizeRoles('admin'),
    inquiryController.updateInquiryStatus
);

// 4. DELETE /api/inquiries/:id - Hapus data inquiry
router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    inquiryController.deleteInquiry
);

export default router;