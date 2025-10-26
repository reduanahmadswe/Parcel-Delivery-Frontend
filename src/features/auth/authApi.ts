import { AuthResponse, LoginCredentials, RegisterData, User } from '../../types';
import { baseApi } from '../../services/featuresApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation<AuthResponse, RegisterData>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),
        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: '/auth/refresh-token',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
        logout: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
        getProfile: builder.query<{ success: boolean; data: User }, void>({
            query: () => '/auth/profile',
            providesTags: ['Auth', 'User'],
        }),
        updateProfile: builder.mutation<{ success: boolean; data: User }, Partial<User>>({
            query: (updateData) => ({
                url: '/auth/profile',
                method: 'PATCH',
                body: updateData,
            }),
            invalidatesTags: ['Auth', 'User'],
        }),
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
} = authApi

