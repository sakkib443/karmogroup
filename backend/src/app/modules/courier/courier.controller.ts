import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';
import CourierService, { type Carrier } from './courier.service';
import config from '../../config';
import type { Viewer } from '../order/order.desk';

const viewerOf = (req: Request): Viewer => ({
    userId: req.user!.userId,
    role: req.user!.role,
    name: req.user!.name,
    divisions: req.user!.divisions,
});

/** pathao | steadfast — required when sending a parcel. */
const carrierOf = (v: unknown): Carrier => {
    const c = String(v || '').toLowerCase();
    if (c !== 'pathao' && c !== 'steadfast') throw new AppError(400, 'Choose the courier: Pathao or Steadfast');
    return c;
};

/** Bulk bodies send { items: [{ orderId, packageId }] }; older callers send { orderIds }. */
const idsOf = (body: any): string[] =>
    Array.isArray(body?.items) ? body.items.map((x: any) => String(x?.orderId || '')).filter(Boolean)
        : Array.isArray(body?.orderIds) ? body.orderIds.map(String) : [];

const CourierController = {
    // GET /api/courier/packages?tab=&search=&page=&limit=
    listPackages: catchAsync(async (req: Request, res: Response) => {
        const { tab, search, page, limit } = req.query;
        const result = await CourierService.listPackages({ tab: tab as string, search: search as string, page: Number(page) || 1, limit: Number(limit) || 20 });
        sendResponse(res, { statusCode: 200, success: true, message: 'Parcels', meta: result.meta, data: result.data });
    }),

    // GET /api/courier/counts?search=
    counts: catchAsync(async (req: Request, res: Response) => {
        const data = await CourierService.counts(req.query.search as string);
        sendResponse(res, { statusCode: 200, success: true, message: 'Parcel counts', data });
    }),

    // POST /api/courier/orders/:orderId/packages/:packageId/book   body: { carrier }
    book: catchAsync(async (req: Request, res: Response) => {
        const order = await CourierService.book(req.params.orderId, carrierOf(req.body?.carrier), viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: `Sent with ${order.carrier}`, data: order });
    }),

    // POST /api/courier/bulk-book   body: { items, carrier }
    bulkBook: catchAsync(async (req: Request, res: Response) => {
        const result = await CourierService.bulkBook(idsOf(req.body), carrierOf(req.body?.carrier), viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: `Sent ${result.booked} of ${result.total}`, data: result });
    }),

    // GET /api/courier/orders/:orderId/packages/:packageId/status
    refreshStatus: catchAsync(async (req: Request, res: Response) => {
        const result = await CourierService.refreshStatus(req.params.orderId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Courier status refreshed', data: result });
    }),

    // POST /api/courier/bulk-status   body: { items }
    bulkRefresh: catchAsync(async (req: Request, res: Response) => {
        const result = await CourierService.bulkRefresh(idsOf(req.body));
        sendResponse(res, { statusCode: 200, success: true, message: `Updated ${result.ok} of ${result.total}`, data: result });
    }),

    // POST /api/courier/sync-active
    syncActive: catchAsync(async (_req: Request, res: Response) => {
        const result = await CourierService.syncActive();
        sendResponse(res, { statusCode: 200, success: true, message: `Updated ${result.ok} of ${result.total}`, data: result });
    }),

    // GET /api/courier/balance
    getBalance: catchAsync(async (_req: Request, res: Response) => {
        const balance = await CourierService.getBalance();
        sendResponse(res, { statusCode: 200, success: true, message: 'Steadfast balance fetched', data: balance });
    }),

    // POST /api/courier/webhook  (public — Steadfast calls this; guarded by shared secret)
    webhook: catchAsync(async (req: Request, res: Response) => {
        const secret = config.steadfast.webhook_secret;
        if (secret) {
            const provided = (req.query.secret as string) || (req.headers['x-webhook-secret'] as string) || '';
            if (provided !== secret) {
                return sendResponse(res, { statusCode: 401, success: false, message: 'Invalid webhook secret', data: null });
            }
        }
        const result = await CourierService.applyWebhook(req.body || {});
        sendResponse(res, { statusCode: 200, success: true, message: 'Webhook processed', data: result });
    }),
};

export default CourierController;
