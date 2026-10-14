import express from 'express';
import RoleController from './role.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { updateUserRoleValidation, createStaffValidation } from './role.validation';
import { R } from '../../constants/roles';

const router = express.Router();

// Admins and the super admin manage staff. Which roles each may hand out is checked
// in role.service.ts (an admin only the roles below it).
router.get('/permissions', authMiddleware, authorizeRoles(...R.admin), RoleController.getPermissions);
router.get('/staff', authMiddleware, authorizeRoles(...R.admin), RoleController.getStaff);
router.post('/staff', authMiddleware, authorizeRoles(...R.admin), validateRequest(createStaffValidation), RoleController.createStaff);
router.patch('/:userId', authMiddleware, authorizeRoles(...R.admin), validateRequest(updateUserRoleValidation), RoleController.updateUserRole);

export const RoleRoutes = router;
