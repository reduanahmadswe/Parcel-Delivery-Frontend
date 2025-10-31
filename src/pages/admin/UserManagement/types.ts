

export interface BlockUserReason {
    value: string;
    label: string;
}

export interface UserParcel {
    _id: string;
    trackingId: string;
    senderId: string;
    senderInfo: {
        name: string;
        email: string;
        phone: string;
    };
    receiverInfo: {
        name: string;
        email: string;
        phone: string;
    };
    parcelDetails: {
        type: string;
        weight: number;
        description: string;
    };
    status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface ApiUser {
    id?: number;
    _id?: string | number; 
    name?: string;
    email?: string;
    role?: "admin" | "sender" | "receiver" | "user";
    status?: "active" | "blocked" | "pending";
    isBlocked?: boolean; 
    phone?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown; 
}

export interface User extends Record<string, unknown> {
    id: string | number;
    _id?: string | number; 
    name: string;
    email: string;
    role: "admin" | "sender" | "receiver" | "user";
    status: "active" | "blocked" | "pending";
    phone?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface UserForm {
    name: string;
    email: string;
    password: string;
    role: "admin" | "sender" | "receiver" | "user";
    phone: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode: string;
    };
}

export interface UserUpdateForm {
    name: string;
    email: string;
    password?: string;
    role: "admin" | "sender" | "receiver";
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    pendingUsers: number;
    adminUsers: number;
    senderUsers: number;
    receiverUsers: number;
    newUsersThisMonth: number;
}

export type UserRole = "admin" | "sender" | "receiver";

export type UserStatus = "active" | "blocked" | "pending";

export type UserAction = "create" | "update" | "delete" | "toggleStatus" | "view";

