import express from 'express';
import JobController from './job.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

// ── Public (career page) ───────────────────────────────────────────────────
router.get('/public', JobController.getPublic);
router.get('/public/filters', JobController.getFilterOptions);
router.get('/public/:slug', JobController.getBySlug);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/stats', authMiddleware, authorizeRoles('admin'), JobController.stats);
router.get('/', authMiddleware, authorizeRoles('admin'), JobController.getAll);
router.get('/:id', authMiddleware, authorizeRoles('admin'), JobController.getById);
router.post('/', authMiddleware, authorizeRoles('admin'), JobController.create);
router.post('/:id/duplicate', authMiddleware, authorizeRoles('admin'), JobController.duplicate);
router.patch('/:id/status', authMiddleware, authorizeRoles('admin'), JobController.updateStatus);
router.patch('/:id', authMiddleware, authorizeRoles('admin'), JobController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), JobController.delete);

export const JobRoutes = router;
