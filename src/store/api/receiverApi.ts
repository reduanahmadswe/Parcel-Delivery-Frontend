import apiSlice from './apiSlice';
import { Parcel } from '@/types/GlobalTypeDefinitions';

const receiverApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        
        getReceiverParcels: build.query<Parcel[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    
                    let response;
                    let allParcels: Parcel[] = [];

                    try {
                        response = (await fetchWithBQ({ 
                            url: '/parcels/me?limit=10000', 
                            method: 'GET' 
                        } as any)) as any;
                        
                        if (!response.error && response.data) {
                            const data = response.data.data || response.data;
                            if (Array.isArray(data) && data.length > 10) {
                                allParcels = data;
                            }
                        }
                    } catch (err) {
                        
                    }

                    if (allParcels.length <= 10) {
                        try {
                            response = (await fetchWithBQ({ 
                                url: '/parcels/me/no-pagination?limit=10000', 
                                method: 'GET' 
                            } as any)) as any;
                            
                            if (!response.error && response.data) {
                                const data = response.data.data || response.data;
                                if (Array.isArray(data) && data.length > allParcels.length) {
                                    allParcels = data;
                                }
                            }
                        } catch (err) {
                            
                        }
                    }

                    if (allParcels.length <= 10) {
                        try {
                            const page1 = (await fetchWithBQ({ 
                                url: '/parcels/me?page=1&limit=10000', 
                                method: 'GET' 
                            } as any)) as any;
                            
                            const page2 = (await fetchWithBQ({ 
                                url: '/parcels/me?page=2&limit=10000', 
                                method: 'GET' 
                            } as any)) as any;

                            const data1 = page1.data?.data || page1.data || [];
                            const data2 = page2.data?.data || page2.data || [];
                            const combined = [...data1, ...data2];
                            
                            if (combined.length > allParcels.length) {
                                allParcels = combined;
                            }
                        } catch (err) {
                            
                        }
                    }

                    if (allParcels.length === 0) {
                        try {
                            response = (await fetchWithBQ({ 
                                url: '/parcels/me/no-pagination', 
                                method: 'GET' 
                            } as any)) as any;
                            
                            if (!response.error && response.data) {
                                allParcels = response.data.data || response.data || [];
                            }
                        } catch (err) {
                            
                        }
                    }

                    if (allParcels.length === 0) {
                        response = (await fetchWithBQ({ 
                            url: '/parcels/me', 
                            method: 'GET' 
                        } as any)) as any;
                        
                        if (!response.error && response.data) {
                            allParcels = response.data.data || response.data || [];
                        }
                    }

                    const finalParcels = Array.isArray(allParcels) ? allParcels : [];
                    return { data: finalParcels };
                    
                } catch (error) {
                    return { error: error as any };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((parcel) => ({ 
                              type: 'ReceiverParcel' as const, 
                              id: parcel._id 
                          })),
                          { type: 'ReceiverParcel', id: 'LIST' },
                          'ReceiverDashboard',
                          'ReceiverStats',
                      ]
                    : [
                          { type: 'ReceiverParcel', id: 'LIST' },
                          'ReceiverDashboard',
                          'ReceiverStats',
                      ],
            
            keepUnusedDataFor: Infinity,
        }),

        confirmDelivery: build.mutation<any, string>({
            query: (id) => ({
                url: `/parcels/${id}/confirm`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'ReceiverParcel', id },
                { type: 'ReceiverParcel', id: 'LIST' },
                'ReceiverDashboard',
                'ReceiverStats',
            ],
            
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    receiverApi.util.updateQueryData('getReceiverParcels', undefined, (draft) => {
                        const parcelIndex = draft.findIndex((parcel) => parcel._id === id);
                        if (parcelIndex !== -1) {
                            draft[parcelIndex].currentStatus = 'delivered' as any;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetReceiverParcelsQuery,
    useConfirmDeliveryMutation,
} = receiverApi;

export default receiverApi;
