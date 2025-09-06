import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import apiSlice from './api/apiSlice';
import authSlice from './slices/authSlice';

// Persist configuration for auth slice only
const authPersistConfig = {
    key: 'auth',
    storage,
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
    devTools: process.env.NODE_ENV !== 'production',
});
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
