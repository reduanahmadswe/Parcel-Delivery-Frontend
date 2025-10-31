import { User } from '@/types/GlobalTypeDefinitions';
import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
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

        getCurrentUser: builder.query<
            { success: boolean; data: User },
            void
        >({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),

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

