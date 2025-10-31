import apiSlice from './apiSlice';

const injectedApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<any[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                
                const res = (await fetchWithBQ({ url: '/users?limit=1000', method: 'GET' } as any)) as any;
                if (!res.error && res.data) {
                    return { data: Array.isArray(res.data) ? res.data : res.data?.data || [] };
                }
                return { error: res.error as any };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((user) => ({ type: 'User' as const, id: user._id })),
                          { type: 'User', id: 'LIST' },
                      ]
                    : [{ type: 'User', id: 'LIST' }],
            
            keepUnusedDataFor: Infinity,
        }),

        getAllParcels: build.query<any[], void>({
            async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
                
                const res = (await fetchWithBQ({ url: '/parcels?limit=1000', method: 'GET' } as any)) as any;
                if (!res.error && res.data) {
                    return { data: Array.isArray(res.data) ? res.data : res.data?.data || [] };
                }
                return { error: res.error as any };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((parcel) => ({ type: 'Parcel' as const, id: parcel._id })),
                          { type: 'Parcel', id: 'ADMIN_LIST' },
                          'Dashboard',
                          'Stats',
                      ]
                    : [{ type: 'Parcel', id: 'ADMIN_LIST' }, 'Dashboard', 'Stats'],
            
            keepUnusedDataFor: Infinity,
        }),

        updateUser: build.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
            
            async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    injectedApi.util.updateQueryData('getAllUsers', undefined, (draft) => {
                        const userIndex = draft.findIndex((user) => user._id === id);
                        if (userIndex !== -1) {
                            Object.assign(draft[userIndex], data);
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

        deleteUser: build.mutation<any, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
            
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    injectedApi.util.updateQueryData('getAllUsers', undefined, (draft) => {
                        return draft.filter((user) => user._id !== id);
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
    useGetAllUsersQuery, 
    useGetAllParcelsQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = injectedApi;

export default injectedApi;

