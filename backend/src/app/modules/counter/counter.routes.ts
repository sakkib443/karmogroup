import express from 'express';
import CounterController from './counter.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

// ── Public ──
router.get('/', CounterController.getActive);

// ── Admin ──
router.get('/admin', authMiddleware, authorizeRoles('admin', 'superadmin', 'manager'), CounterController.getAll);
router.get('/:id', authMiddleware, authorizeRoles('admin', 'superadmin', 'manager'), CounterController.getById);
router.post('/', authMiddleware, authorizeRoles('admin', 'superadmin'), CounterController.create);
router.put('/bulk', authMiddleware, authorizeRoles('admin', 'superadmin'), CounterController.bulkUpdate);
router.put('/:id', authMiddleware, authorizeRoles('admin', 'superadmin'), CounterController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin', 'superadmin'), CounterController.delete);

export const CounterRoutes = router;
