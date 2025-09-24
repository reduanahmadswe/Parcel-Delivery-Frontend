import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE } from '../constants/config';

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers, { getState }) => {
        // Type assertion for the persisted state
        const state = getState() as { auth: { token: string | null } }
        const token = state.auth.token
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        headers.set('Content-Type', 'application/json')
        return headers
    },
})

import { apiSlice } from '../../app/store/api/apiSlice';

// Re-export the store-registered apiSlice as `baseApi` to keep backwards compatibility
export const baseApi = apiSlice;

