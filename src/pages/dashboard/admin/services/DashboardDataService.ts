import api from "@/lib/ApiConfiguration";
import { AlertTriangle, CheckCircle, Plus, Users } from "lucide-react";
import toast from "react-hot-toast";
import {
    Activity,
    ApiParcelForDashboard,
    ApiUser,
    DashboardStats,
    RecentParcel,
} from "../types";
import { generateTrackingNumber, getRelativeTime } from "../utils";

export class DashboardDataService {
    static async fetchDashboardData(
        page: number = 1,
        limit: number = 10,
        searchTerm?: string,
        statusFilter?: string
    ): Promise<{
        stats: DashboardStats;
        parcels: RecentParcel[];
        activities: Activity[];
        totalParcels: number;
    }> {
        try {
            const paginationParams = {
                page,
                limit,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== "all" && { status: statusFilter }),
            };

            // Fetch Users
            const userStats = await this.fetchUserStats();

            // Fetch Parcels with pagination
            const parcelData = await this.fetchParcelData(paginationParams);

            // Generate activities
            const activities = this.generateActivities(
                parcelData.parcels,
                userStats,
                parcelData.stats
            );

            return {
                stats: {
                    users: userStats,
                    parcels: parcelData.stats,
                },
                parcels: parcelData.parcels,
                activities,
                totalParcels: parcelData.totalCount,
            };
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to fetch dashboard data. Please try again.");
            throw error;
        }
    }

    private static async fetchUserStats() {
        try {
            let usersResponse;
            try {
                usersResponse = await api.get("/admin/users");
            } catch {
                usersResponse = await api.get("/users");
            }

            const users = Array.isArray(usersResponse.data)
                ? usersResponse.data
                : usersResponse.data.data || [];

            return {
                total: users.length,
                active: users.filter(
                    (u: ApiUser) => u.status === "active" || u.isActive
                ).length,
                blocked: users.filter(
                    (u: ApiUser) => u.status === "blocked" || u.isBlocked
                ).length,
                newThisMonth: users.filter((u: ApiUser) => {
                    const createdAt = new Date(
                        u.createdAt || u.created_at || u.joinedAt || ""
                    );
                    const now = new Date();
                    return (
                        createdAt.getMonth() === now.getMonth() &&
                        createdAt.getFullYear() === now.getFullYear()
                    );
                }).length,
            };
        } catch (error) {
            console.warn("Failed to fetch users:", error);
            return { total: 0, active: 0, blocked: 0, newThisMonth: 0 };
        }
    }

    private static async fetchParcelData(paginationParams: any) {
        try {
            let parcelsResponse;

            // Try with pagination first
            try {
                parcelsResponse = await api.get("/admin/parcels", {
                    params: paginationParams,
                });
            } catch (adminError) {
                try {
                    parcelsResponse = await api.get("/parcels", {
                        params: paginationParams,
                    });
                } catch (paginationError) {
                    // If pagination fails, fetch all data and do client-side pagination
                    parcelsResponse = await api.get("/parcels");
                }
            }

            const responseData = parcelsResponse.data;
            let parcels: any[];
            let totalCount: number;
            let isClientSidePagination = false;

            // Handle different response structures
            if (responseData.success && responseData.parcels) {
                parcels = responseData.parcels;
                totalCount = responseData.total || responseData.totalCount || parcels.length;
            } else if (Array.isArray(responseData)) {
                // Client-side pagination needed
                isClientSidePagination = true;
                const allParcels = responseData;

                // Apply filters
                const filteredParcels = this.applyClientSideFilters(
                    allParcels,
                    paginationParams
                );

                totalCount = filteredParcels.length;

                // Apply pagination
                const startIndex = (paginationParams.page - 1) * paginationParams.limit;
                const endIndex = startIndex + paginationParams.limit;
                parcels = filteredParcels.slice(startIndex, endIndex);
            } else {
                // Fallback structure
                parcels = responseData.data || responseData.items || [];
                totalCount = responseData.total || responseData.totalCount || parcels.length;
            }

            // Process parcels
            const processedParcels = this.processParcelData(parcels);

            // Calculate stats
            const stats = this.calculateParcelStats(
                isClientSidePagination ? parcels : processedParcels,
                totalCount
            );

            return {
                parcels: processedParcels,
                stats,
                totalCount,
            };
        } catch (error) {
            console.warn("Failed to fetch parcels:", error);
            toast.error("Failed to fetch parcels data");
            return {
                parcels: [],
                stats: { total: 0, pending: 0, inTransit: 0, delivered: 0, flagged: 0, urgent: 0 },
                totalCount: 0,
            };
        }
    }

    private static applyClientSideFilters(parcels: any[], params: any) {
        return parcels.filter((parcel) => {
            // Search filter
            if (params.search) {
                const searchLower = params.search.toLowerCase();
                const trackingNumber = generateTrackingNumber(parcel).toLowerCase();
                const senderName = (parcel.senderInfo?.name || "").toLowerCase();
                const recipientName = (parcel.receiverInfo?.name || "").toLowerCase();

                if (
                    !trackingNumber.includes(searchLower) &&
                    !senderName.includes(searchLower) &&
                    !recipientName.includes(searchLower)
                ) {
                    return false;
                }
            }

            // Status filter
            if (params.status) {
                const parcelStatus = (parcel.currentStatus || parcel.status || "").toLowerCase();
                if (!parcelStatus.includes(params.status.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }

    private static processParcelData(parcels: ApiParcelForDashboard[]): RecentParcel[] {
        return parcels
            .sort((a, b) => {
                const dateA = new Date(
                    typeof a.createdAt === "string" ? a.createdAt : a.createdAt?.$date || ""
                );
                const dateB = new Date(
                    typeof b.createdAt === "string" ? b.createdAt : b.createdAt?.$date || ""
                );
                return dateB.getTime() - dateA.getTime();
            })
            .map((parcel, index) => ({
                id: index + 1,
                trackingNumber: generateTrackingNumber(parcel),
                senderName: parcel.senderInfo?.name || "Unknown Sender",
                recipientName: parcel.receiverInfo?.name || "Unknown Recipient",
                status: parcel.currentStatus || parcel.status || "pending",
                isUrgent: parcel.deliveryInfo?.isUrgent || false,
                createdAt:
                    typeof parcel.createdAt === "string"
                        ? parcel.createdAt
                        : parcel.createdAt?.$date || new Date().toISOString(),
            }));
    }

    private static calculateParcelStats(parcels: any[], totalCount: number) {
        return {
            total: totalCount,
            pending: parcels.filter(
                (p) => (p.currentStatus || p.status || "").toLowerCase() === "pending"
            ).length,
            inTransit: parcels.filter((p) =>
                [
                    "in_transit",
                    "shipped",
                    "on_the_way",
                    "in transit",
                    "out-for-delivery",
                ].includes((p.currentStatus || p.status || "").toLowerCase())
            ).length,
            delivered: parcels.filter(
                (p) => (p.currentStatus || p.status || "").toLowerCase() === "delivered"
            ).length,
            flagged: parcels.filter((p) => p.isFlagged).length,
            urgent: parcels.filter((p) => p.deliveryInfo?.isUrgent || p.isUrgent).length,
        };
    }

    private static generateActivities(
        parcels: RecentParcel[],
        userStats: any,
        parcelStats: any
    ): Activity[] {
        const activities: Activity[] = [];
        let activityId = 1;

        // Activities from recent parcels
        parcels.slice(0, 2).forEach((parcel) => {
            if (parcel.status.toLowerCase() === "delivered") {
                activities.push({
                    id: activityId++,
                    action: "Parcel delivered",
                    details: parcel.trackingNumber,
                    time: getRelativeTime(parcel.createdAt),
                    type: "success",
                    icon: CheckCircle,
                });
            } else {
                activities.push({
                    id: activityId++,
                    action: "New parcel created",
                    details: parcel.trackingNumber,
                    time: getRelativeTime(parcel.createdAt),
                    type: "create",
                    icon: Plus,
                });
            }
        });

        // User registration activity
        if (userStats.newThisMonth > 0) {
            activities.push({
                id: activityId++,
                action: "User registered",
                details: `${userStats.newThisMonth} new customer${userStats.newThisMonth > 1 ? "s" : ""
                    } this month`,
                time: "Recent",
                type: "info",
                icon: Users,
            });
        }

        // Flagged parcels activity
        if (parcelStats.flagged > 0) {
            activities.push({
                id: activityId++,
                action: "Issues flagged",
                details: `${parcelStats.flagged} parcel${parcelStats.flagged > 1 ? "s" : ""
                    } need attention`,
                time: "Ongoing",
                type: "warning",
                icon: AlertTriangle,
            });
        }

        return activities.slice(0, 4);
    }
}