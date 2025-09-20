import { Parcel, ParcelStats, SearchFilters } from "../types";

export const receiverUtils = {
    // Calculate statistics from parcels array
    calculateStats(parcels: Parcel[]): ParcelStats {
        return {
            total: parcels.length,
            pending: parcels.filter((p) => p.status === "pending").length,
            inTransit: parcels.filter((p) => p.status === "in_transit").length,
            delivered: parcels.filter((p) => p.status === "delivered").length,
            cancelled: parcels.filter((p) => p.status === "cancelled").length,
        };
    },

    // Filter and sort parcels based on search criteria
    filterAndSortParcels(
        parcels: Parcel[],
        filters: SearchFilters
    ): Parcel[] {
        let filtered = parcels.filter((parcel) => {
            const matchesFilter = filters.filter === "all" || parcel.status === filters.filter;
            const matchesSearch = filters.searchTerm === "" ||
                parcel.trackingNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                parcel.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                parcel.senderName.toLowerCase().includes(filters.searchTerm.toLowerCase());
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

    // Add mock data for enhanced demo experience
    enhanceParcelsWithMockData(parcels: Parcel[]): Parcel[] {
        return parcels.map((parcel) => ({
            ...parcel,
            estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            rating: parcel.status === "delivered" ? Math.floor(Math.random() * 2) + 4 : undefined
        }));
    },

    // Format delivery date
    formatDeliveryDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    },

    // Get priority level based on parcel attributes
    getParcelPriority(parcel: Parcel): "high" | "medium" | "low" {
        if (parcel.isInsured && parcel.cost > 100) return "high";
        if (parcel.deliveryType === "express" || parcel.cost > 50) return "medium";
        return "low";
    },

    // Generate export data for parcels
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
                parcel.trackingNumber,
                parcel.status,
                parcel.senderName,
                `"${parcel.description}"`,
                parcel.weight,
                parcel.cost,
                new Date(parcel.createdAt).toLocaleDateString(),
                parcel.estimatedDelivery ? new Date(parcel.estimatedDelivery).toLocaleDateString() : "N/A"
            ].join(","))
        ].join("\n");

        return csvData;
    },

    // Download CSV file
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