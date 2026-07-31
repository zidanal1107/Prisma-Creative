import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { upload, processMedia } from '../middlewares/upload.middleware';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// ==========================================
// 🔓 PUBLIC ROUTES
// ==========================================

// Public: Ambil daftar semua tim/talent (untuk halaman About/Team)
router.get('/', userController.getAllUsers);


// ==========================================
// 🔒 PROTECTED ROUTES (Butuh Login JWT)
// ==========================================

// User: Ambil detail 1 user berdasarkan ID
router.get('/:id', authenticateToken, userController.getUserById);

// User: Update profil/bio
router.put('/:id', authenticateToken, userController.updateUser);

// User: Upload / Ganti Foto Avatar
router.patch(
    '/:id/avatar',
    authenticateToken,
    upload.single('avatar'),
    processMedia,
    userController.updateAvatar
);


// ==========================================
// 🛡️ ADMIN ONLY ROUTES
// ==========================================

// User: Tambah Talent / User Baru via Admin
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);

// User: Hapus User
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);

export default router;