import { TokenManager } from '../../../shared/services/TokenManager';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout, refreshTokenSuccess, setLoading } from '../slices/authSlice';

import { API_BASE } from '../../../shared/constants/config';

const API_BASE_URL = API_BASE || 'https://parcel-delivery-api.onrender.com/api';

// Base query with authentication
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        // Get token from TokenManager (localStorage)
        const token = TokenManager.getAccessToken();
        
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            console.log("✅ Token added to request:", token.substring(0, 30) + '...');
        } else {
            console.warn("⚠️ No token available for request");
        }
        
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

// Base query with re-authentication
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // Set loading when making requests
    api.dispatch(setLoading(true));
    
    // Log the API call being made
    const url = typeof args === 'string' ? args : args.url;
    const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');
    console.log(`🌐 API Call: ${method} ${API_BASE_URL}${url}`);

    let result = await baseQuery(args, api, extraOptions);
    
    // Log the result
    if (result.error) {
        console.error(`❌ API Error:`, result.error);
    } else {
        console.log(`✅ API Success:`, result.data);
    }

    // Handle 401 unauthorized - try to refresh token
    if (result.error && result.error.status === 401) {
        console.log('🔄 401 Unauthorized - Attempting token refresh...');
        
        const refreshToken = TokenManager.getRefreshToken();
        
        if (!refreshToken) {
            console.error('❌ No refresh token available - logging out');
            api.dispatch(logout());
            api.dispatch(setLoading(false));
            
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return result;
        }

        try {
            // Try to refresh the token
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh-token',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            // Check if refresh was successful
            if (refreshResult.data) {
                const responseData = refreshResult.data as any;
                
                // Handle backend response structure: { success: true, data: { accessToken, refreshToken } }
                let newAccessToken: string | null = null;
                let newRefreshToken: string | null = null;

                if (responseData.success && responseData.data) {
                    // Backend returns: { success: true, data: { accessToken, refreshToken } }
                    newAccessToken = responseData.data.accessToken;
                    newRefreshToken = responseData.data.refreshToken;
                } else if (responseData.accessToken) {
                    // Direct token in response
                    newAccessToken = responseData.accessToken;
                    newRefreshToken = responseData.refreshToken;
                }

                if (newAccessToken) {
                    console.log('✅ Token refresh successful');
                    
                    // Update tokens in storage
                    TokenManager.setTokens(newAccessToken, newRefreshToken || refreshToken);
                    
                    // Update Redux state
                    api.dispatch(refreshTokenSuccess(newAccessToken));

                    // Retry original request with new token
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    throw new Error('No access token in refresh response');
                }
            } else if (refreshResult.error) {
                throw new Error('Refresh token request failed');
            }
        } catch (refreshError) {
            // Refresh failed, logout user
            console.error('❌ Token refresh failed:', refreshError);
            api.dispatch(logout());

            // Redirect to login if in browser
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    // Clear loading state
    api.dispatch(setLoading(false));

    return result;
};

// Create API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth', 'User', 'Parcel', 'Admin'],
    endpoints: () => ({}),
});

// Export hooks (will be generated by RTK Query)
export default apiSlice;

