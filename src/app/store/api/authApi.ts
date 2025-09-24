import { User } from '@/types/GlobalTypeDefinitions';
import { apiSlice } from './apiSlice';

// Auth API endpoints
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        login: builder.mutation<
            {
                success: boolean;
                data: {
                    user: User;
                    accessToken: string;
                    refreshToken: string;
                };
            },
            { email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        // Register
        register: builder.mutation<
            { success: boolean; message: string },
            {
                name: string;
                email: string;
                password: string;
                phone: string;
                role: 'sender' | 'receiver';
                address: {
                    street: string;
                    city: string;
                    state: string;
                    zipCode: string;
                    country: string;
                };
            }
        >({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),

        // Get current user
        getCurrentUser: builder.query<
            { success: boolean; data: User },
            void
        >({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),

        // Refresh token
        refreshToken: builder.mutation<
            { accessToken: string },
            { refreshToken: string }
        >({
            query: (data) => ({
                url: '/auth/refresh-token',
                method: 'POST',
                body: data,
            }),
        }),

        // Logout
        logout: builder.mutation<{ success: boolean }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useRefreshTokenMutation,
    useLogoutMutation,
} = authApiSlice;

