import express from 'express';
import UserController from './user.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
    updateUserValidation, addAddressValidation, updateAddressValidation, updateStatusValidation,
    adminCreateUserValidation, adminCreateCustomerValidation, adminUpdateUserValidation,
} from './user.validation';
import { R } from '../../constants/roles';

const router = express.Router();

// ── My Profile ─────────────────────────────────────────
router.get('/me', authMiddleware, UserController.getMyProfile);
router.patch('/me', authMiddleware, validateRequest(updateUserValidation), UserController.updateMyProfile);

// ── Shipping Addresses ─────────────────────────────────
router.get('/addresses', authMiddleware, UserController.getMyAddresses);
router.post('/addresses', authMiddleware, validateRequest(addAddressValidation), UserController.addShippingAddress);
router.patch('/addresses/:addressId', authMiddleware, validateRequest(updateAddressValidation), UserController.updateShippingAddress);
router.delete('/addresses/:addressId', authMiddleware, UserController.deleteShippingAddress);

// ── Wishlist ───────────────────────────────────────────
// Public read-only shared wishlist (must stay BEFORE auth-protected wishlist routes)
router.get('/wishlist/shared/:userId', UserController.getSharedWishlist);

router.get('/wishlist', authMiddleware, UserController.getWishlist);
router.post('/wishlist', authMiddleware, UserController.toggleWishlistFromBody);
router.post('/wishlist/merge', authMiddleware, UserController.mergeWishlist);
router.post('/wishlist/:productId', authMiddleware, UserController.toggleWishlist);

// ── Admin Routes ────────────────────────────────────────
// Managers see customers; the super admin and admins add, change, block and delete
// accounts. Whose account each may touch is checked in user.service.ts (an admin never
// another admin or a super admin).
router.get('/admin/all', authMiddleware, authorizeRoles(...R.ops), UserController.getAllUsers);
router.get('/admin/stats', authMiddleware, authorizeRoles(...R.ops), UserController.getAdminStats);
// Phone lookup for "Add order" — everyone who takes manual orders.
router.get('/admin/lookup', authMiddleware, authorizeRoles(...R.orderDesk), UserController.lookupCustomer);
router.post('/admin', authMiddleware, authorizeRoles(...R.admin), validateRequest(adminCreateUserValidation), UserController.adminCreateUser);
router.post('/admin/customers', authMiddleware, authorizeRoles(...R.ops), validateRequest(adminCreateCustomerValidation), UserController.adminCreateCustomer);
router.get('/admin/:id', authMiddleware, authorizeRoles(...R.ops), UserController.getUserById);
router.patch('/admin/:id', authMiddleware, authorizeRoles(...R.admin), validateRequest(adminUpdateUserValidation), UserController.adminUpdateUser);
router.patch('/admin/:id/status', authMiddleware, authorizeRoles(...R.admin), validateRequest(updateStatusValidation), UserController.updateUserStatus);
router.delete('/admin/:id', authMiddleware, authorizeRoles(...R.admin), UserController.deleteUser);

export const UserRoutes = router;
