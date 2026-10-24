import { baseApi } from './baseApi';

// Sales reports and staff activity (super admin, admin, manager). Backend: /api/reports.

export type Range = { from: string; to: string };

export interface ISalesReport {
    from: string; to: string; days: number;
    totals: {
        orders: number; sold: number; soldValue: number; average: number;
        delivered: number; deliveredValue: number; cancelled: number; cancelledValue: number;
        returned: number; returnedValue: number; discount: number; shipping: number;
    };
    /** The same length of time just before, same filters. */
    previous: { from: string; to: string; orders: number; sold: number; soldValue: number; average: number; delivered: number; deliveredValue: number; cancelled: number; returned: number };
    daily: { date: string; orders: number; sold: number; revenue: number; delivered: number; cancelled: number }[];
    divisions: { division: string; pieces: number; value: number }[];
    products: { name: string; pieces: number; value: number }[];
    sources: { source: string; orders: number; value: number }[];
    payments: { method: string; orders: number; value: number }[];
    staff: { id: string; name: string; role: string; taken: number; takenValue: number; confirmed: number; confirmedValue: number; delivered: number }[];
}

export type StaffCounts = { taken: number; confirmed: number; cancelled: number; shipped: number; sms: number; scans: number; challans: number; inquiries: number };

export interface IStaffReport {
    from: string; to: string;
    rows: (StaffCounts & { id: string; name: string; role: string; status: string; total: number })[];
    totals: StaffCounts;
}

export interface IStaffLogRow {
    orderObjectId: string; orderId: string; status: string; note: string; at: string;
    by: { id: string; name: string; role: string };
}

export interface IPaymentsReport {
    from: string; to: string;
    summary: { received: number; orders: number; cod: number; online: number; refunded: { n: number; value: number }; due: { n: number; value: number } };
    methods: { method: string; orders: number; value: number }[];
    customers: { phone: string; name: string; orders: number; value: number; last: string }[];
    rows: { _id: string; orderId: string; total: number; paymentMethod: string; paymentStatus: string; status: string; paidAt: string; transactionId?: string; customer: string; phone: string }[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query<{ data: IPaymentsReport }, Range & { method?: string; search?: string; page?: number }>({
            query: (params) => ({ url: '/reports/payments', params }),
            providesTags: ['Analytics', 'Orders'],
        }),
        getSales: builder.query<{ data: ISalesReport }, Range & { division?: string; source?: string; paymentMethod?: string; places?: string }>({
            query: (params) => ({ url: '/reports/sales', params }),
            providesTags: ['Analytics', 'Orders'],
        }),
        getStaffReport: builder.query<{ data: IStaffReport }, Range>({
            query: (params) => ({ url: '/reports/staff', params }),
            providesTags: ['Analytics', 'Orders'],
        }),
        /** The signed-in staff member's own numbers and latest actions (My profile). */
        getMine: builder.query<{ data: { from: string; to: string; counts: (StaffCounts & { total: number }) | null; recent: IStaffLogRow[] } }, Range>({
            query: (params) => ({ url: '/reports/me', params }),
            providesTags: ['Analytics', 'Orders'],
        }),
        getStaffLog: builder.query<{ data: IStaffLogRow[]; meta: { total: number; page: number; limit: number; totalPages: number } }, Range & { actor?: string; page?: number }>({
            query: (params) => ({ url: '/reports/staff/log', params }),
            providesTags: ['Analytics', 'Orders'],
        }),
    }),
});

export const { useGetSalesQuery, useGetPaymentsQuery, useGetStaffReportQuery, useGetStaffLogQuery, useGetMineQuery } = reportApi;
