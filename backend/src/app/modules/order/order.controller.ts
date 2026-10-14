import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import OrderService from './order.service';
import { OrderDesk, present, type Viewer } from './order.desk';
import { R } from '../../constants/roles';

/** The signed-in staff member, as the desk rules need them. */
const viewerOf = (req: Request): Viewer => ({
    userId: req.user!.userId,
    role: req.user!.role,
    name: req.user!.name,
    divisions: req.user!.divisions,
});

const isOrderStaff = (role?: string) => role === 'superadmin' || R.orderViewers.includes(role as any);

const OrderController = {
    // POST /api/orders/admin — an order taken by hand at the desk (phone / walk-in)
    createManual: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.createStaffOrder(viewerOf(req), req.body);
        sendResponse(res, { statusCode: 201, success: true, message: `Order ${order?.orderId || ''} created`, data: order });
    }),

    getAll: catchAsync(async (req: Request, res: Response) => {
        const { orders, meta } = await OrderService.getAllOrders(req.query as Record<string, unknown>, viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Orders fetched', data: orders, meta });
    }),

    getMyOrders: catchAsync(async (req: Request, res: Response) => {
        const { orders, meta } = await OrderService.getMyOrders(req.user!.userId, req.query as Record<string, unknown>);
        sendResponse(res, { statusCode: 200, success: true, message: 'My orders fetched', data: orders, meta });
    }),

    getById: catchAsync(async (req: Request, res: Response) => {
        // Staff see the order as their role allows; a customer only their own.
        const order = isOrderStaff(req.user!.role)
            ? await OrderService.getOrderForStaff(req.params.id, viewerOf(req))
            : await OrderService.getOrderById(req.params.id, req.user!.userId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Order fetched', data: order });
    }),

    create: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.createOrder(req.user!.userId, req.body);
        sendResponse(res, { statusCode: 201, success: true, message: 'Order placed successfully', data: order });
    }),

    updateStatus: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.updateOrderStatus(req.params.id, req.body.status, req.body.note ?? req.body.reason, viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Order status updated', data: order });
    }),

    sendWithPathao: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.sendWithPathao(req.params.id, viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Sent with Pathao', data: order });
    }),

    updatePaymentStatus: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.updatePaymentStatus(req.params.id, req.body.paymentStatus, viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Payment status updated', data: order });
    }),

    addNote: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.addAdminNote(req.params.id, req.body.note, viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Note added', data: order });
    }),

    updateOrderTracking: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.updateOrderTracking(req.params.id, req.body.trackingNumber, req.body.carrier, viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Order tracking updated', data: order });
    }),

    // Public order tracking (no auth)
    trackOrder: catchAsync(async (req: Request, res: Response) => {
        const data = await OrderService.trackOrder(req.params.orderId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Order tracking fetched', data });
    }),

    cancel: catchAsync(async (req: Request, res: Response) => {
        const order = await OrderService.cancelOrder(req.params.id, req.user!.userId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Order cancelled', data: order });
    }),

    getStats: catchAsync(async (req: Request, res: Response) => {
        const stats = await OrderService.getOrderStats(viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Order stats fetched', data: stats });
    }),

    guestCheckout: catchAsync(async (req: Request, res: Response) => {
        const result = await OrderService.createGuestOrder(req.body);
        const message = result.isNewUser
            ? 'Order placed successfully! An account has been created for you. Your phone number is your password.'
            : 'Order placed successfully! You already have an account — log in with your password to follow it.';
        sendResponse(res, { statusCode: 201, success: true, message, data: result });
    }),

    // ── Factory ──────────────────────────────────────
    factoryQueue: catchAsync(async (req: Request, res: Response) => {
        const data = await OrderDesk.factoryQueue(viewerOf(req));
        sendResponse(res, { statusCode: 200, success: true, message: 'Factory queue', data });
    }),

    factoryScan: catchAsync(async (req: Request, res: Response) => {
        const data = await OrderDesk.scan(viewerOf(req), req.body.code, req.body.method);
        sendResponse(res, { statusCode: 200, success: true, message: `Scanned ${data.code}`, data });
    }),

    issueChallan: catchAsync(async (req: Request, res: Response) => {
        const v = viewerOf(req);
        const { order, ready } = await OrderDesk.issueChallan(v, req.params.id, req.params.jobId);
        sendResponse(res, { statusCode: 200, success: true, message: ready ? 'Challan issued — order is Challan Ready' : 'Challan issued', data: present(order, v) });
    }),

    reprintChallan: catchAsync(async (req: Request, res: Response) => {
        const v = viewerOf(req);
        const order = await OrderDesk.reprintChallan(v, req.params.id, req.params.jobId, req.body.reason);
        sendResponse(res, { statusCode: 200, success: true, message: 'Duplicate allowed', data: present(order, v) });
    }),

    issueMemo: catchAsync(async (req: Request, res: Response) => {
        const v = viewerOf(req);
        const order = await OrderDesk.issueMemo(v, req.params.id);
        sendResponse(res, { statusCode: 200, success: true, message: 'Memo issued', data: present(order, v) });
    }),

    reprintMemo: catchAsync(async (req: Request, res: Response) => {
        const v = viewerOf(req);
        const order = await OrderDesk.reprintMemo(v, req.params.id, req.body.reason);
        sendResponse(res, { statusCode: 200, success: true, message: 'Duplicate allowed', data: present(order, v) });
    }),

    // ── SMS ──────────────────────────────────────────
    sendSms: catchAsync(async (req: Request, res: Response) => {
        const v = viewerOf(req);
        const { order, sms } = await OrderDesk.sendSms(v, req.params.id, req.body?.kind);
        const message = sms.status === 'sent' ? 'SMS sent'
            : sms.status === 'not_configured' ? 'SMS gateway is not set up yet — nothing was sent'
            : `SMS failed: ${sms.error}`;
        sendResponse(res, { statusCode: 200, success: true, message, data: { order: present(order, v), sms } });
    }),

    smsLog: catchAsync(async (req: Request, res: Response) => {
        const { rows, meta } = await OrderDesk.smsLog(viewerOf(req), req.query as Record<string, unknown>);
        sendResponse(res, { statusCode: 200, success: true, message: 'SMS log', data: rows, meta });
    }),
};

export default OrderController;
