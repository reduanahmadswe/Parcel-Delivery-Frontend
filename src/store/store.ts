import { IS_PROD } from '@/lib/config';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import apiSlice from './api/apiSlice';
import authSlice from './slices/authSlice';

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

// Persist configuration for auth slice only
const authPersistConfig = {
    key: 'auth',
    storage: storageToUse,
    whitelist: ['user', 'token', 'refreshToken', 'isAuthenticated'],
};
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        api: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
    // Use centralized config
    devTools: !IS_PROD,
});
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
