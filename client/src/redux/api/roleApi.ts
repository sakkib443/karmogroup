import { baseApi } from "./baseApi";

export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Admin/Superadmin: list of all permission keys — GET /api/roles/permissions
        getPermissions: builder.query({
            query: () => ({ url: '/roles/permissions', method: 'GET' }),
            providesTags: ['Roles'],
        }),
        // Admin/Superadmin: every staff account — GET /api/roles/staff
        getStaff: builder.query({
            query: () => ({ url: '/roles/staff', method: 'GET' }),
            providesTags: ['Roles'],
        }),
        // Admin/Superadmin: add a staff account with its role — POST /api/roles/staff
        // (an admin may only create manager, online sales, agency and factory accounts)
        createStaff: builder.mutation({
            query: (body) => ({ url: '/roles/staff', method: 'POST', body }),
            invalidatesTags: ['Roles', 'Users'],
        }),
        // Admin/Superadmin: change a user's role (and a factory member's divisions) — PATCH /api/roles/:userId
        updateUserRole: builder.mutation({
            query: ({ userId, ...data }) => ({ url: `/roles/${userId}`, method: 'PATCH', body: data }),
            invalidatesTags: ['Roles', 'Users'],
        }),
    }),
});

export const {
    useGetPermissionsQuery,
    useGetStaffQuery,
    useCreateStaffMutation,
    useUpdateUserRoleMutation,
} = roleApi;
