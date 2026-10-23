import express, { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R } from '../../constants/roles';
import type { Viewer } from '../order/order.desk';
import PayoutService from './payout.service';

/** Courier money is for the super admin and admins only — not managers or sales. */
const router = express.Router();
const money = [authMiddleware, authorizeRoles(...R.admin)];

const viewerOf = (req: Request): Viewer => ({ userId: req.user!.userId, role: req.user!.role, name: req.user!.name });

router.get('/overview', ...money, catchAsync(async (req: Request, res: Response) => {
    const data = await PayoutService.overview(req.query as Record<string, unknown>);
    sendResponse(res, { statusCode: 200, success: true, message: 'Courier accounts', data });
}));

router.get('/', ...money, catchAsync(async (req: Request, res: Response) => {
    const result = await PayoutService.list(req.query as Record<string, unknown>);
    sendResponse(res, { statusCode: 200, success: true, message: 'Courier payouts', meta: result.meta, data: result.data });
}));

router.post('/sync', ...money, catchAsync(async (req: Request, res: Response) => {
    const data = await PayoutService.syncSteadfast(viewerOf(req));
    sendResponse(res, { statusCode: 200, success: true, message: data.added ? `${data.added} new payout(s) from Steadfast` : 'No new payouts', data });
}));

router.post('/manual', ...money, catchAsync(async (req: Request, res: Response) => {
    const data = await PayoutService.addManual(viewerOf(req), req.body || {});
    sendResponse(res, { statusCode: 201, success: true, message: 'Payout saved', data });
}));

router.delete('/:id', ...money, catchAsync(async (req: Request, res: Response) => {
    const data = await PayoutService.remove(req.params.id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Payout removed', data });
}));

export const CourierPayoutRoutes = router;
