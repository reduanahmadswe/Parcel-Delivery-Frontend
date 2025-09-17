import {
    ApiResponse,
    CreateParcelData,
    DashboardStats,
    PaginatedResponse,
    Parcel,
    ParcelFilters,
} from '../../types';
import { baseApi } from '../api';

export const parcelsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getParcels: builder.query<PaginatedResponse<Parcel>, ParcelFilters & { page?: number; limit?: number }>({
            query: (params = {}) => ({
                url: '/parcels',
                params,
            }),
            providesTags: ['Parcel'],
        }),
        getParcelById: builder.query<ApiResponse<Parcel>, string>({
            query: (id) => `/parcels/${id}`,
            providesTags: (result, error, id) => [{ type: 'Parcel', id }],
        }),
        getParcelByTrackingId: builder.query<ApiResponse<Parcel>, string>({
            query: (trackingId) => `/parcels/track/${trackingId}`,
            providesTags: (result, error, trackingId) => [{ type: 'Parcel', id: trackingId }],
        }),
        getMyParcels: builder.query<PaginatedResponse<Parcel>, ParcelFilters & { page?: number; limit?: number }>({
            query: (params = {}) => ({
                url: '/parcels/me',
                params,
            }),
            providesTags: ['Parcel'],
        }),
        getUserParcels: builder.query<PaginatedResponse<Parcel>, { userId: string; page?: number; limit?: number }>({
            query: ({ userId, ...params }) => ({
                url: `/parcels/user/${userId}`,
                params,
            }),
            providesTags: (result, error, { userId }) => [{ type: 'Parcel', id: `user-${userId}` }],
        }),
        createParcel: builder.mutation<ApiResponse<Parcel>, CreateParcelData>({
            query: (parcelData) => ({
                url: '/parcels',
                method: 'POST',
                body: parcelData,
            }),
            invalidatesTags: ['Parcel'],
        }),
        updateParcel: builder.mutation<ApiResponse<Parcel>, { id: string; data: Partial<Parcel> }>({
            query: ({ id, data }) => ({
                url: `/parcels/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Parcel', id }],
        }),
        updateParcelStatus: builder.mutation<ApiResponse<Parcel>, { id: string; status: Parcel['status']; note?: string }>({
            query: ({ id, status, note }) => ({
                url: `/parcels/${id}/status`,
                method: 'PATCH',
                body: { status, note },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Parcel', id }],
        }),
        deleteParcel: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/parcels/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Parcel', id }],
        }),
        getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
            query: () => '/parcels/stats/dashboard',
            providesTags: ['Parcel'],
        }),
    }),
})

export const {
    useGetParcelsQuery,
    useGetParcelByIdQuery,
    useGetParcelByTrackingIdQuery,
    useGetMyParcelsQuery,
    useGetUserParcelsQuery,
    useCreateParcelMutation,
    useUpdateParcelMutation,
    useUpdateParcelStatusMutation,
    useDeleteParcelMutation,
    useGetDashboardStatsQuery,
} = parcelsApi
