import express from 'express';
import ApplicationController from './application.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

// ── Public (no login — candidates apply as guests) ─────────────────────────
router.post('/', ApplicationController.create);
router.get('/track/:trackingId', ApplicationController.track);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/stats', authMiddleware, authorizeRoles('admin'), ApplicationController.stats);
router.get('/export', authMiddleware, authorizeRoles('admin'), ApplicationController.exportCsv);
router.get('/', authMiddleware, authorizeRoles('admin'), ApplicationController.getAll);
router.get('/:id', authMiddleware, authorizeRoles('admin'), ApplicationController.getById);
router.patch('/bulk-status', authMiddleware, authorizeRoles('admin'), ApplicationController.bulkStatus);
router.patch('/:id/status', authMiddleware, authorizeRoles('admin'), ApplicationController.updateStatus);
router.patch('/:id', authMiddleware, authorizeRoles('admin'), ApplicationController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), ApplicationController.delete);

export const ApplicationRoutes = router;
