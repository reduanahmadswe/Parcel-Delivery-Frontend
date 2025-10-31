/**
 * Real-time Data Synchronization Utility
 * 
 * This utility provides real-time data synchronization across all sender pages
 * without requiring manual page reloads. It includes:
 * 
 * 1. Automatic polling (every 30 seconds)
 * 2. Page Visibility API (refresh when user returns to tab)
 * 3. Cache invalidation events
 * 4. Manual refresh capability
 */

import { useEffect, useRef } from 'react';

export interface RealtimeSyncOptions {
  /** Callback function to fetch/refresh data */
  onRefresh: (force?: boolean) => void | Promise<void>;
  
  /** Polling interval in milliseconds (default: 30000 = 30 seconds) */
  pollingInterval?: number;
  
  /** Cache keys to listen for invalidation events */
  cacheKeys?: string[];
  
  /** Enable automatic polling (default: true) */
  enablePolling?: boolean;
  
  /** Enable page visibility refresh (default: true) */
  enableVisibilityRefresh?: boolean;
  
  /** Enable cache invalidation listener (default: true) */
  enableCacheListener?: boolean;
}

/**
 * Custom hook for real-time data synchronization
 * 
 * @example
 * ```typescript
 * useRealtimeSync({
 *   onRefresh: fetchParcels,
 *   pollingInterval: 30000, // 30 seconds
 *   cacheKeys: ['SENDER_DASHBOARD', 'SENDER_PARCELS'],
 * });
 * ```
 */
export function useRealtimeSync(options: RealtimeSyncOptions) {
  const {
    onRefresh,
    pollingInterval = 30000, // 30 seconds default
    cacheKeys = [],
    enablePolling = true,
    enableVisibilityRefresh = true,
    enableCacheListener = true,
  } = options;

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cache invalidation listener
  useEffect(() => {
    if (!enableCacheListener) return;

    const handleCacheInvalidation = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; timestamp: number }>;
      const { key } = customEvent.detail;

      // Check if this cache key matches any of our listened keys
      const shouldRefresh = cacheKeys.some(cacheKey => 
        key === cacheKey || key.includes(cacheKey)
      );

      if (shouldRefresh) {
        onRefresh(true); // Force refresh
      }
    };

    window.addEventListener('cache-invalidated', handleCacheInvalidation);

    return () => {
      window.removeEventListener('cache-invalidated', handleCacheInvalidation);
    };
  }, [enableCacheListener, cacheKeys, onRefresh]);

  // Polling mechanism
  useEffect(() => {
    if (!enablePolling) return;

    pollingIntervalRef.current = setInterval(() => {
      onRefresh(true); // Force refresh to get latest data
    }, pollingInterval);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [enablePolling, pollingInterval, onRefresh]);

  // Page Visibility API - refresh when user returns to tab
  useEffect(() => {
    if (!enableVisibilityRefresh) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to the tab, refresh data
        onRefresh(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableVisibilityRefresh, onRefresh]);
}

/**
 * Emit a cache invalidation event
 * 
 * @example
 * ```typescript
 * // After creating a parcel
 * emitCacheInvalidation(['SENDER_DASHBOARD', 'SENDER_PARCELS', 'SENDER_STATISTICS']);
 * ```
 */
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

/**
 * Default cache keys for sender pages
 */
export const SENDER_CACHE_KEYS = {
  DASHBOARD: 'SENDER_DASHBOARD',
  PARCELS: 'sender:parcels:',
  STATISTICS: 'SENDER_STATISTICS',
  MY_LIST: 'MY_LIST',
} as const;

/**
 * Emit all sender-related cache invalidation events
 */
export function invalidateAllSenderCaches() {
  emitCacheInvalidation([
    SENDER_CACHE_KEYS.DASHBOARD,
    SENDER_CACHE_KEYS.STATISTICS,
    SENDER_CACHE_KEYS.MY_LIST,
    SENDER_CACHE_KEYS.PARCELS,
  ]);
}
