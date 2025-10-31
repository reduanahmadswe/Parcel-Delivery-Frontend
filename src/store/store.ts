import { IS_PROD } from '../constants/config';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import apiSlice from './api/apiSlice';
import authSlice, { logout } from './slices/authSlice';

// Create a noop storage for SSR compatibility
const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: unknown) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

// Use proper storage for client-side, noop for server-side
const storageToUse = typeof window !== 'undefined' ? storage : createNoopStorage();

// Persist configuration for auth slice
const authPersistConfig = {
    key: 'auth',
    storage: storageToUse,
    whitelist: ['user', 'token', 'refreshToken', 'isAuthenticated'],
};

// Persist configuration for API slice to cache data between page navigations
// Note: We only persist the 'queries' state which contains cached API responses
const apiPersistConfig = {
    key: 'api',
    storage: storageToUse,
    // Only persist queries (API cache responses) - this is what we need for caching
    whitelist: ['queries'],
    version: 1,
    // Increase throttle to reduce write frequency
    throttle: 1000,
    // Add debug in development
    debug: !IS_PROD,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedApiReducer = persistReducer(apiPersistConfig, apiSlice.reducer);

// Debug: Log when persist rehydrates (only in development)
if (!IS_PROD && typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        if (e.key === 'persist:api' || e.key === 'persist:auth') {
            console.log('🔄 [Redux Persist] Storage changed:', e.key, {
                oldValue: e.oldValue ? 'exists' : 'null',
                newValue: e.newValue ? 'exists' : 'null',
            });
        }
    });
}

// Middleware to clear API cache on logout
const logoutCacheResetMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    // Clear API cache when user logs out
    if (typeof action === 'object' && action !== null && 'type' in action && action.type === logout.type) {
        // Reset all RTK Query caches
        storeAPI.dispatch(apiSlice.util.resetApiState());
        
        // Clear persisted API data from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('persist:api');
        }
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        api: persistedApiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
        .concat(apiSlice.middleware)
        .concat(logoutCacheResetMiddleware),
    // Use centralized config
    devTools: !IS_PROD,
});

export const persistor = persistStore(store, null, () => {
    // Callback when rehydration is complete
    if (!IS_PROD && typeof window !== 'undefined') {
        console.log('✅ [Redux Persist] Rehydration complete!');
        console.log('📦 [Redux Persist] Auth state:', localStorage.getItem('persist:auth') ? 'exists' : 'missing');
        console.log('📦 [Redux Persist] API cache:', localStorage.getItem('persist:api') ? 'exists' : 'missing');
        
        // Check API cache size
        const apiCache = localStorage.getItem('persist:api');
        if (apiCache) {
            const sizeInKB = (apiCache.length / 1024).toFixed(2);
            console.log(`📦 [Redux Persist] API cache size: ${sizeInKB} KB`);
        }
    }
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

