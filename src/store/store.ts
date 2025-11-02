import { IS_PROD } from '../constants/config';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import apiSlice from './api/apiSlice';
import authSlice, { logout } from './slices/authSlice';
import receiverSlice from './slices/receiverSlice';

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

const storageToUse = typeof window !== 'undefined' ? storage : createNoopStorage();

const authPersistConfig = {
    key: 'auth',
    storage: storageToUse,
    whitelist: ['user', 'token', 'refreshToken', 'isAuthenticated'],
};

const apiPersistConfig = {
    key: 'api',
    storage: storageToUse,
    
    whitelist: ['queries'],
    version: 1,
    
    throttle: 1000,
    
    debug: !IS_PROD,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedApiReducer = persistReducer(apiPersistConfig, apiSlice.reducer);
const receiverPersistConfig = {
    key: 'receiver',
    storage: storageToUse,
    whitelist: ['parcels', 'pagination', 'stats', 'lastUpdated'],
};

const persistedReceiverReducer = persistReducer(receiverPersistConfig, receiverSlice);

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

const logoutCacheResetMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    
    if (typeof action === 'object' && action !== null && 'type' in action && action.type === logout.type) {
        
        storeAPI.dispatch(apiSlice.util.resetApiState());

        if (typeof window !== 'undefined') {
            localStorage.removeItem('persist:api');
            try {
                // remove any receiver-related cached keys (e.g. receiver:dashboard:...)
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    if (!key) continue;
                    if (key === 'persist:receiver' || key.startsWith('receiver:') || key.includes('RECEIVER')) {
                        localStorage.removeItem(key);
                    }
                }
            } catch (err) {
                console.warn('[logoutCacheResetMiddleware] failed to clear receiver cache', err);
            }
        }
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        api: persistedApiReducer,
        receiver: persistedReceiverReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
        .concat(apiSlice.middleware)
        .concat(logoutCacheResetMiddleware),
    
    devTools: !IS_PROD,
});

export const persistor = persistStore(store, null, () => {
    
    if (!IS_PROD && typeof window !== 'undefined') {
        console.log('✅ [Redux Persist] Rehydration complete!');
        console.log('📦 [Redux Persist] Auth state:', localStorage.getItem('persist:auth') ? 'exists' : 'missing');
        console.log('📦 [Redux Persist] API cache:', localStorage.getItem('persist:api') ? 'exists' : 'missing');

        const apiCache = localStorage.getItem('persist:api');
        if (apiCache) {
            const sizeInKB = (apiCache.length / 1024).toFixed(2);
            console.log(`📦 [Redux Persist] API cache size: ${sizeInKB} KB`);
        }
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

