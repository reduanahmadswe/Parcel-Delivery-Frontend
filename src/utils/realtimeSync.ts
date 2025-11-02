

import { useEffect, useRef } from 'react';

export interface RealtimeSyncOptions {
  
  onRefresh: (force?: boolean) => void | Promise<void>;

  pollingInterval?: number;

  cacheKeys?: string[];

  enablePolling?: boolean;

  enableVisibilityRefresh?: boolean;

  enableCacheListener?: boolean;
}

export function useRealtimeSync(options: RealtimeSyncOptions) {
  const {
    onRefresh,
    pollingInterval = 30000, 
    cacheKeys = [],
    enablePolling = true,
    enableVisibilityRefresh = true,
    enableCacheListener = true,
  } = options;

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enableCacheListener) return;

    const handleCacheInvalidation = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; timestamp: number }>;
      const { key } = customEvent.detail;

      const shouldRefresh = cacheKeys.some(cacheKey => 
        key === cacheKey || key.includes(cacheKey)
      );

      if (shouldRefresh) {
        onRefresh(true); 
      }
    };

    window.addEventListener('cache-invalidated', handleCacheInvalidation);

    return () => {
      window.removeEventListener('cache-invalidated', handleCacheInvalidation);
    };
  }, [enableCacheListener, cacheKeys, onRefresh]);

  useEffect(() => {
    if (!enablePolling) return;

    pollingIntervalRef.current = setInterval(() => {
      onRefresh(true); 
    }, pollingInterval);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [enablePolling, pollingInterval, onRefresh]);

  useEffect(() => {
    if (!enableVisibilityRefresh) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        
        onRefresh(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableVisibilityRefresh, onRefresh]);
}

export function emitCacheInvalidation(keys: string | string[]) {
  const timestamp = Date.now();
  const keyArray = Array.isArray(keys) ? keys : [keys];

  keyArray.forEach(key => {
    try {
      window.dispatchEvent(new CustomEvent('cache-invalidated', {
        detail: { key, timestamp }
      }));
    } catch (err) {
      console.warn(`Failed to emit cache invalidation for key: ${key}`, err);
    }
  });
}

export const SENDER_CACHE_KEYS = {
  DASHBOARD: 'SENDER_DASHBOARD',
  PARCELS: 'sender:parcels:',
  STATISTICS: 'SENDER_STATISTICS',
  MY_LIST: 'MY_LIST',
} as const;

export function invalidateAllSenderCaches() {
  emitCacheInvalidation([
    SENDER_CACHE_KEYS.DASHBOARD,
    SENDER_CACHE_KEYS.STATISTICS,
    SENDER_CACHE_KEYS.MY_LIST,
    SENDER_CACHE_KEYS.PARCELS,
  ]);
}

export const RECEIVER_CACHE_KEYS = {
  DASHBOARD: 'RECEIVER_DASHBOARD',
  PARCELS: 'receiver:parcels:',
  STATISTICS: 'RECEIVER_STATISTICS',
} as const;

export function invalidateAllReceiverCaches() {
  emitCacheInvalidation([
    RECEIVER_CACHE_KEYS.DASHBOARD,
    RECEIVER_CACHE_KEYS.STATISTICS,
    RECEIVER_CACHE_KEYS.PARCELS,
  ]);
}

export function clearReceiverLocalCache() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith('receiver:') || key.includes('RECEIVER')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Failed to clear receiver local cache', err);
  }
}
