// Centralized environment config for Vite
// Normalize VITE_API_URL so it always points to the API base (ensures trailing /api)
function ensureApiBase(raw?: string | null): string {
    const fallback = 'https://parcel-delivery-api.onrender.com/api';
    if (!raw) return fallback;
    
    // If it's just "/api", return as-is (for Vite proxy)
    if (raw === '/api') return '/api';
    
    // remove trailing slash
    const trimmed = raw.replace(/\/+$/, '');
    if (trimmed.endsWith('/api')) return trimmed;
    return `${trimmed}/api`;
}

const rawApi = (import.meta as any).env?.VITE_API_URL as string | undefined;
export const API_BASE = ensureApiBase(rawApi);
export const IS_PROD = (import.meta as any).env?.PROD === true;
export const IS_DEV = (import.meta as any).env?.DEV === true;

// helper to read arbitrary VITE_ variables (typed as string | undefined)
export function getEnv(key: string): string | undefined {
    return (import.meta as any).env?.[key];
}

