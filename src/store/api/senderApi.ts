import apiSlice from './apiSlice';
import { Parcel } from '@/types/GlobalTypeDefinitions';

// Sender-specific endpoints with infinite caching
const senderApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        // Get all sender's parcels
        getSenderParcels: build.query<Parcel[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    // Try multiple endpoints to get all data (fallback strategy)
                    let response;
                    let allParcels: Parcel[] = [];

                    // Method 1: Try with high limit parameter
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
                        // Method 1 failed, continue to next method
                    }

                    // Method 2: Try no-pagination with limit
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
                            // Method 2 failed, continue
                        }
                    }

                    // Method 3: Try pagination with multiple pages
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
                            // Method 3 failed, continue
                        }
                    }

                    // Method 4: Fallback to no-pagination
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
                            // All methods failed
                        }
                    }

                    // Final fallback: simple /parcels/me
                    if (allParcels.length === 0) {
                        response = (await fetchWithBQ({ 
                            url: '/parcels/me', 
                            method: 'GET' 
                        } as any)) as any;
                        
                        if (!response.error && response.data) {
                            allParcels = response.data.data || response.data || [];
                        }
                    }

                    // Ensure array
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
            // Keep sender data cached until logout - no expiry
            keepUnusedDataFor: Infinity,
        }),

        // Cancel parcel mutation
        cancelParcel: build.mutation<any, string>({
            query: (id) => ({
                url: `/parcels/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'SenderParcel', id },
                { type: 'SenderParcel', id: 'LIST' },
                'SenderDashboard',
                'SenderStats',
            ],
            // Optimistic delete
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
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
