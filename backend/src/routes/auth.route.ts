import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Public: Login
router.post('/login', userController.login);

// Public: Register Akun Baru
router.post('/register', userController.createUser);

// Protected: Ambil Data Akun yang Sedang Login
router.get('/me', authenticateToken, userController.getMe);

export default router;