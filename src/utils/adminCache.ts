// Admin Data Cache Manager
// Centralized caching solution for admin pages to prevent unnecessary reloads
// Now with localStorage persistence to survive page reloads!

import { useState, useCallback, useRef } from 'react';
import type { AppDispatch } from '../store/store';

// Cache invalidation event types
type CacheInvalidationEvent = CustomEvent<{ key: string; type: 'parcel' | 'user' }>;

// Store dispatch reference (will be set from main.tsx)
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
const CURRENT_CACHE_VERSION = '1.0'; // Increment this to invalidate all old caches

class AdminDataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: config.ttl || DEFAULT_TTL,
      staleTime: config.staleTime || DEFAULT_STALE_TIME,
      useLocalStorage: config.useLocalStorage !== false, 
    };
    
    // Check cache version and clear old caches if version changed
    if (this.config.useLocalStorage) {
      this.checkCacheVersion();
      this.loadFromLocalStorage();
    }
  }

  // Check cache version and clear if outdated
  private checkCacheVersion(): void {
    try {
      const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
      
      if (storedVersion !== CURRENT_CACHE_VERSION) {
        // Clear all old cache entries
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
        cacheKeys.forEach(key => localStorage.removeItem(key));
        
        // Update version
        localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
      }
    } catch (error) {
      console.warn('Failed to check cache version:', error);
    }
  }

  // Load cache from localStorage
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
            
            // Check if entry is still valid (not expired)
            const age = Date.now() - entry.timestamp;
            if (age <= this.config.ttl!) {
              this.cache.set(cacheKey, entry);
            } else {
              // Remove expired entry from localStorage
              localStorage.removeItem(storageKey);
            }
          } catch (err) {
            // Invalid JSON, remove it
            localStorage.removeItem(storageKey);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  // Save to localStorage
  private saveToLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
    if (!this.config.useLocalStorage) return;
    
    try {
      const storageKey = STORAGE_PREFIX + key;
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.warn(`Failed to save cache to localStorage: ${key}`, error);
      // If localStorage is full, try to clear old entries
      this.clearOldLocalStorageEntries();
    }
  }

  // Clear old entries from localStorage if it's full
  private clearOldLocalStorageEntries(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
      
      // Get entries with timestamps
      const entries = cacheKeys.map(key => {
        try {
          const data = localStorage.getItem(key);
          const entry = data ? JSON.parse(data) : null;
          return { key, timestamp: entry?.timestamp || 0 };
        } catch {
          return { key, timestamp: 0 };
        }
      });
      
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove oldest 30% of entries
      const toRemove = Math.ceil(entries.length * 0.3);
      entries.slice(0, toRemove).forEach(entry => {
        localStorage.removeItem(entry.key);
      });
    } catch (error) {
      console.warn('Failed to clear old localStorage entries:', error);
    }
  }

  // Set data in cache (both memory and localStorage)
  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      loading: false,
    };
    
    this.cache.set(key, entry);
    this.saveToLocalStorage(key, entry);
  }

  // Get data from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if data is expired
    const age = Date.now() - entry.timestamp;
    if (age > this.config.ttl!) {
      this.cache.delete(key);
      // Also remove from localStorage
      if (this.config.useLocalStorage) {
        localStorage.removeItem(STORAGE_PREFIX + key);
      }
      return null;
    }

    return entry.data as T;
  }

  // Check if data is stale (needs refresh in background)
  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;

    const age = Date.now() - entry.timestamp;
    return age > this.config.staleTime!;
  }

  // Check if data exists and is fresh
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Clear specific cache entry (from both memory and localStorage)
  // Also emits cache invalidation event
  clear(key: string): void {
    this.cache.delete(key);
    if (this.config.useLocalStorage) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    }
    
    // Emit cache invalidation event for React components
    this.emitCacheInvalidation(key);
  }

  // Clear all cache (from both memory and localStorage)
  // This is called on logout to ensure all user data is removed
  clearAll(): void {
    this.cache.clear();
    if (this.config.useLocalStorage) {
      try {
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
        cacheKeys.forEach(key => localStorage.removeItem(key));
        
        // Also remove cache version key to force fresh cache on next login
        localStorage.removeItem(CACHE_VERSION_KEY);
      } catch (error) {
        console.warn('Failed to clear localStorage cache:', error);
      }
    }
  }

  // Invalidate and refresh (also removes from localStorage and emits event)
  invalidate(key: string): void {
    this.cache.delete(key);
    if (this.config.useLocalStorage) {
      localStorage.removeItem(STORAGE_PREFIX + key);
    }
    
    // Emit cache invalidation event
    this.emitCacheInvalidation(key);
  }

  // Emit cache invalidation event for components to listen
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

  // Get loading state
  isLoading(key: string): boolean {
    const entry = this.cache.get(key);
    return entry?.loading || false;
  }

  // Set loading state
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

