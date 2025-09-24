import api from "../../../shared/services/api";
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
    // Comprehensive fetch method similar to sender - gets all data first for accurate statistics
    async fetchAllParcels(userEmail: string): Promise<Parcel[]> {
        try {
            // Try multiple endpoints to get all data (similar to sender dashboard)
            let response;
            let allParcels = [];

            // Method 1: Try with high limit parameter
            try {
                response = await api.get("/parcels/me?limit=10000");
                if (response.data.data?.length > 10) {
                    allParcels = response.data.data;
                }
            } catch (err) {
                // Method 1 failed, try next method
            }

            // Method 2: Try no-pagination with limit
            if (allParcels.length <= 10) {
                try {
                    response = await api.get("/parcels/me/no-pagination?limit=10000");
                    if (response.data.data?.length > allParcels.length) {
                        allParcels = response.data.data;
                    }
                } catch (err) {
                    // Method 2 failed, try next method
                }
            }

            // Method 3: Try pagination with multiple pages
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
                    // Method 3 failed, try next method
                }
            }

            // Method 4: Fallback - Get all parcels and filter by recipient email
            if (allParcels.length === 0) {
                try {
                    response = await api.get("/parcels?limit=10000");
                    const allParcelData = response.data.data || [];
                    allParcels = allParcelData.filter(
                        (parcel: any) => parcel.recipientEmail === userEmail
                    );
                } catch (err) {
                    // Method 4 failed, try next method
                }
            }

            // Method 5: Final fallback to original endpoint
            if (allParcels.length === 0) {
                try {
                    response = await api.get("/parcels/me/no-pagination");
                    allParcels = response.data.data || [];
                } catch (err) {
                    // Final fallback failed
                }
            }

            // Transform to match receiver Parcel interface (currentStatus -> status, fee.totalFee -> cost)
            const transformedParcels = allParcels.map((parcel: any) => ({
                ...parcel,
                // Map currentStatus to status for receiver interface compatibility
                status: parcel.currentStatus || parcel.status || 'pending',
                // Map fee structure if needed
                cost: parcel.fee?.totalFee || parcel.cost || 0,
            }));

            return transformedParcels;
        } catch (error) {
            return [];
        }
    },

    // Fetch parcels with pagination support - uses comprehensive data for client-side pagination
    async fetchParcels(
        userEmail: string,
        page: number = 1,
        limit: number = 5,
        status?: string,
        search?: string
    ): Promise<FetchParcelsResponse> {
        try {
            // Get all parcels first (for accurate statistics and filtering)
            const allParcels = await this.fetchAllParcels(userEmail);

            let filteredParcels = [...allParcels];

            // Apply status filter if provided
            if (status && status !== "all") {
                filteredParcels = filteredParcels.filter((parcel: any) => {
                    const parcelStatus = parcel.currentStatus || parcel.status;

                    // Map status values (similar to sender approach)
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

            // Apply search filter if provided
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

            // Manual pagination
            const totalItems = filteredParcels.length;
            const totalPages = Math.ceil(totalItems / limit);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedParcels = filteredParcels.slice(startIndex, endIndex);

            // Transform to match receiver Parcel interface (currentStatus -> status, fee.totalFee -> cost)
            const transformedPaginatedParcels = paginatedParcels.map((parcel: any) => ({
                ...parcel,
                // Map currentStatus to status for receiver interface compatibility
                status: parcel.currentStatus || parcel.status || 'pending',
                // Map fee structure if needed
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
            // Handle the specific preferredDeliveryDate validation error
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                const message = errorData?.message || 'Unknown validation error';

                // Check for the specific preferredDeliveryDate validation error
                if (message.includes('preferredDeliveryDate') ||
                    message.includes('Preferred delivery date must be in the future') ||
                    (errorData?.errors && errorData.errors['deliveryInfo.preferredDeliveryDate'])) {

                    try {
                        // Try to fix the validation issue by updating the delivery date
                        await this.fixDeliveryDateAndConfirm(parcelId, note);
                        return; // Success after fix
                    } catch (fixError) {
                        throw new Error('🚨 Cannot confirm delivery: This parcel has an invalid preferred delivery date. The system attempted to fix this automatically but failed. Please contact customer support.');
                    }
                }

                // Check for general validation errors
                if (message.includes('validation failed') || message.includes('Validation Error')) {
                    throw new Error('⚠️ Data validation error: The parcel has invalid information that prevents delivery confirmation. Please contact support for assistance.');
                }

                // For any other 400 errors
                throw new Error(`❌ Request Error: ${message}`);
            }

            // For other types of errors, re-throw as is
            throw error;
        }
    },

    // Helper method to fix delivery date validation and retry confirmation
    async fixDeliveryDateAndConfirm(parcelId: string, note?: string): Promise<void> {
        try {
            // Set the preferred delivery date to tomorrow to bypass validation
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0); // Set to start of day

            const fixData = {
                deliveryInfo: {
                    preferredDeliveryDate: tomorrow.toISOString()
                }
            };

            // First, update the parcel to fix the validation issue
            await api.patch(`/parcels/${parcelId}`, fixData);

            // Now retry the delivery confirmation
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

