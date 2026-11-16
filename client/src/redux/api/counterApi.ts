import { baseApi } from './baseApi';

export interface CounterItem {
    _id: string;
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
    description?: string;
    icon?: string;
    order: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const counterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Public: active counters for homepage
        getCounters: builder.query<CounterItem[], void>({
            query: () => ({ url: '/counters', method: 'GET' }),
            transformResponse: (response: { data: CounterItem[] }) => response.data || [],
            providesTags: ['Counters'],
        }),

        // Admin: all counters including inactive
        getAdminCounters: builder.query<CounterItem[], void>({
            query: () => ({ url: '/counters/admin', method: 'GET' }),
            transformResponse: (response: { data: CounterItem[] }) => response.data || [],
            providesTags: ['Counters'],
        }),

        // Admin: update single counter
        updateCounter: builder.mutation<CounterItem, { id: string; data: Partial<CounterItem> }>({
            query: ({ id, data }) => ({
                url: `/counters/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Counters'],
        }),

        // Admin: bulk update counters (e.g. all 4 at once)
        bulkUpdateCounters: builder.mutation<CounterItem[], CounterItem[]>({
            query: (counters) => ({
                url: '/counters/bulk',
                method: 'PUT',
                body: { counters },
            }),
            invalidatesTags: ['Counters'],
        }),

        // Admin: create counter
        createCounter: builder.mutation<CounterItem, Partial<CounterItem>>({
            query: (data) => ({
                url: '/counters',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Counters'],
        }),

        // Admin: delete counter
        deleteCounter: builder.mutation<void, string>({
            query: (id) => ({
                url: `/counters/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Counters'],
        }),
    }),
});

export const {
    useGetCountersQuery,
    useGetAdminCountersQuery,
    useUpdateCounterMutation,
    useBulkUpdateCountersMutation,
    useCreateCounterMutation,
    useDeleteCounterMutation,
} = counterApi;
