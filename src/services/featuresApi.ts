import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'https://parcel-delivery-api.onrender.com/api';

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        
        const state = getState() as { auth: { token: string | null } }
        const token = state.auth.token
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        headers.set('Content-Type', 'application/json')
        return headers
    },
})

import { apiSlice } from '../store/api/apiSlice';

export const baseApi = apiSlice;

