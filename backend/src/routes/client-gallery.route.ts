import { Router } from 'express';
import { ClientGalleryController } from '../controllers/client-gallery.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
import { handleUploadFields, processMedia } from '../middlewares/upload.middleware';

const router = Router();
const galleryController = new ClientGalleryController();

// 1. Verify Access Code (Public / Client)
router.post('/verify', galleryController.verifyAccessCode);

// 2. Select / Unselect Photo & Notes (Public / Client)
router.patch('/media/:mediaId/select', galleryController.toggleMediaSelect);

// 3. Create Gallery Project (Admin)
router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    galleryController.createGallery
);

// 4. Bulk Upload Media Draf (Admin) - Menerima hingga 50 file sekaligus
router.post(
    '/:id/media',
    authenticateToken,
    authorizeRoles('admin'),
    handleUploadFields([{ name: 'client_gallery', maxCount: 50 }]), // Melindungi dari Error 500 jika file tidak valid
    processMedia,
    galleryController.uploadBulkMedia
);

// 5. Delete Gallery (Admin)
router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    galleryController.deleteGallery
);

export default router;