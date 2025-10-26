// User Management Hooks
// This file contains custom hooks for user management operations

import api from "../../../services/ApiConfiguration";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { ApiUser, User, UserForm, UserStats, UserUpdateForm } from "./types";

// Hook for managing user data and operations
export function useUserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Transform API user to internal User format
    const transformApiUser = (apiUser: ApiUser): User => {
        const userId = apiUser.id || apiUser._id || Date.now();
        
        // Smart status mapping
        let userStatus: User["status"] = "pending";
        if (apiUser.status) {
            userStatus = apiUser.status as User["status"];
        } else if (apiUser.isBlocked !== undefined) {
            userStatus = apiUser.isBlocked ? "blocked" : "active";
        }

        return {
            id: userId,
            name: apiUser.name || "Unknown User",
            email: apiUser.email || "",
            role: (apiUser.role as User["role"]) || "user",
            status: userStatus,
            phoneNumber: apiUser.phoneNumber || apiUser.phone || "",
            address: {
                street: apiUser.address?.street || "",
                city: apiUser.address?.city || "",
                state: apiUser.address?.state || "",
                zipCode: apiUser.address?.zipCode || "",
            },
            createdAt: apiUser.createdAt || new Date().toISOString(),
            updatedAt: apiUser.updatedAt || new Date().toISOString(),
        };
    };

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get("/users");

            const apiUsers = Array.isArray(response.data) 
                ? response.data 
                : response.data.users || response.data.data || [];

            const transformedUsers = apiUsers
                .filter((user: ApiUser) => user && user.email)
                .map(transformApiUser);

            setUsers(transformedUsers);
        } catch (error) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new user
    const createUser = useCallback(async (formData: Partial<User>) => {
        try {
            setActionLoading(true);

            // Convert Partial<User> to UserForm with required fields
            const userFormData: UserForm = {
                name: formData.name || "",
                email: formData.email || "",
                password: "defaultPassword123",
                role: formData.role || "user",
                phone: formData.phoneNumber || "",
                address: {
                    street: formData.address?.street || "",
                    city: formData.address?.city || "",
                    state: formData.address?.state || "",
                    zipCode: formData.address?.zipCode || "",
                },
            };

            const response = await api.post("/users", userFormData);

            await fetchUsers();
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [fetchUsers]);

    // Update existing user
    const updateUser = useCallback(async (userId: string | number, formData: Partial<User>) => {
        try {
            setActionLoading(true);

            // Convert Partial<User> to UserUpdateForm
            const updateData: UserUpdateForm = {
                name: formData.name || "",
                email: formData.email || "",
                role: (formData.role as "admin" | "sender" | "receiver") || "receiver",
                phone: formData.phoneNumber || "",
                address: {
                    street: formData.address?.street || "",
                    city: formData.address?.city || "",
                    state: formData.address?.state || "",
                    zipCode: formData.address?.zipCode || "",
                },
            };

            await api.put(`/users/${userId}`, updateData);

            await fetchUsers();
            return { success: true };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [fetchUsers]);

    // Delete user
    const deleteUser = useCallback(async (userId: string | number) => {
        try {
            setActionLoading(true);

            await api.delete(`/users/${userId}`);

            await fetchUsers();
            return { success: true };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [fetchUsers]);

    // Toggle user block status
    const toggleUserStatus = useCallback(async (userId: string | number, reason?: string) => {
        try {
            setActionLoading(true);

            const user = users.find((u) => u.id === userId);
            if (!user) {
                throw new Error("User not found");
            }

            const isCurrentlyBlocked = user.status === "blocked";
            const newStatus = isCurrentlyBlocked ? "active" : "blocked";

            const payload = {
                isBlocked: !isCurrentlyBlocked,
                reason: reason || "No reason provided",
            };

            await api.patch(`/users/${userId}/block-status`, payload);

            await fetchUsers();
            return { success: true };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [users, fetchUsers]);

    // Refresh users
    const refreshUsers = useCallback(async () => {
        await fetchUsers();
    }, [fetchUsers]);

    // Initial fetch
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        actionLoading,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        refreshUsers,
    };
}


