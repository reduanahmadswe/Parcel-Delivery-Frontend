// API service functions for Parcel Management
import api from "./ApiConfiguration";
import { ApiParcel, StatusLogEntry } from "./parcelTypes";

export class ParcelApiService {
    /**
     * Fetch all parcels with optional filtering
     */
    static async fetchParcels(filterParams: {
        senderEmail?: string;
        receiverEmail?: string;
        status?: string;
    } = {}): Promise<ApiParcel[]> {
        // Build query params for filtering
        const queryParams = new URLSearchParams();
        if (filterParams.senderEmail)
            queryParams.append("senderEmail", filterParams.senderEmail);
        if (filterParams.receiverEmail)
            queryParams.append("receiverEmail", filterParams.receiverEmail);
        if (filterParams.status)
            queryParams.append("status", filterParams.status);
        
        // Add limit parameter to fetch more data
        queryParams.append("limit", "1000");

        const query = queryParams.toString();
        const endpoint = `/parcels?${query}`;

        // Try admin-specific endpoint first, fallback to general parcels endpoint
        let response;
        try {
            response = await api.get(`/admin${endpoint}`);
        } catch {
            response = await api.get(endpoint);
        }

        // Try different possible data structures
        let parcelsData = null;
        if (response.data.data && Array.isArray(response.data.data)) {
            parcelsData = response.data.data;
        } else if (
            response.data.parcels &&
            Array.isArray(response.data.parcels)
        ) {
            parcelsData = response.data.parcels;
        } else if (Array.isArray(response.data)) {
            parcelsData = response.data;
        } else {
            parcelsData = [];
        }

        return parcelsData || [];
    }

    /**
     * Update parcel status
     */
    static async updateParcelStatus(
        parcelId: string | number,
        status: string
    ): Promise<void> {
        const requestBody = {
            status: status,
            // Don't include deliveryInfo to avoid preferredDeliveryDate validation issues
        };

        await api.patch(`/parcels/${parcelId}/status`, requestBody);
    }

    /**
     * Flag or unflag a parcel
     */
    static async flagParcel(
        parcelId: string | number,
        isFlagged: boolean
    ): Promise<void> {
        await api.patch(`/parcels/${parcelId}/flag`, {
            isFlagged: isFlagged,
            note: isFlagged
                ? "Flagged for review by admin"
                : "Flag removed by admin",
        });
    }

    /**
     * Put parcel on hold or release from hold
     */
    static async holdParcel(
        parcelId: string | number,
        isOnHold: boolean
    ): Promise<void> {
        await api.patch(`/parcels/${parcelId}/hold`, {
            isHeld: isOnHold,
            note: isOnHold
                ? "Put on hold by admin"
                : "Released from hold by admin",
        });
    }

    /**
     * Return parcel to sender
     */
    static async returnParcel(parcelId: string | number): Promise<void> {
        await api.patch(`/parcels/${parcelId}/return`, {
            note: "Returned to sender by admin",
        });
    }

    /**
     * Assign delivery personnel to parcel
     */
    static async assignPersonnel(
        parcelId: string | number,
        deliveryPersonnel: string
    ): Promise<void> {
        await api.patch(`/parcels/${parcelId}/assign-personnel`, {
            deliveryPersonnel: deliveryPersonnel,
        });
    }

    /**
     * Delete a parcel
     */
    static async deleteParcel(parcelId: string | number): Promise<void> {
        await api.delete(`/parcels/${parcelId}`);
    }

    /**
     * Cancel a parcel (only before dispatch)
     */
    static async cancelParcel(
        parcelId: string | number,
        reason: string
    ): Promise<void> {
        await api.patch(`/parcels/cancel/${parcelId}`, {
            reason: reason,
        });
    }

    /**
     * Fetch status log for a parcel
     */
    static async fetchStatusLog(parcelId: string | number): Promise<StatusLogEntry[]> {
        const response = await api.get(`/parcels/${parcelId}/status-log`);
        return response.data.data || response.data || [];
    }
}

