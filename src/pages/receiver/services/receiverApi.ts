import api from "@/lib/api";
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
            console.log("🔍 Debugging comprehensive parcel fetch for receiver...");

            // Try multiple endpoints to get all data (similar to sender dashboard)
            let response;
            let allParcels = [];

            // Method 1: Try with high limit parameter
            try {
                response = await api.get("/parcels/me?limit=10000");
                console.log("✅ Method 1 (/parcels/me?limit=10000):", {
                    count: response.data.data?.length,
                    total: response.data.total,
                    pagination: response.data.pagination,
                });
                if (response.data.data?.length > 10) {
                    allParcels = response.data.data;
                    console.log("🎉 Found more than 10 parcels with limit=10000!");
                }
            } catch (err) {
                console.log("❌ Method 1 failed:", err);
            }

            // Method 2: Try no-pagination with limit
            if (allParcels.length <= 10) {
                try {
                    response = await api.get("/parcels/me/no-pagination?limit=10000");
                    console.log("✅ Method 2 (/parcels/me/no-pagination?limit=10000):", {
                        count: response.data.data?.length,
                        total: response.data.total,
                    });
                    if (response.data.data?.length > allParcels.length) {
                        allParcels = response.data.data;
                    }
                } catch (err) {
                    console.log("❌ Method 2 failed:", err);
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
                    console.log("✅ Method 3 (pagination):", {
                        page1Count: page1.data.data?.length || 0,
                        page2Count: page2.data.data?.length || 0,
                        totalCombined: combinedData.length,
                        page1Total: page1.data.total,
                        page2Total: page2.data.total,
                    });
                    if (combinedData.length > allParcels.length) {
                        allParcels = combinedData;
                    }
                } catch (err) {
                    console.log("❌ Method 3 failed:", err);
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
                    console.log("✅ Method 4 (filter all parcels):", {
                        totalParcels: allParcelData.length,
                        filteredCount: allParcels.length,
                        userEmail: userEmail,
                    });
                } catch (err) {
                    console.log("❌ Method 4 failed:", err);
                }
            }

            // Method 5: Final fallback to original endpoint
            if (allParcels.length === 0) {
                try {
                    response = await api.get("/parcels/me/no-pagination");
                    allParcels = response.data.data || [];
                    console.log("⚠️ Fallback to original endpoint:", allParcels.length);
                } catch (err) {
                    console.log("❌ Fallback failed:", err);
                }
            }

            console.log("📊 Final comprehensive result for receiver:", {
                parcelsCount: allParcels.length,
                userEmail: userEmail,
                expectedCount: "All received parcels",
                isComplete: allParcels.length > 0,
            });

            // Transform to match receiver Parcel interface (currentStatus -> status, fee.totalFee -> cost)
            const transformedParcels = allParcels.map((parcel: any) => ({
                ...parcel,
                // Map currentStatus to status for receiver interface compatibility
                status: parcel.currentStatus || parcel.status || 'pending',
                // Map fee structure if needed
                cost: parcel.fee?.totalFee || parcel.cost || 0,
            }));

            console.log("📦 Transformed parcels for receiver:", {
                count: transformedParcels.length,
                sampleStatuses: transformedParcels.slice(0, 3).map((p: any) => ({
                    id: p.id || p._id,
                    originalStatus: allParcels.find((op: any) => (op.id || op._id) === (p.id || p._id))?.currentStatus,
                    transformedStatus: p.status
                }))
            });

            return transformedParcels;
        } catch (error) {
            console.error("❌ Error in fetchAllParcels:", error);
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
            console.log("🔍 Fetching paginated parcels for receiver...", {
                userEmail,
                page,
                limit,
                status,
                search
            });

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

            console.log("📊 Final paginated result:", {
                parcelsCount: transformedPaginatedParcels.length,
                totalFiltered: filteredParcels.length,
                totalAll: allParcels.length,
                pagination,
                userEmail
            });

            return { parcels: transformedPaginatedParcels, pagination };
        } catch (error) {
            console.error("❌ Error in fetchParcels:", error);
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

    async confirmDelivery(parcelId: number): Promise<void> {
        await api.put(`/parcels/${parcelId}/confirm-delivery`);
    },

    async rateParcel(parcelId: number, rating: number): Promise<void> {
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