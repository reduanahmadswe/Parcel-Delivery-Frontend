

export interface ApiParcel {
    id?: number;
    _id?: string | number; 
    senderId?: string;
    receiverId?: string;
    senderInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    };
    receiverInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    };
    parcelDetails?: {
        type?: string;
        weight?: number;
        dimensions?: {
            length?: number;
            width?: number;
            height?: number;
        };
        description?: string;
        value?: number;
    };
    deliveryInfo?: {
        preferredDeliveryDate?: string | { $date: string };
        deliveryInstructions?: string;
        isUrgent?: boolean;
    };
    fee?: {
        baseFee?: number;
        weightFee?: number;
        urgentFee?: number;
        totalFee?: number;
        isPaid?: boolean;
    };
    currentStatus?: string;
    statusHistory?: Array<{
        status?: string;
        timestamp?: string | { $date: string };
        updatedBy?: string;
        updatedByType?: string;
        note?: string;
    }>;
    assignedDeliveryPersonnel?: string | null;
    isFlagged?: boolean;
    isHeld?: boolean;
    isBlocked?: boolean;
    createdAt?: string | { $date: string };
    updatedAt?: string | { $date: string };
    trackingId?: string;
    
    trackingNumber?: string;
    tracking_number?: string;
    status?: string; 
    
    type?: string;
    parcelType?: string;
    description?: string;
    weight?: number;
    weightInKg?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    length?: number;
    width?: number;
    height?: number;
    senderName?: string;
    sender?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    sender_name?: string;
    senderEmail?: string;
    sender_email?: string;
    senderPhone?: string;
    sender_phone?: string;
    recipientName?: string;
    recipient?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        };
    };
    receiver?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    recipient_name?: string;
    receiver_name?: string;
    recipientEmail?: string;
    recipient_email?: string;
    receiver_email?: string;
    recipientPhone?: string;
    recipient_phone?: string;
    receiver_phone?: string;
    recipientAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    deliveryAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    cost?: number;
    price?: number;
    amount?: number;
    deliveryType?: string;
    delivery_type?: string;
    isInsured?: boolean;
    is_insured?: boolean;
    isUrgent?: boolean;
    is_urgent?: boolean;
    priority?: string;
    is_flagged?: boolean;
    isOnHold?: boolean;
    is_on_hold?: boolean;
    assignedPersonnel?: string;
    assigned_personnel?: string;
    assignedTo?: string;
    [key: string]: unknown; 
}

export interface Parcel extends Record<string, unknown> {
    id: string | number;
    trackingNumber: string;
    type: string;
    description: string;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    status:
    | "requested"
    | "approved"
    | "dispatched"
    | "in-transit"
    | "delivered"
    | "cancelled"
    | "returned";
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
    isUrgent: boolean;
    isFlagged: boolean;
    isOnHold: boolean;
    assignedPersonnel: string;
    createdAt: string;
    updatedAt: string;
    currentLocation?: string;
}

export interface StatusLogEntry {
    id?: string | number;
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string;
}

export interface NotificationState {
    type: "success" | "error" | "info";
    message: string;
}

export interface FilterParams {
    senderEmail: string;
    receiverEmail: string;
    status: string;
    trackingNumber: string;
}

export const STATUS_OPTIONS = [
    "requested",
    "approved",
    "dispatched",
    "in-transit",
    "delivered",
    "cancelled",
    "returned",
] as const;

export type ParcelStatus = typeof STATUS_OPTIONS[number];

