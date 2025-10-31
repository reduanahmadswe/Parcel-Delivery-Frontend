import api from "../../../services/api";
import { Parcel } from "@/types/GlobalTypeDefinitions";

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface FetchParcelsResponse {
    parcels: Parcel[];
    pagination: PaginationInfo;
}

export const receiverApiService = {
    
    async fetchAllParcels(userEmail: string): Promise<Parcel[]> {
        try {
            
            let response;
            let allParcels = [];

            try {
                response = await api.get("/parcels/me?limit=10000");
                if (response.data.data?.length > 10) {
                    allParcels = response.data.data;
                }
            } catch (err) {
                
            }

            if (allParcels.length <= 10) {
                try {
                    response = await api.get("/parcels/me/no-pagination?limit=10000");
                    if (response.data.data?.length > allParcels.length) {
                        allParcels = response.data.data;
                    }
                } catch (err) {
                    
                }
            }

            if (allParcels.length <= 10) {
                try {
                    const page1 = await api.get("/parcels/me?page=1&limit=10000");
                    const page2 = await api.get("/parcels/me?page=2&limit=10000");
                    const combinedData = [
                        ...(page1.data.data || []),
                        ...(page2.data.data || []),
                    ];
                    if (combinedData.length > allParcels.length) {
                        allParcels = combinedData;
                    }
                } catch (err) {
                    
                }
            }

            if (allParcels.length === 0) {
                try {
                    response = await api.get("/parcels?limit=10000");
                    const allParcelData = response.data.data || [];
                    allParcels = allParcelData.filter(
                        (parcel: any) => parcel.recipientEmail === userEmail
                    );
                } catch (err) {
                    
                }
            }

            if (allParcels.length === 0) {
                try {
                    response = await api.get("/parcels/me/no-pagination");
                    allParcels = response.data.data || [];
                } catch (err) {
                    
                }
            }

            const transformedParcels = allParcels.map((parcel: any) => ({
                ...parcel,
                
                status: parcel.currentStatus || parcel.status || 'pending',
                
                cost: parcel.fee?.totalFee || parcel.cost || 0,
            }));

            return transformedParcels;
        } catch (error) {
            return [];
        }
    },

    async fetchParcels(
        userEmail: string,
        page: number = 1,
        limit: number = 5,
        status?: string,
        search?: string
    ): Promise<FetchParcelsResponse> {
        try {
            
            const allParcels = await this.fetchAllParcels(userEmail);

            let filteredParcels = [...allParcels];

            if (status && status !== "all") {
                filteredParcels = filteredParcels.filter((parcel: any) => {
                    const parcelStatus = parcel.currentStatus || parcel.status;

                    switch (status) {
                        case "pending":
                            return ["requested", "approved", "pending"].includes(parcelStatus);
                        case "in_transit":
                        case "inTransit":
                            return ["dispatched", "in-transit", "in_transit"].includes(parcelStatus);
                        case "delivered":
                            return ["delivered"].includes(parcelStatus);
                        case "cancelled":
                            return ["cancelled", "rejected"].includes(parcelStatus);
                        default:
                            return parcelStatus === status;
                    }
                });
            }

            if (search && search.trim()) {
                const searchLower = search.toLowerCase();
                filteredParcels = filteredParcels.filter((parcel: any) => {
                    const searchFields = [
                        parcel.trackingId,
                        parcel.trackingNumber,
                        parcel.senderName,
                        parcel.senderInfo?.name,
                        parcel.description,
                        parcel.parcelDetails?.description,
                        parcel.currentStatus,
                        parcel.status,
                        parcel.receiverInfo?.name,
                        parcel.receiverInfo?.address?.city,
                    ].filter(Boolean);

                    return searchFields.some(field =>
                        field?.toString().toLowerCase().includes(searchLower)
                    );
                });
            }

            const totalItems = filteredParcels.length;
            const totalPages = Math.ceil(totalItems / limit);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedParcels = filteredParcels.slice(startIndex, endIndex);

            const transformedPaginatedParcels = paginatedParcels.map((parcel: any) => ({
                ...parcel,
                
                status: parcel.currentStatus || parcel.status || 'pending',
                
                cost: parcel.fee?.totalFee || parcel.cost || 0,
            }));

            const pagination: PaginationInfo = {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };

            return { parcels: transformedPaginatedParcels, pagination };
        } catch (error) {
            return {
                parcels: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: limit,
                    hasNextPage: false,
                    hasPrevPage: false,
                }
            };
        }
    },

    async confirmDelivery(parcelId: string, note?: string): Promise<void> {
        try {
            const body = note ? { note } : {};
            const response = await api.patch(`/parcels/${parcelId}/confirm-delivery`, body);
        } catch (error: any) {
            
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                const message = errorData?.message || 'Unknown validation error';

                if (message.includes('preferredDeliveryDate') ||
                    message.includes('Preferred delivery date must be in the future') ||
                    (errorData?.errors && errorData.errors['deliveryInfo.preferredDeliveryDate'])) {

                    try {
                        
                        await this.fixDeliveryDateAndConfirm(parcelId, note);
                        return; 
                    } catch (fixError) {
                        throw new Error('🚨 Cannot confirm delivery: This parcel has an invalid preferred delivery date. The system attempted to fix this automatically but failed. Please contact customer support.');
                    }
                }

                if (message.includes('validation failed') || message.includes('Validation Error')) {
                    throw new Error('⚠️ Data validation error: The parcel has invalid information that prevents delivery confirmation. Please contact support for assistance.');
                }

                throw new Error(`❌ Request Error: ${message}`);
            }

            throw error;
        }
    },

    async fixDeliveryDateAndConfirm(parcelId: string, note?: string): Promise<void> {
        try {
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0); 

            const fixData = {
                deliveryInfo: {
                    preferredDeliveryDate: tomorrow.toISOString()
                }
            };

            await api.patch(`/parcels/${parcelId}`, fixData);

            const body = note ? { note } : {};
            const response = await api.patch(`/parcels/${parcelId}/confirm-delivery`, body);

        } catch (error: any) {
            throw error;
        }
    }, async rateParcel(parcelId: number, rating: number): Promise<void> {
        await api.put(`/parcels/${parcelId}/rate`, { rating });
    },

    async trackParcel(trackingId: string): Promise<any> {
        const response = await api.get(`/parcels/track/${trackingId.trim()}`);
        return response.data.data || response.data;
    },

    async getTrackingHistory(trackingNumber: string): Promise<any[]> {
        const response = await api.get(`/parcels/tracking/${trackingNumber}/history`);
        return response.data.data || response.data;
    },

    async subscribeToNotifications(parcelId: number, notificationTypes: string[]): Promise<void> {
        await api.post(`/parcels/${parcelId}/notifications/subscribe`, {
            types: notificationTypes
        });
    }
};

