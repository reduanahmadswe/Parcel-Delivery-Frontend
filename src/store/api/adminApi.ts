import apiSlice from './apiSlice';

// Admin endpoints: users and parcels with fallback paths
const injectedApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<any[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                // Try /users first (backend standard route)
                const res = (await fetchWithBQ({ url: '/users?limit=1000', method: 'GET' } as any)) as any;
                if (!res.error && res.data) {
                    return { data: Array.isArray(res.data) ? res.data : res.data?.data || [] };
                }
                return { error: res.error as any };
            },
            providesTags: ['User'],
        }),

        getAllParcels: build.query<any[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                // Try /parcels first (backend standard route)
                const res = (await fetchWithBQ({ url: '/parcels?limit=1000', method: 'GET' } as any)) as any;
                if (!res.error && res.data) {
                    return { data: Array.isArray(res.data) ? res.data : res.data?.data || [] };
                }
                return { error: res.error as any };
            },
            providesTags: ['Parcel'],
        }),
    }),
    overrideExisting: false,
});

export const { useGetAllUsersQuery, useGetAllParcelsQuery } = injectedApi;

export default injectedApi;