// Singleton instance with localStorage persistence enabled
// Cache থাকবে 7 দিন (বা logout করা পর্যন্ত)
// Background refresh হবে প্রতি 5 মিনিটে
export const adminCache = new AdminDataCache({
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days - logout না করলে cache থাকবে
  staleTime: 5 * 60 * 1000, // 5 minutes - এর পরে background এ refresh
  useLocalStorage: true, // ✅ Enable localStorage persistence (survives page reload!)
});

// Cache keys
export const CACHE_KEYS = {
  // Admin cache keys
  PARCELS: 'admin:parcels',
  USERS: 'admin:users',
  PARCEL_DETAILS: (id: string | number) => `admin:parcel:${id}`,
  USER_DETAILS: (id: string | number) => `admin:user:${id}`,
  PARCEL_STATUS_LOG: (id: string | number) => `admin:parcel:${id}:status-log`,
  
  // Sender cache keys
  SENDER_PARCELS: (page: number, filters?: string) => `sender:parcels:${page}:${filters || 'all'}`,
  SENDER_DASHBOARD: 'sender:dashboard:stats',
  SENDER_STATISTICS: 'sender:statistics',
};

// Hook for cached data fetching
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

      // Check cache first
      if (!force && adminCache.has(cacheKey)) {
        const cachedData = adminCache.get<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);

          // Refetch in background if stale
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

  // Fetch on mount or when cache key changes
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

// Helper to invalidate related caches
// This will emit cache invalidation events that components can listen to
// AND invalidate RTK Query cache tags
export function invalidateRelatedCaches(type: 'parcel' | 'user' | 'sender-parcel', id?: string | number) {
  
  if (type === 'parcel') {
    // Invalidate main parcels list (Admin Dashboard will listen to this)
    adminCache.invalidate(CACHE_KEYS.PARCELS);
    
    // Also invalidate sender dashboard
    adminCache.invalidate(CACHE_KEYS.SENDER_DASHBOARD);
    adminCache.invalidate(CACHE_KEYS.SENDER_STATISTICS);
    
    // Clear all sender parcels cache entries (different pages/filters)
    clearCachePattern('sender:parcels:');
    
    if (id) {
      adminCache.invalidate(CACHE_KEYS.PARCEL_DETAILS(id));
      adminCache.invalidate(CACHE_KEYS.PARCEL_STATUS_LOG(id));
    }
    
    // 🔥 IMPORTANT: Invalidate RTK Query cache for parcels
    if (storeDispatch) {
      // Import apiSlice dynamically to avoid circular dependency
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
    
    // Invalidate RTK Query cache for users
    if (storeDispatch) {
      import('../store/api/apiSlice').then(({ apiSlice }) => {
        storeDispatch!(apiSlice.util.invalidateTags(['User']));
      });
    }
    
  } else if (type === 'sender-parcel') {
    // Invalidate sender dashboard and statistics
    adminCache.invalidate(CACHE_KEYS.SENDER_DASHBOARD);
    adminCache.invalidate(CACHE_KEYS.SENDER_STATISTICS);
    
    // Clear all sender parcels cache entries
    clearCachePattern('sender:parcels:');
    
    // Invalidate RTK Query parcel cache for sender parcels too
    if (storeDispatch) {
      import('../store/api/apiSlice').then(({ apiSlice }) => {
        storeDispatch!(apiSlice.util.invalidateTags(['Parcel']));
      });
    }
    
  }
}

// Helper to clear cache entries matching a pattern
function clearCachePattern(pattern: string): void {
  try {
    const storagePattern = STORAGE_PREFIX + pattern;
    const keys = Object.keys(localStorage);
    const matchingKeys = keys.filter(key => key.startsWith(storagePattern));
    
    matchingKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    if (matchingKeys.length > 0) {
      // Emit cache invalidation event
      const event = new CustomEvent('cache-invalidated', { 
        detail: { key: pattern, timestamp: Date.now() } 
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.warn('Failed to clear cache pattern:', pattern, error);
  }
}

// Helper to clear all cache (useful for logout)
export function clearAllCache() {
  adminCache.clearAll();
}

// Helper to get cache statistics (for debugging)
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

// Helper to check cache health (for debugging)
export function checkCacheHealth() {
  const stats = getCacheStats();
  const maxSizeKB = 5000; // 5MB warning threshold
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

