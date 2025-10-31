

import { useState, useCallback, useRef } from 'react';
import type { AppDispatch } from '../store/store';

type CacheInvalidationEvent = CustomEvent<{ key: string; type: 'parcel' | 'user' }>;

let storeDispatch: AppDispatch | null = null;

export function setStoreDispatch(dispatch: AppDispatch) {
  storeDispatch = dispatch;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  loading: boolean;
}

interface CacheConfig {
  ttl?: number; 
  staleTime?: number;
  useLocalStorage?: boolean;
}

const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_STALE_TIME = 2 * 60 * 1000; 
const STORAGE_PREFIX = 'parcel_cache_';
const CACHE_VERSION_KEY = 'parcel_cache_version';
const CURRENT_CACHE_VERSION = '1.0'; 

class AdminDataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: config.ttl || DEFAULT_TTL,
      staleTime: config.staleTime || DEFAULT_STALE_TIME,
      useLocalStorage: config.useLocalStorage !== false, 
    };

    if (this.config.useLocalStorage) {
      this.checkCacheVersion();
      this.loadFromLocalStorage();
    }
  }

  private checkCacheVersion(): void {
    try {
      const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
      
      if (storedVersion !== CURRENT_CACHE_VERSION) {
        
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
        cacheKeys.forEach(key => localStorage.removeItem(key));

        localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
      }
    } catch (error) {
      console.warn('Failed to check cache version:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
      
      cacheKeys.forEach(storageKey => {
        const cacheKey = storageKey.replace(STORAGE_PREFIX, '');
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
          try {
            const entry: CacheEntry<any> = JSON.parse(stored);

            const age = Date.now() - entry.timestamp;
            if (age <= this.config.ttl!) {
              this.cache.set(cacheKey, entry);
            } else {
              
              localStorage.removeItem(storageKey);
            }
          } catch (err) {
            
            localStorage.removeItem(storageKey);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  private saveToLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
    if (!this.config.useLocalStorage) return;
    
    try {
      const storageKey = STORAGE_PREFIX + key;
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.warn(`Failed to save cache to localStorage: ${key}`, error);
      
      this.clearOldLocalStorageEntries();
    }
  }

  private clearOldLocalStorageEntries(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));

      const entries = cacheKeys.map(key => {
        try {
          const data = localStorage.getItem(key);
          const entry = data ? JSON.parse(data) : null;
          return { key, timestamp: entry?.timestamp || 0 };
        } catch {
          return { key, timestamp: 0 };
        }
      });

      entries.sort((a, b) => a.timestamp - b.timestamp);

      const toRemove = Math.ceil(entries.length * 0.3);
      entries.slice(0, toRemove).forEach(entry => {
        localStorage.removeItem(entry.key);
      });
    } catch (error) {
      console.warn('Failed to clear old localStorage entries:', error);
    }
  }

  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      loading: false,
    };
    
    this.cache.set(key, entry);
    this.saveToLocalStorage(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.config.ttl!) {
      this.cache.delete(key);
      
      if (this.config.useLocalStorage) {
        localStorage.removeItem(STORAGE_PREFIX + key);
      }
      return null;
    }

    return entry.data as T;
  }

  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;

    const age = Date.now() - entry.timestamp;
    return age > this.config.staleTime!;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(key: string): void {
    this.cache.delete(key);
    if (this.config.useLocalStorage) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    }

    this.emitCacheInvalidation(key);
  }

  clearAll(): void {
    this.cache.clear();
    if (this.config.useLocalStorage) {
      try {
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
        cacheKeys.forEach(key => localStorage.removeItem(key));

        localStorage.removeItem(CACHE_VERSION_KEY);
      } catch (error) {
        console.warn('Failed to clear localStorage cache:', error);
      }
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    if (this.config.useLocalStorage) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    }

    this.emitCacheInvalidation(key);
  }

  private emitCacheInvalidation(key: string): void {
    try {
      const event = new CustomEvent('cache-invalidated', { 
        detail: { key, timestamp: Date.now() } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.warn('Failed to emit cache invalidation event:', error);
    }
  }

  isLoading(key: string): boolean {
    const entry = this.cache.get(key);
    return entry?.loading || false;
  }

  setLoading(key: string, loading: boolean): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.loading = loading;
    } else {
      this.cache.set(key, {
        data: null,
        timestamp: Date.now(),
        loading,
      });
    }
  }
}

export const adminCache = new AdminDataCache({
  ttl: 7 * 24 * 60 * 60 * 1000, 
  staleTime: 5 * 60 * 1000, 
  useLocalStorage: true, 
});

export const CACHE_KEYS = {
  
  PARCELS: 'admin:parcels',
  USERS: 'admin:users',
  PARCEL_DETAILS: (id: string | number) => `admin:parcel:${id}`,
  USER_DETAILS: (id: string | number) => `admin:user:${id}`,
  PARCEL_STATUS_LOG: (id: string | number) => `admin:parcel:${id}:status-log`,

  SENDER_PARCELS: (page: number, filters?: string) => `sender:parcels:${page}:${filters || 'all'}`,
  SENDER_DASHBOARD: 'sender:dashboard:stats',
  SENDER_STATISTICS: 'sender:statistics',
};

