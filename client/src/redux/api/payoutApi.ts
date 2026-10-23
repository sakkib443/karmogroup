import { baseApi } from './baseApi';

// Courier money — what the couriers collected, charged, paid and still owe.
// Super admin and admin only. Backend: /api/courier-payouts (modules/courier/payout.*).

export type PayoutCarrier = 'pathao' | 'steadfast';

export interface ICourierPayout {
    _id: string;
    carrier: PayoutCarrier;
    source: 'api' | 'manual';
    reference: string;
    paidAt: string;
    amount: number;
    codTotal: number;
    chargeTotal: number;
    parcels: { orderNo: string; consignmentId: string; cod: number; charge: number; returnCharge: number; status: string }[];
    note: string;
    createdBy?: { name?: string; role?: string };
    createdAt: string;
}

export interface IPayoutParcel {
    orderId: string;
    orderNo: string;
    customer: string;
    phone: string;
    consignmentId: string;
    trackingNumber: string;
    carrier: string;
    bookedAt: string;
    cod: number;
    status: string;
    courierStatus: string;
    outcome: 'delivered' | 'partial' | 'returned' | 'progress';
    paid: boolean;
}

export interface ICourierOverview {
    setup: { pathao: boolean; steadfast: boolean };
    rightNow: { inReview: number; processing: number; codProcessing: { n: number; value: number }; returns30: number };
    last30: {
        bookedToday: number;
        bookedYesterday: number;
        booked: number;
        success: { pct: number; delivered: number; finished: number };
        notPaid: { n: number; value: number; afterCharges: number };
    };
    daily: { date: string; delivered: number; progress: number; partial: number; returned: number }[];
    ended: { total: number; delivered: number; progress: number; partial: number; returned: number };
    latest: IPayoutParcel[];
    lastPayout: ICourierPayout | null;
    paidAllTime: { value: number; n: number };
    stillToCome: { value: number; n: number };
    accounts: {
        owes: number;
        chargesUnknown: number;
        paid: { value: number; n: number };
        sent: { n: number; delivered: number; partial: number; returned: number; onTheWay: number };
        codAsked: number;
        codCollected: number;
        stillWithCourier: number;
        courierCharges: { value: number; unknown: number };
        returnCharges: { value: number; returned: number };
        buyersPaid: number;
        deliveryDiff: number;
    };
}

export type PayoutQuery = {
    carrier?: PayoutCarrier;
    from?: string;
    to?: string;
    search?: string;
    places?: string;
    pay?: 'cod' | 'prepaid';
};

export const payoutApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourierOverview: builder.query<{ data: ICourierOverview }, PayoutQuery>({
            query: (params) => ({ url: '/courier-payouts/overview', params }),
            providesTags: ['Payouts', 'Orders'],
        }),
        getCourierPayouts: builder.query<
            { data: ICourierPayout[]; meta: { total: number; page: number; limit: number; totalPages: number } },
            { carrier?: PayoutCarrier; from?: string; to?: string; page?: number; limit?: number }
        >({
            query: (params) => ({ url: '/courier-payouts', params }),
            providesTags: ['Payouts'],
        }),
        syncCourierPayouts: builder.mutation<{ data: { added: number; parcels: number; checked: number }; message: string }, void>({
            query: () => ({ url: '/courier-payouts/sync', method: 'POST' }),
            invalidatesTags: ['Payouts', 'Orders'],
        }),
        addCourierPayout: builder.mutation<{ data: ICourierPayout }, { carrier: PayoutCarrier; paidAt: string; amount: number; reference?: string; parcels?: string; note?: string }>({
            query: (body) => ({ url: '/courier-payouts/manual', method: 'POST', body }),
            invalidatesTags: ['Payouts', 'Orders'],
        }),
        deleteCourierPayout: builder.mutation<{ data: { removed: boolean } }, string>({
            query: (id) => ({ url: `/courier-payouts/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Payouts', 'Orders'],
        }),
    }),
});

export const {
    useGetCourierOverviewQuery,
    useGetCourierPayoutsQuery,
    useSyncCourierPayoutsMutation,
    useAddCourierPayoutMutation,
    useDeleteCourierPayoutMutation,
} = payoutApi;
