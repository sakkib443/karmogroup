import { baseApi } from "./baseApi";

/** A payment the shop can record against an order. */
export type OrderPaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'bank';

/** One line of an admin "New order". */
export interface AdminOrderItemInput {
    product: string;
    quantity: number;
    color?: string;
    size?: string;
    /** Price charged per unit for THIS order only — sent only when staff changed the price. */
    unitPrice?: number;
    /** The list / "was" price shown next to it — sent together with unitPrice. */
    originalPrice?: number;
}

/** Body of POST /api/orders/admin. Anything left out is resolved by the server. */
export interface AdminOrderInput {
    items: AdminOrderItemInput[];
    shippingAddress: {
        fullName: string;
        phone: string;
        email?: string;
        address: string;
        area?: string;
        city?: string;
        postalCode?: string;
    };
    paymentMethod: OrderPaymentMethod;
    paymentDetails?: { senderNumber?: string; transactionId?: string; paymentTime?: string };
    paymentStatus?: 'pending' | 'paid';
    status?: 'pending' | 'confirmed' | 'processing';
    deliveryArea?: 'inside_dhaka' | 'outside_dhaka';
    zoneId?: string;
    /** auto = the normal delivery charge, free = none, custom = `amount`. */
    shipping?: { mode: 'auto' | 'free' | 'custom'; amount?: number };
    couponCode?: string;
    note?: string;
}

/** One line of an "Add order": the price agreed with the customer, per unit. */
export interface ManualOrderLine {
    /** A Karmo catalogue slug, a product _id, or nothing for a free line. */
    product?: string;
    name: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    division?: string;
    size?: string;
    color?: string;
    image?: string;
}

/** Body of POST /api/orders/admin — an order taken by phone or for a walk-in customer. */
export interface ManualOrderInput {
    items: ManualOrderLine[];
    shippingAddress: { fullName: string; phone: string; email?: string; address: string; area?: string; city?: string };
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket';
    paymentDetails?: { senderNumber?: string; transactionId?: string };
    paymentStatus?: 'pending' | 'paid';
    status: 'pending' | 'confirmed';
    deliveryArea?: 'inside_dhaka' | 'outside_dhaka';
    shipping: { mode: 'auto' | 'free' | 'custom'; amount?: number };
    discount?: number;
    note?: string;
    adminNote?: string;
}

/**
 * Body of PATCH /api/orders/admin/:id — correcting an order that has not gone to the
 * courier yet. Every part is optional: send only what changed, and the rest is left
 * alone. `items`, when sent, replaces the order's lines in full.
 *
 * The order's status and payment status are not here — they keep their own controls.
 */
export type AdminOrderUpdate = Partial<Pick<AdminOrderInput,
    'items' | 'shippingAddress' | 'paymentMethod' | 'paymentDetails' | 'deliveryArea' | 'zoneId' | 'shipping' | 'note'
