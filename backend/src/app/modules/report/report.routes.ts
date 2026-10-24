import express, { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R, STAFF_ROLES } from '../../constants/roles';
import ReportService from './report.service';

/** Sales reports, payments and staff activity: super admin, admin, manager. */
const router = express.Router();
const ops = [authMiddleware, authorizeRoles(...R.ops)];
const q = (req: Request) => req.query as Record<string, unknown>;

router.get('/sales', ...ops, catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, { statusCode: 200, success: true, message: 'Sales report', data: await ReportService.sales(q(req)) });
}));

router.get('/payments', ...ops, catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, { statusCode: 200, success: true, message: 'Payments', data: await ReportService.payments(q(req)) });
}));

router.get('/staff', ...ops, catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, { statusCode: 200, success: true, message: 'Staff activity', data: await ReportService.staff(q(req)) });
}));

// Any staff member's own numbers (My profile).
router.get('/me', authMiddleware, authorizeRoles(...STAFF_ROLES.filter((r) => r !== 'superadmin')), catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, { statusCode: 200, success: true, message: 'My activity', data: await ReportService.mine(req.user!.userId, q(req)) });
}));

router.get('/staff/log', ...ops, catchAsync(async (req: Request, res: Response) => {
    const r = await ReportService.log(q(req));
    sendResponse(res, { statusCode: 200, success: true, message: 'Staff log', data: r.data, meta: r.meta });
}));

export const ReportRoutes = router;
