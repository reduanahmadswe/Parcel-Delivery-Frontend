import { TokenManager } from '../../services/TokenManager';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout, refreshTokenSuccess, setLoading } from '../slices/authSlice';

const API_BASE_URL = 'https://parcel-delivery-api.onrender.com/api';

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
        
        const token = TokenManager.getAccessToken();
        
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    
    api.dispatch(setLoading(true));
    
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = TokenManager.getRefreshToken();
        
        if (!refreshToken) {
            api.dispatch(logout());
            api.dispatch(setLoading(false));
            
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return result;
        }

        try {
            
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh-token',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const responseData = refreshResult.data as any;

                let newAccessToken: string | null = null;
                let newRefreshToken: string | null = null;

                if (responseData.success && responseData.data) {
                    
                    newAccessToken = responseData.data.accessToken;
                    newRefreshToken = responseData.data.refreshToken;
                } else if (responseData.accessToken) {
                    
                    newAccessToken = responseData.accessToken;
                    newRefreshToken = responseData.refreshToken;
                }

                if (newAccessToken) {
                    
                    TokenManager.setTokens(newAccessToken, newRefreshToken || refreshToken);

                    api.dispatch(refreshTokenSuccess(newAccessToken));

                    result = await baseQuery(args, api, extraOptions);
                } else {
                    throw new Error('No access token in refresh response');
                }
            } else if (refreshResult.error) {
                throw new Error('Refresh token request failed');
            }
        } catch (refreshError) {
            
            api.dispatch(logout());

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    api.dispatch(setLoading(false));

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'Auth', 
        'User', 
        'Parcel', 
        'Admin', 
        'Dashboard', 
        'Stats',
        'SenderParcel',
        'SenderDashboard',
        'SenderStats',
        'ReceiverParcel',
        'ReceiverDashboard',
        'ReceiverStats',
    ],
    
    keepUnusedDataFor: Infinity, 
    refetchOnMountOrArgChange: false, 
    refetchOnReconnect: true, 
    refetchOnFocus: false, 
    endpoints: () => ({}),
});

export default apiSlice;

