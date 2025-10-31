import { Parcel } from "@/types/GlobalTypeDefinitions";
import { ParcelStats, SearchFilters } from "../types";

export const receiverUtils = {
    
    calculateStats(parcels: Parcel[]): ParcelStats {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const getStatusCount = (statusValues: string[]) => {
            const matches = parcels.filter(parcel => {
                const status = parcel.currentStatus || '';
                return statusValues.includes(status);
            });
            return matches.length;
        };

        const pending = getStatusCount(['requested', 'approved']);
        const inTransit = getStatusCount(['dispatched', 'in-transit']);
        const delivered = getStatusCount(['delivered']);
        const cancelled = getStatusCount(['cancelled', 'rejected']);

        const thisMonthDelivered = parcels.filter(parcel => {
            const isDelivered = parcel.currentStatus === 'delivered';
            const parcelDate = new Date(parcel.createdAt || parcel.updatedAt);
            return isDelivered && parcelDate >= thisMonthStart;
        }).length;

        const nonCancelled = parcels.length - cancelled;
        const successRate = nonCancelled > 0 ? Math.round((delivered / nonCancelled) * 100) : 0;

        const total = parcels.length;

        return {
            total: total,
            pending: pending,
            inTransit: inTransit,
            delivered: delivered,
            cancelled: cancelled,
            thisMonth: thisMonthDelivered,
            averagePerWeek: Math.round(thisMonthDelivered / 4),
            successRate: successRate,
            totalValue: parcels.reduce((total, parcel) => total + (parcel.fee.totalFee || 0), 0),
        };
    },

    filterAndSortParcels(
        parcels: Parcel[],
        filters: SearchFilters
    ): Parcel[] {
        let filtered = parcels.filter((parcel) => {
            const matchesFilter = filters.filter === "all" || parcel.currentStatus === filters.filter;
            const matchesSearch = filters.searchTerm === "" ||
                parcel.trackingId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                parcel.parcelDetails.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                parcel.senderInfo.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        return filtered.sort((a, b) => {
            const aValue = a[filters.sortBy as keyof Parcel];
            const bValue = b[filters.sortBy as keyof Parcel];
            const modifier = filters.sortOrder === "asc" ? 1 : -1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return aValue.localeCompare(bValue) * modifier;
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
                return (aValue - bValue) * modifier;
            }
            return 0;
        });
    },

    enhanceParcelsWithMockData(parcels: Parcel[]): Parcel[] {
        return parcels.map((parcel) => ({
            ...parcel,
            estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            rating: parcel.currentStatus === "delivered" ? Math.floor(Math.random() * 2) + 4 : undefined
        }));
    },

    formatDeliveryDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    },

    getParcelPriority(parcel: Parcel): "high" | "medium" | "low" {
        if ((parcel as any).isInsured && parcel.fee.totalFee > 100) return "high";
        if ((parcel as any).deliveryType === "express" || parcel.fee.totalFee > 50) return "medium";
        return "low";
    },

    generateExportData(parcels: Parcel[]): string {
        const headers = [
            "Tracking Number",
            "Status",
            "Sender",
            "Description",
            "Weight",
            "Cost",
            "Created Date",
            "Estimated Delivery"
        ];

        const csvData = [
            headers.join(","),
            ...parcels.map(parcel => [
                parcel.trackingId,
                parcel.currentStatus,
                parcel.senderInfo.name,
                `"${parcel.parcelDetails.description}"`,
                parcel.parcelDetails.weight,
                parcel.fee.totalFee,
                new Date(parcel.createdAt).toLocaleDateString(),
                (parcel as any).estimatedDelivery ? new Date((parcel as any).estimatedDelivery).toLocaleDateString() : "N/A"
            ].join(","))
        ].join("\n");

        return csvData;
    },

    downloadCSV(data: string, filename: string = "parcels.csv"): void {
        const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

