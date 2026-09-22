import { baseApi } from './baseApi';

/**
 * Careers — job postings and the applications against them.
 *
 * Two audiences share this file. The `/jobs/public*` endpoints are open and
 * only ever return published postings; everything else needs an admin token.
 * Candidates never sign in, so `applyForJob` and `trackApplication` are public
 * too — identity there is the tracking ID, not a session.
 */
export const jobApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ── Public: career page ────────────────────────────────────────────
        getPublicJobs: builder.query({
            query: (params) => ({ url: '/jobs/public', params }),
            providesTags: ['Jobs'],
        }),
        getJobFilterOptions: builder.query({
            query: () => '/jobs/public/filters',
            providesTags: ['Jobs'],
        }),
        getPublicJob: builder.query({
            query: (slug) => `/jobs/public/${slug}`,
            providesTags: ['Jobs'],
        }),

        // ── Public: apply and track (no login) ─────────────────────────────
        applyForJob: builder.mutation({
            query: (data) => ({ url: '/applications', method: 'POST', body: data }),
            invalidatesTags: ['Applications'],
        }),
        trackApplication: builder.query({
            query: (trackingId) => `/applications/track/${trackingId}`,
        }),

        // ── Admin: postings ────────────────────────────────────────────────
        getJobs: builder.query({
            query: (params) => ({ url: '/jobs', params }),
            providesTags: ['Jobs'],
        }),
        getJob: builder.query({
            query: (id) => `/jobs/${id}`,
            providesTags: ['Jobs'],
        }),
        getJobStats: builder.query({
            query: () => '/jobs/stats',
            providesTags: ['Jobs', 'Applications'],
        }),
        createJob: builder.mutation({
            query: (data) => ({ url: '/jobs', method: 'POST', body: data }),
            invalidatesTags: ['Jobs'],
        }),
        updateJob: builder.mutation({
            query: ({ id, data }) => ({ url: `/jobs/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: ['Jobs'],
        }),
        updateJobStatus: builder.mutation({
            query: ({ id, status }) => ({ url: `/jobs/${id}/status`, method: 'PATCH', body: { status } }),
            invalidatesTags: ['Jobs'],
        }),
        duplicateJob: builder.mutation({
            query: (id) => ({ url: `/jobs/${id}/duplicate`, method: 'POST' }),
            invalidatesTags: ['Jobs'],
        }),
        deleteJob: builder.mutation({
            query: (id) => ({ url: `/jobs/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Jobs', 'Applications'],
        }),

        // ── Admin: applications ────────────────────────────────────────────
        getApplications: builder.query({
            query: (params) => ({ url: '/applications', params }),
            providesTags: ['Applications'],
        }),
        getApplication: builder.query({
            query: (id) => `/applications/${id}`,
            providesTags: ['Applications'],
        }),
        getApplicationStats: builder.query({
            query: () => '/applications/stats',
            providesTags: ['Applications'],
        }),
        updateApplication: builder.mutation({
            query: ({ id, data }) => ({ url: `/applications/${id}`, method: 'PATCH', body: data }),
            invalidatesTags: ['Applications'],
        }),
        updateApplicationStatus: builder.mutation({
            query: ({ id, status }) => ({ url: `/applications/${id}/status`, method: 'PATCH', body: { status } }),
            invalidatesTags: ['Applications'],
        }),
        bulkUpdateApplications: builder.mutation({
            query: ({ ids, status }) => ({ url: '/applications/bulk-status', method: 'PATCH', body: { ids, status } }),
            invalidatesTags: ['Applications'],
        }),
        deleteApplication: builder.mutation({
            query: (id) => ({ url: `/applications/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Applications', 'Jobs'],
        }),
    }),
});

export const {
    useGetPublicJobsQuery,
    useGetJobFilterOptionsQuery,
    useGetPublicJobQuery,
    useApplyForJobMutation,
    useTrackApplicationQuery,
    useLazyTrackApplicationQuery,
    useGetJobsQuery,
    useGetJobQuery,
    useGetJobStatsQuery,
    useCreateJobMutation,
    useUpdateJobMutation,
    useUpdateJobStatusMutation,
    useDuplicateJobMutation,
    useDeleteJobMutation,
    useGetApplicationsQuery,
    useGetApplicationQuery,
    useGetApplicationStatsQuery,
    useUpdateApplicationMutation,
    useUpdateApplicationStatusMutation,
    useBulkUpdateApplicationsMutation,
    useDeleteApplicationMutation,
} = jobApi;
