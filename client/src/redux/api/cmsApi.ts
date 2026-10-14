import { baseApi } from './baseApi';

/** One page's content as the editor sees it. */
export interface CmsPageState {
    page: string;
    published: Record<string, unknown>;
    draft: Record<string, unknown> | null;
    hasDraft: boolean;
    draftAt?: string;
    draftBy?: { name?: string };
    publishedAt?: string;
    publishedBy?: { name?: string };
    versions: { index: number; at: string; by?: { name?: string } }[];
}

export interface MediaItem {
    _id: string;
    url: string;
    name: string;
    contentType: string;
    kind: 'image' | 'video';
    size: number;
    width: number | null;
    height: number | null;
    uploadedAt: string;
    uploadedBy: string;
}

/**
 * Site content — Admin → Site content. Backend: /api/page-content and /api/media
 * (super admin and admins).
 */
export const cmsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCmsPages: builder.query<{ data: Omit<CmsPageState, 'published' | 'draft' | 'versions'>[] }, void>({
            query: () => ({ url: '/page-content', method: 'GET' }),
            providesTags: ['PageContent'],
        }),
        getCmsPage: builder.query<{ data: CmsPageState }, string>({
            query: (page) => ({ url: `/page-content/${page}/edit`, method: 'GET' }),
            providesTags: (_r, _e, page) => [{ type: 'PageContent', id: page }],
        }),
        saveCmsDraft: builder.mutation<{ data: unknown }, { page: string; content: Record<string, unknown> }>({
            query: ({ page, content }) => ({ url: `/page-content/${page}/draft`, method: 'PUT', body: { content } }),
        }),
        publishCmsPage: builder.mutation<{ data: CmsPageState }, { page: string; content: Record<string, unknown> }>({
            query: ({ page, content }) => ({ url: `/page-content/${page}/publish`, method: 'POST', body: { content } }),
            invalidatesTags: (_r, _e, { page }) => ['PageContent', { type: 'PageContent', id: page }],
        }),
        discardCmsDraft: builder.mutation<{ data: CmsPageState | null }, string>({
            query: (page) => ({ url: `/page-content/${page}/discard`, method: 'POST' }),
            invalidatesTags: (_r, _e, page) => ['PageContent', { type: 'PageContent', id: page }],
        }),
        restoreCmsVersion: builder.mutation<{ data: CmsPageState }, { page: string; index: number }>({
            query: ({ page, index }) => ({ url: `/page-content/${page}/restore`, method: 'POST', body: { index } }),
            invalidatesTags: (_r, _e, { page }) => ['PageContent', { type: 'PageContent', id: page }],
        }),
        getMedia: builder.query<{ data: MediaItem[]; meta: { total: number; totalPages: number } }, { kind?: string; page?: number; limit?: number }>({
            query: (params) => ({ url: '/media', method: 'GET', params }),
            providesTags: ['PageContent'],
        }),
        deleteMedia: builder.mutation<unknown, string>({
            query: (id) => ({ url: `/media/${id}`, method: 'DELETE' }),
            invalidatesTags: ['PageContent'],
        }),
    }),
});

export const {
    useGetCmsPagesQuery,
    useGetCmsPageQuery,
    useSaveCmsDraftMutation,
    usePublishCmsPageMutation,
    useDiscardCmsDraftMutation,
    useRestoreCmsVersionMutation,
    useGetMediaQuery,
    useDeleteMediaMutation,
} = cmsApi;
