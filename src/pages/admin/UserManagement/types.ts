// User Management Types
// This file contains all TypeScript interfaces and types used in the User Management module

export interface BlockUserReason {
    value: string;
    label: string;
}

export interface ApiUser {
    id?: number;
    _id?: string | number; // MongoDB ObjectId
    name?: string;
    email?: string;
    role?: "admin" | "sender" | "receiver" | "user";
    status?: "active" | "blocked" | "pending";
    isBlocked?: boolean; // API might return this instead of status
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
    [key: string]: unknown; // For any additional fields
}

export interface User extends Record<string, unknown> {
    id: string | number;
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

// Role type for better type safety
export type UserRole = "admin" | "sender" | "receiver";

// Status type for better type safety  
export type UserStatus = "active" | "blocked" | "pending";

// Action types for user operations
export type UserAction = "create" | "update" | "delete" | "toggleStatus" | "view";