export function useCachedData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  options: { skip?: boolean; refetchOnMount?: boolean } = {}
) {
  const [data, setData] = useState<T | null>(() => adminCache.get<T>(cacheKey));
  const [loading, setLoading] = useState(() => !adminCache.has(cacheKey));
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(false);
  const fetchingRef = useRef(false);

  const fetchData = useCallback(
    async (force: boolean = false) => {
      if (options.skip || fetchingRef.current) return;

      if (!force && adminCache.has(cacheKey)) {
        const cachedData = adminCache.get<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);

          if (adminCache.isStale(cacheKey)) {
            fetchData(true);
          }
          return;
        }
      }

      try {
        fetchingRef.current = true;
        setLoading(true);
        setError(null);
        adminCache.setLoading(cacheKey, true);

        const result = await fetchFn();

        adminCache.set(cacheKey, result);
        adminCache.setLoading(cacheKey, false);
        setData(result);
      } catch (err) {
        setError(err as Error);
        adminCache.setLoading(cacheKey, false);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    },
    [cacheKey, fetchFn, options.skip]
  );

  useCallback(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      fetchData(options.refetchOnMount);
    }
  }, [fetchData, options.refetchOnMount])();

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    adminCache.invalidate(cacheKey);
    return fetchData(true);
  }, [cacheKey, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
    isCached: adminCache.has(cacheKey),
  };
}

export function invalidateRelatedCaches(type: 'parcel' | 'user' | 'sender-parcel', id?: string | number) {
  
  if (type === 'parcel') {
    
    adminCache.invalidate(CACHE_KEYS.PARCELS);

    adminCache.invalidate(CACHE_KEYS.SENDER_DASHBOARD);
    adminCache.invalidate(CACHE_KEYS.SENDER_STATISTICS);

    clearCachePattern('sender:parcels:');
    
    if (id) {
      adminCache.invalidate(CACHE_KEYS.PARCEL_DETAILS(id));
      adminCache.invalidate(CACHE_KEYS.PARCEL_STATUS_LOG(id));
    }

    if (storeDispatch) {
      
      import('../store/api/apiSlice').then(({ apiSlice }) => {
        storeDispatch!(apiSlice.util.invalidateTags(['Parcel']));
      });
    } else {
      console.warn('⚠️ Store dispatch not available - RTK Query cache not invalidated');
    }
    
  } else if (type === 'user') {
    adminCache.invalidate(CACHE_KEYS.USERS);
    if (id) {
      adminCache.invalidate(CACHE_KEYS.USER_DETAILS(id));
    }

    if (storeDispatch) {
      import('../store/api/apiSlice').then(({ apiSlice }) => {
        storeDispatch!(apiSlice.util.invalidateTags(['User']));
      });
    }
    
  } else if (type === 'sender-parcel') {
    
    adminCache.invalidate(CACHE_KEYS.SENDER_DASHBOARD);
    adminCache.invalidate(CACHE_KEYS.SENDER_STATISTICS);

    clearCachePattern('sender:parcels:');

    if (storeDispatch) {
      import('../store/api/apiSlice').then(({ apiSlice }) => {
        storeDispatch!(apiSlice.util.invalidateTags(['Parcel']));
      });
    }
    
  }
}

function clearCachePattern(pattern: string): void {
  try {
    const storagePattern = STORAGE_PREFIX + pattern;
    const keys = Object.keys(localStorage);
    const matchingKeys = keys.filter(key => key.startsWith(storagePattern));
    
    matchingKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    if (matchingKeys.length > 0) {
      
      const event = new CustomEvent('cache-invalidated', { 
        detail: { key: pattern, timestamp: Date.now() } 
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.warn('Failed to clear cache pattern:', pattern, error);
  }
}

export function clearAllCache() {
  adminCache.clearAll();
}

export function getCacheStats() {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
    const totalSize = cacheKeys.reduce((acc, key) => {
      const item = localStorage.getItem(key);
      return acc + (item ? item.length : 0);
    }, 0);
    
    const version = localStorage.getItem(CACHE_VERSION_KEY);
    
    return {
      version: version || 'unknown',
      count: cacheKeys.length,
      sizeKB: (totalSize / 1024).toFixed(2),
      keys: cacheKeys.map(k => k.replace(STORAGE_PREFIX, '')),
    };
  } catch {
    return { version: 'unknown', count: 0, sizeKB: '0', keys: [] };
  }
}

export function checkCacheHealth() {
  const stats = getCacheStats();
  const maxSizeKB = 5000; 
  const currentSize = parseFloat(stats.sizeKB);
  
  return {
    ...stats,
    healthy: currentSize < maxSizeKB,
    warning: currentSize >= maxSizeKB ? 'Cache size is large, consider clearing old data' : null,
    recommendation: currentSize >= maxSizeKB 
      ? 'Run window.__clearCache() to clear all cache' 
      : 'Cache is healthy',
  };
}

