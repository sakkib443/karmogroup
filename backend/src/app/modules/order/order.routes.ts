import express from 'express';
import OrderController from './order.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
    createOrderValidation, updateOrderStatusValidation, scanValidation, reasonValidation, smsValidation, staffOrderValidation,
} from './order.validation';
import { R } from '../../constants/roles';

const router = express.Router();

// Who may do what is decided twice: here by role group (constants/roles.ts), and in
// order.desk.ts per order (which orders a role sees, which steps it may take).

// ── Guest checkout (no auth required) ────────────
router.post('/guest-checkout', validateRequest(createOrderValidation), OrderController.guestCheckout);

// ── Public order tracking (no auth required) ─────
router.get('/track/:orderId', OrderController.trackOrder);

// ── User routes ──────────────────────────────────
router.get('/my', authMiddleware, OrderController.getMyOrders);
router.post('/', authMiddleware, validateRequest(createOrderValidation), OrderController.create);
router.patch('/:id/cancel', authMiddleware, OrderController.cancel);

// ── Factory: scan pieces out ─────────────────────
router.get('/factory/queue', authMiddleware, authorizeRoles(...R.scanners), OrderController.factoryQueue);
router.post('/factory/scan', authMiddleware, authorizeRoles(...R.scanners), validateRequest(scanValidation), OrderController.factoryScan);

// ── Order desk (staff) ───────────────────────────
// Manual orders (phone / walk-in): super admin, admin, manager and online sales.
router.post('/admin', authMiddleware, authorizeRoles(...R.orderDesk), validateRequest(staffOrderValidation), OrderController.createManual);
// Excel of the filtered list — before /admin/:id, which would otherwise take "export" as an id.
router.get('/admin/export', authMiddleware, authorizeRoles(...R.ops), OrderController.exportXlsx);
router.get('/admin/all', authMiddleware, authorizeRoles(...R.orderViewers), OrderController.getAll);
router.get('/admin/stats', authMiddleware, authorizeRoles(...R.orderViewers), OrderController.getStats);
// Dashboard of super admin, admin and manager (money included) — before /admin/:id.
router.get('/admin/overview', authMiddleware, authorizeRoles(...R.ops), OrderController.overview);
router.get('/admin/sms-log', authMiddleware, authorizeRoles(...R.confirmers), OrderController.smsLog);
router.get('/admin/:id', authMiddleware, authorizeRoles(...R.orderViewers), OrderController.getById);
router.patch('/admin/:id/status', authMiddleware, authorizeRoles(...R.confirmers), validateRequest(updateOrderStatusValidation), OrderController.updateStatus);
router.patch('/admin/:id/note', authMiddleware, authorizeRoles(...R.orderViewers), OrderController.addNote);
router.post('/admin/:id/sms', authMiddleware, authorizeRoles(...R.confirmers), validateRequest(smsValidation), OrderController.sendSms);

router.patch('/admin/:id/payment', authMiddleware, authorizeRoles(...R.admin), OrderController.updatePaymentStatus);
router.patch('/admin/:id/tracking', authMiddleware, authorizeRoles(...R.orderDesk), OrderController.updateOrderTracking);
router.post('/admin/:id/pathao', authMiddleware, authorizeRoles(...R.orderDesk), OrderController.sendWithPathao);

// Paperwork — each original once; duplicates by an admin, with a reason.
router.post('/admin/:id/jobs/:jobId/issue', authMiddleware, authorizeRoles(...R.challanIssuers), OrderController.issueChallan);
router.post('/admin/:id/jobs/:jobId/reprint', authMiddleware, authorizeRoles(...R.admin), validateRequest(reasonValidation), OrderController.reprintChallan);
router.post('/admin/:id/memo/issue', authMiddleware, authorizeRoles(...R.orderDesk), OrderController.issueMemo);
router.post('/admin/:id/memo/reprint', authMiddleware, authorizeRoles(...R.admin), validateRequest(reasonValidation), OrderController.reprintMemo);

// ── Legacy/general ───────────────────────────────
router.get('/:id', authMiddleware, OrderController.getById);

export const OrderRoutes = router;
