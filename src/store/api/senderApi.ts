import apiSlice from './apiSlice';
import { Parcel } from '@/types/GlobalTypeDefinitions';

const senderApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        
        getSenderParcels: build.query<Parcel[], void>({
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
                              type: 'SenderParcel' as const, 
                              id: parcel._id 
                          })),
                          { type: 'SenderParcel', id: 'LIST' },
                          'SenderDashboard',
                          'SenderStats',
                      ]
                    : [
                          { type: 'SenderParcel', id: 'LIST' },
                          'SenderDashboard',
                          'SenderStats',
                      ],
            
            keepUnusedDataFor: Infinity,
        }),

        // Sender cancel mutation: use PATCH /parcels/cancel/:id and include a reason
        cancelParcel: build.mutation<any, { id: string; reason?: string }>({
            query: ({ id, reason }) => ({
                url: `/parcels/cancel/${id}`,
                method: 'PATCH',
                body: { reason },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'SenderParcel', id: arg.id },
                { type: 'SenderParcel', id: 'LIST' },
                'SenderDashboard',
                'SenderStats',
            ],
            
            async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    senderApi.util.updateQueryData('getSenderParcels', undefined, (draft) => {
                        return draft.filter((parcel) => parcel._id !== id);
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
    useGetSenderParcelsQuery,
    useCancelParcelMutation,
} = senderApi;

export default senderApi;
