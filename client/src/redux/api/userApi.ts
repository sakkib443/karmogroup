import { baseApi } from "./baseApi";

/** A buyer as Customers lists them, with their orders. */
export interface ICustomerRow {
    _id: string; firstName?: string; lastName?: string; email?: string; phone?: string; status: string; role: string;
    loyaltyPoints?: number; defaultDiscount?: number; createdAt: string;
    orders: number; placed: number; delivered: number; cancelled: number; spent: number;
    firstOrderAt?: string; lastOrderAt?: string; joinedByOrder: boolean;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ===== User-facing endpoints =====
        getMe: builder.query({
            query: () => ({
                url: '/users/me',
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/users/me',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        getMyAddresses: builder.query({
            query: () => ({
                url: '/users/addresses',
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        addAddress: builder.mutation({
            query: (data) => ({
                url: '/users/addresses',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        updateAddress: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/users/addresses/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `/users/addresses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        getWishlist: builder.query({
            query: () => ({
                url: '/users/wishlist',
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        toggleWishlist: builder.mutation({
            query: (productId) => ({
                url: '/users/wishlist',
                method: 'POST',
                body: { productId },
            }),
            invalidatesTags: ['Users'],
        }),
        // Merge a guest's local wishlist into the user's server wishlist (on login)
        mergeWishlist: builder.mutation({
            query: (productIds: string[]) => ({
                url: '/users/wishlist/merge',
                method: 'POST',
                body: { productIds },
            }),
            invalidatesTags: ['Users'],
        }),
        // Public, read-only view of another user's wishlist (share link)
        getSharedWishlist: builder.query({
            query: (userId: string) => ({
                url: `/users/wishlist/shared/${userId}`,
                method: 'GET',
            }),
        }),

        // ===== Admin endpoints =====
        getAdminUsers: builder.query({
            query: (params) => ({
                url: '/users/admin/all',
                method: 'GET',
                params,
            }),
            providesTags: ['Users'],
        }),
        // The one customer on file for an exact mobile number, or null — for "New order".
        // Admins and editors; editors never get the customer list itself.
        lookupCustomer: builder.query<{ data: any | null }, string>({
            query: (phone) => ({ url: '/users/admin/lookup', method: 'GET', params: { phone } }),
            providesTags: ['Users'],
        }),
        getAdminUserById: builder.query({
            query: (id) => ({
                url: `/users/admin/${id}`,
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        getAdminUserStats: builder.query({
            query: () => ({
                url: '/users/admin/stats',
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        // Admin: change an account — details, status, role, divisions, a new password
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/users/admin/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Users', 'Roles'],
        }),
        // Admin / super admin: add any account (customer or staff) — POST /api/users/admin
        createUser: builder.mutation({
            query: (data) => ({
                url: '/users/admin',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users', 'Roles'],
        }),
        // Buyers with their order counts — who ordered, how often, who never did.
        getCustomers: builder.query<
            { data: { customers: ICustomerRow[]; stats: { total: number; ordered: number; never: number; repeat: number; fromOrders: number; newThisMonth: number } }; meta: { total: number; page: number; limit: number; totalPages: number } },
            { page?: number; limit?: number; search?: string; status?: string; orders?: string; joined?: string; sort?: string }
        >({
            query: (params) => ({ url: '/users/admin/customers', method: 'GET', params }),
            providesTags: ['Users', 'Orders'],
        }),
        // Admin adds a buyer by hand (phone orders, walk-ins)
        createCustomer: builder.mutation({
            query: (data) => ({
                url: '/users/admin/customers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/admin/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users', 'Roles'],
        }),
    }),
});

export const {
    // User hooks
    useGetMeQuery,
    useUpdateProfileMutation,
    useGetMyAddressesQuery,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useGetWishlistQuery,
    useToggleWishlistMutation,
    useMergeWishlistMutation,
    useGetSharedWishlistQuery,
    useGetCustomersQuery,
    // Admin hooks
    useGetAdminUsersQuery,
    useLookupCustomerQuery,
    useGetAdminUserByIdQuery,
    useGetAdminUserStatsQuery,
    useUpdateUserMutation,
    useCreateUserMutation,
    useCreateCustomerMutation,
    useDeleteUserMutation,
} = userApi;

