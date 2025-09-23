import apiSlice from './apiSlice';

// Admin endpoints: users and parcels with fallback paths
const injectedApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<any[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                // Try admin/users then /users
                const res1 = (await fetchWithBQ({ url: '/admin/users', method: 'GET' } as any)) as any;
                if (!res1.error && res1.data) return { data: Array.isArray(res1.data) ? res1.data : res1.data?.data || [] };
                const res2 = (await fetchWithBQ({ url: '/users', method: 'GET' } as any)) as any;
                if (!res2.error && res2.data) return { data: Array.isArray(res2.data) ? res2.data : res2.data?.data || [] };
                return { error: (res2.error || res1.error) as any };
            },
            providesTags: ['User'],
        }),

        getAllParcels: build.query<any[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                const res1 = (await fetchWithBQ({ url: '/admin/parcels', method: 'GET' } as any)) as any;
                if (!res1.error && res1.data) return { data: Array.isArray(res1.data) ? res1.data : res1.data?.data || [] };
                const res2 = (await fetchWithBQ({ url: '/parcels', method: 'GET' } as any)) as any;
                if (!res2.error && res2.data) return { data: Array.isArray(res2.data) ? res2.data : res2.data?.data || [] };
                return { error: (res2.error || res1.error) as any };
            },
            providesTags: ['Parcel'],
        }),
    }),
    overrideExisting: false,
});

export const { useGetAllUsersQuery, useGetAllParcelsQuery } = injectedApi;

export default injectedApi;