>>;

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ===== Admin endpoints =====
        // Admin: get all orders — Backend route: GET /api/orders/admin/all
        getAdminOrders: builder.query({
            query: (params) => ({
                url: '/orders/admin/all',
                method: 'GET',
                params,
            }),
            providesTags: ['Orders'],
        }),
        // Admin: get order stats — Backend route: GET /api/orders/admin/stats
        getOrderStats: builder.query({
            query: () => ({
                url: '/orders/admin/stats',
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        // Admin / manager dashboard: today + the running 7 or 30 days — GET /api/orders/admin/overview?days=
        getOrderOverview: builder.query({
            query: (days: 7 | 30 = 30) => ({
                url: '/orders/admin/overview',
                method: 'GET',
                params: { days },
            }),
            providesTags: ['Orders'],
        }),
        // Admin: get order by id — Backend route: GET /api/orders/admin/:id
        getAdminOrderById: builder.query({
            query: (id) => ({
                url: `/orders/admin/${id}`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        // Admin: update order status — Backend route: PATCH /api/orders/admin/:id/status
        updateOrderStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/orders/admin/${id}/status`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        // Admin: correct an order's details — Backend route: PATCH /api/orders/admin/:id.
        // Editing the lines moves stock, so Products is invalidated too.
        updateAdminOrder: builder.mutation<{ data?: unknown }, { id: string } & AdminOrderUpdate>({
            query: ({ id, ...data }) => ({
                url: `/orders/admin/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Orders', 'Products', 'Users'],
        }),
        // Admin: update payment status — Backend route: PATCH /api/orders/admin/:id/payment
        updatePaymentStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/orders/admin/${id}/payment`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        // Admin: add note — Backend route: PATCH /api/orders/admin/:id/note
        addAdminNote: builder.mutation({
            query: ({ id, note }) => ({
                url: `/orders/admin/${id}/note`,
                method: 'PATCH',
                body: { note },
            }),
            invalidatesTags: ['Orders'],
        }),

        // "Add order" for a phone / walk-in customer — Backend route: POST /api/orders/admin
        // (super admin, admin, manager, online sales)
        createAdminOrder: builder.mutation<{ data?: { _id?: string; orderId?: string } }, ManualOrderInput>({
            query: (data) => ({
                url: '/orders/admin',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Orders', 'Products', 'Users'],
        }),

        // Admin: shipping-label / invoice data for up to 100 orders, in the order given —
        // Backend route: POST /api/orders/admin/print { ids }. A read, so a query (POST only
        // because the id list can be long); dropped as soon as the print window closes.
        getOrdersPrintData: builder.query({
            query: (ids: string[]) => ({
                url: '/orders/admin/print',
                method: 'POST',
                body: { ids },
            }),
            providesTags: ['Orders'],
            keepUnusedDataFor: 0,
        }),

        // ===== User endpoints =====
        // User: create order — Backend route: POST /api/orders/
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/orders',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        // Guest checkout (no auth required) — Backend route: POST /api/orders/guest-checkout
        guestCheckout: builder.mutation({
            query: (data) => ({
                url: '/orders/guest-checkout',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        // User: get my orders — Backend route: GET /api/orders/my
        getMyOrders: builder.query({
            query: (params) => ({
                url: '/orders/my',
                method: 'GET',
                params,
            }),
            providesTags: ['Orders'],
        }),
        // User: cancel order — Backend route: PATCH /api/orders/:id/cancel
        cancelOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}/cancel`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Orders'],
        }),
        // General: get order by id — Backend route: GET /api/orders/:id
        getOrderById: builder.query({
            query: (id) => ({
                url: `/orders/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),

// ===== Public tracking endpoint (no auth) =====
        // Public: track order by human orderId (e.g. SK-0050, or KM-xxxx for older orders) or Mongo _id — Backend route: GET /api/orders/track/:orderId
        trackOrder: builder.query({
            query: (orderId) => ({
                url: `/orders/track/${orderId}`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),

        // ===== Admin tracking endpoint =====
        // Admin: set order-level tracking number + carrier — Backend route: PATCH /api/orders/admin/:id/tracking
        updateAdminOrderTracking: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/orders/admin/${id}/tracking`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        // Admin: book the parcel with Pathao and mark the order shipped — POST /api/orders/admin/:id/pathao
        sendWithPathao: builder.mutation<{ data?: { consignmentId?: string } }, string>({
            query: (id) => ({
                url: `/orders/admin/${id}/pathao`,
                method: 'POST',
            }),
            invalidatesTags: ['Orders'],
        }),

        // ===== Order desk: SMS, factory, once-only paperwork =====
        // One-click SMS to the customer — POST /api/orders/admin/:id/sms
        sendOrderSms: builder.mutation<{ message?: string; data?: { sms?: { status: string; error?: string } } }, { id: string; kind?: 'confirmed' | 'cancelled' }>({
            query: ({ id, kind }) => ({ url: `/orders/admin/${id}/sms`, method: 'POST', body: kind ? { kind } : {} }),
            invalidatesTags: ['Orders'],
        }),
        // Every SMS the desk sent (agency: their own) — GET /api/orders/admin/sms-log
        getSmsLog: builder.query({
            query: (params) => ({ url: '/orders/admin/sms-log', method: 'GET', params }),
            providesTags: ['Orders'],
        }),
        // Challans waiting at the factory — GET /api/orders/factory/queue
        getFactoryQueue: builder.query({
            query: () => ({ url: '/orders/factory/queue', method: 'GET' }),
            providesTags: ['Orders'],
        }),
        // Scan one piece out — POST /api/orders/factory/scan
        factoryScan: builder.mutation<{ message?: string; data?: { code: string; itemName: string; orderId: string; remaining: number } }, { code: string; method?: 'scan' | 'manual' }>({
            query: (body) => ({ url: '/orders/factory/scan', method: 'POST', body }),
            invalidatesTags: ['Orders'],
        }),
        // Issue a challan's original, once — POST /api/orders/admin/:id/jobs/:jobId/issue
        issueChallan: builder.mutation<{ message?: string; data?: unknown }, { id: string; jobId: string }>({
            query: ({ id, jobId }) => ({ url: `/orders/admin/${id}/jobs/${jobId}/issue`, method: 'POST' }),
            invalidatesTags: ['Orders'],
        }),
        // Admin: allow a duplicate challan, with a reason
        reprintChallan: builder.mutation<{ data?: unknown }, { id: string; jobId: string; reason: string }>({
            query: ({ id, jobId, reason }) => ({ url: `/orders/admin/${id}/jobs/${jobId}/reprint`, method: 'POST', body: { reason } }),
            invalidatesTags: ['Orders'],
        }),
        // Issue the customer's memo, once
        issueMemo: builder.mutation<{ data?: unknown }, string>({
            query: (id) => ({ url: `/orders/admin/${id}/memo/issue`, method: 'POST' }),
            invalidatesTags: ['Orders'],
        }),
        // Admin: allow a duplicate memo, with a reason
        reprintMemo: builder.mutation<{ data?: unknown }, { id: string; reason: string }>({
            query: ({ id, reason }) => ({ url: `/orders/admin/${id}/memo/reprint`, method: 'POST', body: { reason } }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    // Admin hooks
    useGetAdminOrdersQuery,
    useGetOrderStatsQuery,
    useGetOrderOverviewQuery,
    useGetAdminOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useUpdateAdminOrderMutation,
    useUpdatePaymentStatusMutation,
    useAddAdminNoteMutation,
    useCreateAdminOrderMutation,
    useGetOrdersPrintDataQuery,
    // User hooks
    useCreateOrderMutation,
    useGuestCheckoutMutation,
    useGetMyOrdersQuery,
    useCancelOrderMutation,
    useGetOrderByIdQuery,
    // Public tracking hooks
    useTrackOrderQuery,
    useLazyTrackOrderQuery,
    // Admin tracking hook
    useUpdateAdminOrderTrackingMutation,
    useSendWithPathaoMutation,
    // Order desk
    useSendOrderSmsMutation,
    useGetSmsLogQuery,
    useGetFactoryQueueQuery,
    useFactoryScanMutation,
    useIssueChallanMutation,
    useReprintChallanMutation,
    useIssueMemoMutation,
    useReprintMemoMutation,
} = orderApi;
