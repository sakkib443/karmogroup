import express from 'express';
import InquiryController from './inquiry.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R } from '../../constants/roles';

const router = express.Router();

// Public routes (no auth needed)
router.post('/', InquiryController.create);
router.get('/product/:productId', InquiryController.getByProduct);

// Admin routes
router.get('/', authMiddleware, authorizeRoles(...R.orderDesk), InquiryController.getAll);
router.patch('/:id', authMiddleware, authorizeRoles(...R.orderDesk), InquiryController.updateStatus);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), InquiryController.delete);

export const InquiryRoutes = router;
