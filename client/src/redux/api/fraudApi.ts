import { baseApi } from './baseApi';

// Fraud check — every phone number's history, worked out live from the orders.
// Super admin, admin, manager, online sales. Backend: /api/fraud (modules/fraud).

export type FraudRisk = 'none' | 'low' | 'medium' | 'high';
export type FraudTab = 'open' | 'all' | 'refused' | 'cancelled' | 'high';

export interface IFraudCustomer {
    phone: string;
    name: string;
    orders: number;
    delivered: number;
    /** Parcels not taken at the door (came back from the courier). */
    refused: number;
    cancelled: number;
    returnedLater: number;
    open: number;
    spent: number;
    lastAt: string;
    success: number | null;
    risk: FraudRisk;
    openOrders: { _id: string; orderId: string; status: string; total: number }[];
    lastProblem: { _id: string; orderId: string; kind: 'refused' | 'cancelled'; reason: string; at: string } | null;
    problems: { _id: string; orderId: string; kind: 'refused' | 'cancelled'; reason: string; at: string }[];
}

export interface IFraudLookup extends IFraudCustomer {
    recent: { _id: string; orderId: string; status: string; total: number; createdAt: string; refused: boolean; reason: string }[];
}

export interface IFraudSummary { risky: number; high: number; open: number; refused: number; cancelled: number }

type Meta = { page: number; limit: number; total: number; totalPages: number };

export const fraudApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFraudCustomers: builder.query<{ data: { list: IFraudCustomer[]; summary: IFraudSummary }; meta: Meta }, { tab?: FraudTab; search?: string; page?: number; limit?: number }>({
            query: (params) => ({ url: '/fraud/customers', params }),
            providesTags: ['Fraud', 'Orders'],
        }),
        lookupFraudHistory: builder.query<{ data: IFraudLookup | null }, string>({
            query: (q) => ({ url: '/fraud/lookup', params: { q } }),
            providesTags: ['Fraud', 'Orders'],
            keepUnusedDataFor: 30,
        }),
        getFraudForOrder: builder.query<{ data: IFraudLookup | null }, string>({
            query: (orderId) => `/fraud/order/${orderId}`,
            providesTags: ['Fraud', 'Orders'],
        }),
    }),
});

export const { useGetFraudCustomersQuery, useLookupFraudHistoryQuery, useGetFraudForOrderQuery } = fraudApi;
