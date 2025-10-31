
import api from "./ApiConfiguration";
import { ApiParcel, StatusLogEntry } from "./parcelTypes";

export class ParcelApiService {
    
    static async fetchParcels(filterParams: {
        senderEmail?: string;
        receiverEmail?: string;
        status?: string;
    } = {}): Promise<ApiParcel[]> {
        
        const queryParams = new URLSearchParams();
        if (filterParams.senderEmail)
            queryParams.append("senderEmail", filterParams.senderEmail);
        if (filterParams.receiverEmail)
            queryParams.append("receiverEmail", filterParams.receiverEmail);
        if (filterParams.status)
            queryParams.append("status", filterParams.status);

        queryParams.append("limit", "1000");

        const query = queryParams.toString();
        const endpoint = `/parcels?${query}`;

        let response;
        try {
            response = await api.get(`/admin${endpoint}`);
        } catch {
            response = await api.get(endpoint);
        }

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

    static async updateParcelStatus(
        parcelId: string | number,
        status: string
    ): Promise<void> {
        const requestBody = {
            status: status,
            
        };

        await api.patch(`/parcels/${parcelId}/status`, requestBody);
    }

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

    static async returnParcel(parcelId: string | number): Promise<void> {
        await api.patch(`/parcels/${parcelId}/return`, {
            note: "Returned to sender by admin",
        });
    }

    static async assignPersonnel(
        parcelId: string | number,
        deliveryPersonnel: string
    ): Promise<void> {
        await api.patch(`/parcels/${parcelId}/assign-personnel`, {
            deliveryPersonnel: deliveryPersonnel,
        });
    }

    static async deleteParcel(parcelId: string | number): Promise<void> {
        await api.delete(`/parcels/${parcelId}`);
    }

    static async cancelParcel(
        parcelId: string | number,
        reason: string
    ): Promise<void> {
        await api.patch(`/parcels/cancel/${parcelId}`, {
            reason: reason,
        });
    }

    static async fetchStatusLog(parcelId: string | number): Promise<StatusLogEntry[]> {
        const response = await api.get(`/parcels/${parcelId}/status-log`);
        return response.data.data || response.data || [];
    }
}

