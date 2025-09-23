// Custom hooks for Parcel Management
import { useCallback, useEffect, useState } from "react";
import { ParcelApiService } from "../../../services/parcelApiService";
import { ParcelDataTransformer } from "./dataTransformer";
import { FilterParams, NotificationState, Parcel, StatusLogEntry } from "../../../services/parcelTypes";

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
    const [loading, setLoading] = useState(true);

    const fetchParcels = useCallback(async () => {
        try {
            setLoading(true);
            console.log("Fetching parcels from API...");

            const apiParcels = await ParcelApiService.fetchParcels(filterParams);
           
            // Debug: Show first parcel raw structure
            if (apiParcels && apiParcels.length > 0) {
                console.log(
                    "🔍 First raw parcel from API:",
                    JSON.stringify(apiParcels[0], null, 2)
                );
                
            }

            // Transform API data to frontend format
            const validParcels = ParcelDataTransformer.transformApiParcelsToFrontend(apiParcels);

        
            setParcels(validParcels);
        } catch (error) {
          
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            }
            // Set empty array on error
            setParcels([]);
            throw error; // Re-throw to allow caller to handle the error
        } finally {
            setLoading(false);
        }
    }, [filterParams]);

    useEffect(() => {
        fetchParcels();
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
        } finally {
            setActionLoading(false);
        }
    }, []);

    const returnParcel = useCallback(async (parcelId: string | number) => {
        setActionLoading(true);
        try {
            await ParcelApiService.returnParcel(parcelId);
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
        } finally {
            setActionLoading(false);
        }
    }, []);

    const deleteParcel = useCallback(async (parcelId: string | number) => {
        setActionLoading(true);
        try {
            await ParcelApiService.deleteParcel(parcelId);
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

