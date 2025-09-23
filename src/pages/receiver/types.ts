export interface Parcel {
    id: number;
    trackingNumber: string;
    type: string;
    description: string;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    status: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    recipientName: string;
    recipientEmail: string;
    recipientPhone: string;
    recipientAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    cost: number;
    deliveryType: string;
    isInsured: boolean;
    createdAt: string;
    updatedAt: string;
    estimatedDelivery?: string;
    rating?: number;
}

export interface ParcelStats {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
    thisMonth: number;
    averagePerWeek: number;
    successRate: number;
    totalValue: number;
}

export interface SearchFilters {
    filter: string;
    searchTerm: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

