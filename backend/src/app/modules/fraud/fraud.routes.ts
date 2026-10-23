import express, { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R } from '../../constants/roles';
import FraudService from './fraud.service';

/** Fraud check: super admin, admin, manager and online sales. */
const router = express.Router();
const desk = [authMiddleware, authorizeRoles(...R.orderDesk)];

router.get('/customers', ...desk, catchAsync(async (req: Request, res: Response) => {
    const r = await FraudService.customers(req.query as Record<string, unknown>);
    sendResponse(res, { statusCode: 200, success: true, message: 'Risky customers', meta: r.meta, data: { list: r.data, summary: r.summary } });
}));

router.get('/lookup', ...desk, catchAsync(async (req: Request, res: Response) => {
    const data = await FraudService.lookup(String(req.query.q || ''));
    sendResponse(res, { statusCode: 200, success: true, message: data ? 'History' : 'No orders from this number', data });
}));

router.get('/order/:orderId', ...desk, catchAsync(async (req: Request, res: Response) => {
    const data = await FraudService.forOrder(req.params.orderId);
    sendResponse(res, { statusCode: 200, success: true, message: 'Order risk', data });
}));

export const FraudRoutes = router;
