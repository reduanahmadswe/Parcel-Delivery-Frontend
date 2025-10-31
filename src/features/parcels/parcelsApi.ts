import {
    ApiResponse,
    CreateParcelData,
    DashboardStats,
    PaginatedResponse,
    Parcel,
    ParcelFilters,
} from '../../types';
import { baseApi } from "../../services/featuresApi";

export const parcelsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getParcels: builder.query<PaginatedResponse<Parcel>, ParcelFilters & { page?: number; limit?: number }>({
            query: (params = {}) => ({
                url: '/parcels',
                params,
            }),
            providesTags: (result) => 
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Parcel' as const, id: _id })),
                        { type: 'Parcel', id: 'LIST' },
                    ]
                    : [{ type: 'Parcel', id: 'LIST' }],
            
            keepUnusedDataFor: 300,
        }),
        getParcelById: builder.query<ApiResponse<Parcel>, string>({
            query: (id) => `/parcels/${id}`,
            providesTags: (result, error, id) => [{ type: 'Parcel', id }],
            keepUnusedDataFor: 300,
        }),
        getParcelByTrackingId: builder.query<ApiResponse<Parcel>, string>({
            query: (trackingId) => `/parcels/track/${trackingId}`,
            providesTags: (result, error, trackingId) => [{ type: 'Parcel', id: trackingId }],
            keepUnusedDataFor: 300,
        }),
        getMyParcels: builder.query<PaginatedResponse<Parcel>, ParcelFilters & { page?: number; limit?: number }>({
            query: (params = {}) => ({
                url: '/parcels/me',
                params,
            }),
            providesTags: (result) => 
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Parcel' as const, id: _id })),
                        { type: 'Parcel', id: 'MY_LIST' },
                    ]
                    : [{ type: 'Parcel', id: 'MY_LIST' }],
            keepUnusedDataFor: 300,
        }),
        getUserParcels: builder.query<PaginatedResponse<Parcel>, { userId: string; page?: number; limit?: number }>({
            query: ({ userId, ...params }) => ({
                url: `/parcels/user/${userId}`,
                params,
            }),
            providesTags: (result, error, { userId }) => 
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Parcel' as const, id: _id })),
                        { type: 'Parcel', id: `USER_${userId}` },
                    ]
                    : [{ type: 'Parcel', id: `USER_${userId}` }],
            keepUnusedDataFor: 300,
        }),
        createParcel: builder.mutation<ApiResponse<Parcel>, CreateParcelData>({
            query: (parcelData) => ({
                url: '/parcels',
                method: 'POST',
                body: parcelData,
            }),
            
            invalidatesTags: [
                { type: 'Parcel', id: 'LIST' },
                { type: 'Parcel', id: 'MY_LIST' },
                'Dashboard',
                'Stats',
            ],
            
            async onQueryStarted(parcelData, { dispatch, queryFulfilled }) {
                const tempId = `temp-${Date.now()}`;
                const optimisticParcel: Parcel = {
                    _id: tempId,
                    trackingId: `PENDING-${Date.now()}`,
                    senderId: 'current-user',
                    senderInfo: {
                        name: '',
                        email: '',
                        phone: '',
                        address: parcelData.receiverAddress,
                    },
                    receiverInfo: {
                        name: parcelData.receiverName,
                        email: parcelData.receiverEmail,
                        phone: parcelData.receiverPhone,
                        address: parcelData.receiverAddress,
                    },
                    parcelDetails: parcelData.parcelDetails,
                    deliveryInfo: parcelData.deliveryInfo,
                    status: 'pending',
                    statusHistory: [],
                    paymentInfo: {
                        amount: 0,
                        status: 'pending',
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                const patchResult = dispatch(
                    parcelsApi.util.updateQueryData('getMyParcels', {}, (draft) => {
                        if (draft.data) {
                            draft.data.unshift(optimisticParcel);
                        }
                    })
                );

                try {
                    await queryFulfilled;

                    const timestamp = Date.now();
                    try {
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'MY_LIST', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_DASHBOARD', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_STATISTICS', timestamp } 
                        }));
                    } catch (err) {
                        console.warn('Failed to emit cache invalidation:', err);
                    }
                } catch {
                    
                    patchResult.undo();
                }
            },
        }),
        updateParcel: builder.mutation<ApiResponse<Parcel>, { id: string; data: Partial<Parcel> }>({
            query: ({ id, data }) => ({
                url: `/parcels/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Parcel', id },
                { type: 'Parcel', id: 'LIST' },
                { type: 'Parcel', id: 'MY_LIST' },
                'Dashboard',
                'Stats',
            ],
            
            async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
                
                const patchResult = dispatch(
                    parcelsApi.util.updateQueryData('getParcelById', id, (draft) => {
                        Object.assign(draft.data, data);
                    })
                );

                try {
                    const { data: result } = await queryFulfilled;
                    
                    dispatch(
                        parcelsApi.util.updateQueryData('getParcelById', id, (draft) => {
                            Object.assign(draft, result);
                        })
                    );

                    const timestamp = Date.now();
                    try {
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_DASHBOARD', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_STATISTICS', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'sender:parcels:', timestamp } 
                        }));
                    } catch (err) {
                        console.warn('Failed to emit cache invalidation:', err);
                    }
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateParcelStatus: builder.mutation<ApiResponse<Parcel>, { id: string; status: Parcel['status']; note?: string }>({
            query: ({ id, status, note }) => ({
                url: `/parcels/${id}/status`,
                method: 'PATCH',
                body: { status, note },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Parcel', id },
                { type: 'Parcel', id: 'LIST' },
                { type: 'Parcel', id: 'MY_LIST' },
                'Dashboard',
                'Stats',
            ],
            
            async onQueryStarted({ id, status, note }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    parcelsApi.util.updateQueryData('getParcelById', id, (draft) => {
                        if (draft.data) {
                            (draft.data as any).status = status;
                            if (note && draft.data.statusHistory) {
                                (draft.data.statusHistory as any[]).push({
                                    status,
                                    timestamp: new Date().toISOString(),
                                    note,
                                });
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;

                    const timestamp = Date.now();
                    try {
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_DASHBOARD', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_STATISTICS', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'sender:parcels:', timestamp } 
                        }));
                    } catch (err) {
                        console.warn('Failed to emit cache invalidation:', err);
                    }
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteParcel: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/parcels/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Parcel', id },
                { type: 'Parcel', id: 'LIST' },
                { type: 'Parcel', id: 'MY_LIST' },
                'Dashboard',
                'Stats',
            ],
            
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResults = [
                    dispatch(
                        parcelsApi.util.updateQueryData('getMyParcels', {}, (draft) => {
                            if (draft.data) {
                                draft.data = draft.data.filter(p => p._id !== id);
                            }
                        })
                    ),
                    dispatch(
                        parcelsApi.util.updateQueryData('getParcels', {}, (draft) => {
                            if (draft.data) {
                                draft.data = draft.data.filter(p => p._id !== id);
                            }
                        })
                    ),
                ];

                try {
                    await queryFulfilled;

                    const timestamp = Date.now();
                    try {
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_DASHBOARD', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_STATISTICS', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'sender:parcels:', timestamp } 
                        }));
                    } catch (err) {
                        console.warn('Failed to emit cache invalidation:', err);
                    }
                } catch {
                    patchResults.forEach(patch => patch.undo());
                }
            },
        }),
        cancelParcel: builder.mutation<ApiResponse<Parcel>, { id: string; reason: string }>({
            query: ({ id, reason }) => ({
                url: `/parcels/cancel/${id}`,
                method: 'PATCH',
                body: { reason },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Parcel', id },
                { type: 'Parcel', id: 'LIST' },
                { type: 'Parcel', id: 'MY_LIST' },
                'Dashboard',
                'Stats',
            ],
            
            async onQueryStarted({ id }, { queryFulfilled }) {
                try {
                    await queryFulfilled;

                    const timestamp = Date.now();
                    try {
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_DASHBOARD', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'SENDER_STATISTICS', timestamp } 
                        }));
                        window.dispatchEvent(new CustomEvent('cache-invalidated', { 
                            detail: { key: 'sender:parcels:', timestamp } 
                        }));
                    } catch (err) {
                        console.warn('Failed to emit cache invalidation:', err);
                    }
                } catch {
                    
                }
            },
        }),
        getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
            query: () => '/parcels/stats/dashboard',
            providesTags: ['Dashboard', 'Stats'],
            keepUnusedDataFor: 60, 
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
    useCancelParcelMutation,
    useGetDashboardStatsQuery,
} = parcelsApi

