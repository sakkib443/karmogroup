import express from 'express';
import CourierController from './courier.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R } from '../../constants/roles';

const router = express.Router();

// ── Public: Steadfast delivery-status webhook (guarded by shared secret) ──
router.post('/webhook', CourierController.webhook);

// Courier work is order-desk work: admin, manager, online sales (super admin always).
const desk = [authMiddleware, authorizeRoles(...R.orderDesk)];

// The courier board — one parcel per order, in tabs.
router.get('/packages', ...desk, CourierController.listPackages);
router.get('/counts', ...desk, CourierController.counts);
router.post('/sync-active', ...desk, CourierController.syncActive);

// Ticked parcels.
router.post('/bulk-book', ...desk, CourierController.bulkBook);
router.post('/bulk-status', ...desk, CourierController.bulkRefresh);

// One parcel (board and order page). packageId is the order's own id.
router.post('/orders/:orderId/packages/:packageId/book', ...desk, CourierController.book);
router.get('/orders/:orderId/packages/:packageId/status', ...desk, CourierController.refreshStatus);

// The Steadfast balance is shop money — admins only.
router.get('/balance', authMiddleware, authorizeRoles(...R.admin), CourierController.getBalance);

export const CourierRoutes = router;
