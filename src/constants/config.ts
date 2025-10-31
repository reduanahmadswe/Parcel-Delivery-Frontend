

function ensureApiBase(raw?: string | null): string {
    const fallback = 'https://parcel-delivery-api.onrender.com/api';
    if (!raw) return fallback;

    if (raw === '/api') return '/api';

    const trimmed = raw.replace(/\/+$/, '');
    if (trimmed.endsWith('/api')) return trimmed;
    return `${trimmed}/api`;
}

const rawApi = (import.meta as any).env?.VITE_API_URL as string | undefined;
export const API_BASE = ensureApiBase(rawApi);
export const IS_PROD = (import.meta as any).env?.PROD === true;
export const IS_DEV = (import.meta as any).env?.DEV === true;

export function getEnv(key: string): string | undefined {
    return (import.meta as any).env?.[key];
}

