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
const apiPersistConfig = {
    key: 'api',
    storage: storageToUse,
    // Persist all API cache data
    whitelist: ['queries', 'mutations', 'provided', 'subscriptions'],
    // Set a version in case we need to migrate later
    version: 1,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedApiReducer = persistReducer(apiPersistConfig, apiSlice.reducer);

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
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

