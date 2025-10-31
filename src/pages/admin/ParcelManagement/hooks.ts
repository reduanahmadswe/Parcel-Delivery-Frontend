// Custom hooks for Parcel Management
import { useCallback, useEffect, useState, useRef } from "react";
import { ParcelApiService } from "../../../services/parcelApiService";
import { ParcelDataTransformer } from "./dataTransformer";
import { FilterParams, NotificationState, Parcel, StatusLogEntry } from "../../../services/parcelTypes";
import { adminCache, CACHE_KEYS, invalidateRelatedCaches } from "../../../utils/adminCache";

export function useNotification() {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = useCallback((
        type: "success" | "error" | "info",
        message: string
    ) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showNotification,
        hideNotification,
    };
}

export function useParcels(filterParams: FilterParams) {
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [loading, setLoading] = useState(false);
    const isMountedRef = useRef(false);
    const fetchingRef = useRef(false);

    const fetchParcels = useCallback(async (force: boolean = false) => {
        // Prevent concurrent fetches
        if (fetchingRef.current) return;

        try {
            fetchingRef.current = true;

            // Check cache first (unless force refresh)
            if (!force) {
                const cachedParcels = adminCache.get<Parcel[]>(CACHE_KEYS.PARCELS);
                if (cachedParcels) {
                    setParcels(cachedParcels);
                    setLoading(false);
                    fetchingRef.current = false;
                    return;
                }
            }

            setLoading(true);

            const apiParcels = await ParcelApiService.fetchParcels(filterParams);
           
            // Transform API data to frontend format
            const validParcels = ParcelDataTransformer.transformApiParcelsToFrontend(apiParcels);

            // Cache the results
            adminCache.set(CACHE_KEYS.PARCELS, validParcels);

            setParcels(validParcels);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            }
            // Set empty array on error
            setParcels([]);
            throw error;
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [filterParams]);

    // Only fetch on mount, not on every render
    useEffect(() => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            fetchParcels(false); // Use cache if available
        }
    }, [fetchParcels]);

    return {
        parcels,
        setParcels,
        loading,
        fetchParcels,
    };
}

export function useParcelActions() {
    const [actionLoading, setActionLoading] = useState(false);

    const updateStatus = useCallback(async (
        parcelId: string | number,
        status: string
    ) => {
        setActionLoading(true);
        try {
            await ParcelApiService.updateParcelStatus(parcelId, status);
            // Invalidate cache after status update
            invalidateRelatedCaches('parcel', String(parcelId));
        } finally {
            setActionLoading(false);
        }
    }, []);

    const flagParcel = useCallback(async (
        parcelId: string | number,
        isFlagged: boolean
    ) => {
        setActionLoading(true);
        try {
            await ParcelApiService.flagParcel(parcelId, isFlagged);
            // Invalidate cache after flagging
            invalidateRelatedCaches('parcel', String(parcelId));
        } finally {
            setActionLoading(false);
        }
    }, []);

    const holdParcel = useCallback(async (
        parcelId: string | number,
        isOnHold: boolean
    ) => {
        setActionLoading(true);
        try {
            await ParcelApiService.holdParcel(parcelId, isOnHold);
            // Invalidate cache after hold status change
            invalidateRelatedCaches('parcel', String(parcelId));
        } finally {
            setActionLoading(false);
        }
    }, []);

    const returnParcel = useCallback(async (parcelId: string | number) => {
        setActionLoading(true);
        try {
            await ParcelApiService.returnParcel(parcelId);
            // Invalidate cache after return
            invalidateRelatedCaches('parcel', String(parcelId));
        } finally {
            setActionLoading(false);
        }
    }, []);

    const assignPersonnel = useCallback(async (
        parcelId: string | number,
        deliveryPersonnel: string
    ) => {
        setActionLoading(true);
        try {
            await ParcelApiService.assignPersonnel(parcelId, deliveryPersonnel);
            // Invalidate cache after assignment
            invalidateRelatedCaches('parcel', String(parcelId));
        } finally {
            setActionLoading(false);
        }
    }, []);

    const deleteParcel = useCallback(async (parcelId: string | number) => {
        setActionLoading(true);
        try {
            await ParcelApiService.deleteParcel(parcelId);
            // Invalidate cache after deletion
            invalidateRelatedCaches('parcel', String(parcelId));
        } finally {
            setActionLoading(false);
        }
    }, []);

    return {
        actionLoading,
        updateStatus,
        flagParcel,
        holdParcel,
        returnParcel,
        assignPersonnel,
        deleteParcel,
    };
}

export function useStatusLog() {
    const [statusLog, setStatusLog] = useState<StatusLogEntry[]>([]);

    const fetchStatusLog = useCallback(async (parcelId: string | number) => {
        try {
            const log = await ParcelApiService.fetchStatusLog(parcelId);
            setStatusLog(log);
        } catch (error) {
            console.error("Error fetching status log:", error);
            setStatusLog([]);
        }
    }, []);

    return {
        statusLog,
        fetchStatusLog,
    };
}

