import api from "@/lib/api";
import { Parcel } from "../types";

export const receiverApiService = {
    // Fetch parcels for the current receiver
    async fetchParcels(userEmail: string): Promise<Parcel[]> {
        try {
            // First try /parcels/me endpoint (for parcels where user is recipient)
            const response = await api.get("/parcels/me");
            return response.data.data || response.data;
        } catch {
            console.log("Trying fallback endpoint...");
            // Fallback: Get all parcels and filter by recipient email
            const response = await api.get("/parcels");
            const allParcels = response.data.data || response.data;

            // Filter parcels where the current user is the recipient
            return allParcels.filter(
                (parcel: Parcel) => parcel.recipientEmail === userEmail
            );
        }
    },

    // Confirm delivery of a parcel
    async confirmDelivery(parcelId: number): Promise<void> {
        await api.put(`/parcels/${parcelId}/confirm-delivery`);
    },

    // Rate a delivered parcel
    async rateParcel(parcelId: number, rating: number): Promise<void> {
        await api.put(`/parcels/${parcelId}/rate`, { rating });
    },

    // Get parcel tracking history
    async getTrackingHistory(trackingNumber: string): Promise<any[]> {
        const response = await api.get(`/parcels/tracking/${trackingNumber}/history`);
        return response.data.data || response.data;
    },

    // Subscribe to delivery notifications
    async subscribeToNotifications(parcelId: number, notificationTypes: string[]): Promise<void> {
        await api.post(`/parcels/${parcelId}/notifications/subscribe`, {
            types: notificationTypes
        });
    }
};