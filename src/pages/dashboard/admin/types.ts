import { Plus } from "lucide-react";

export interface DashboardStats {
    users: {
        total: number;
        active: number;
        blocked: number;
        newThisMonth: number;
    };
    parcels: {
        total: number;
        pending: number;
        inTransit: number;
        delivered: number;
        flagged: number;
        urgent: number;
    };
}

export interface RecentParcel {
    id: number;
    trackingNumber: string;
    senderName: string;
    recipientName: string;
    status: string;
    isUrgent: boolean;
    createdAt: string;
}

export interface Activity {
    id: number;
    action: string;
    details: string;
    time: string;
    type: "create" | "success" | "info" | "warning";
    icon: typeof Plus;
}

export interface ApiUser {
    id?: number;
    _id?: string;
    status?: string;
    isActive?: boolean;
    isBlocked?: boolean;
    createdAt?: string;
    created_at?: string;
    joinedAt?: string;
}

export interface ApiParcelForDashboard {
    _id?: string;
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
    status?: string; // fallback to currentStatus
}

export interface ConfirmAction {
    type: "cancel" | "delete" | "confirm";
    parcelId: string;
    trackingNumber: string;
}

export interface MonthlyData {
    month: string;
    parcels: number;
    delivered: number;
    shipments: number;
    deliveryRate: number;
}

export interface StatCard {
    title: string;
    value: number;
    icon: any;
    color: string;
    change: string;
    trend: "up" | "down" | "neutral";
    gradient: string;
    iconBg: string;
    iconColor: string;
}