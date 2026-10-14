import express from 'express';
import ActivityLogController from './activityLog.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R } from '../../constants/roles';

const router = express.Router();

// Admin-only: view the activity log feed.
router.get('/', authMiddleware, authorizeRoles(...R.ops), ActivityLogController.getAll);

export const ActivityLogRoutes = router;
