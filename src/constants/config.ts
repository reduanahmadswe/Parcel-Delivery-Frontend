// Centralized environment config for Vite
export const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:5000/api';
export const IS_PROD = (import.meta as any).env?.PROD === true;
export const IS_DEV = (import.meta as any).env?.DEV === true;

// helper to read arbitrary VITE_ variables (typed as string | undefined)
export function getEnv(key: string): string | undefined {
    return (import.meta as any).env?.[key];
}

