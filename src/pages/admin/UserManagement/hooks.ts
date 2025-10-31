

import api from "../../../services/ApiConfiguration";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import { ApiUser, User, UserForm, UserStats, UserUpdateForm } from "./types";
import { adminCache, CACHE_KEYS, invalidateRelatedCaches } from "../../../utils/adminCache";

export function useUserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const isMountedRef = useRef(false);
    const fetchingRef = useRef(false);

    const transformApiUser = (apiUser: ApiUser): User => {
        const userId = apiUser.id || apiUser._id || Date.now();

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

    const fetchUsers = useCallback(async (force: boolean = false) => {
        
        if (fetchingRef.current) return;

        try {
            fetchingRef.current = true;

            if (!force) {
                const cachedUsers = adminCache.get<User[]>(CACHE_KEYS.USERS);
                if (cachedUsers) {
                    setUsers(cachedUsers);
                    setLoading(false);
                    fetchingRef.current = false;
                    return;
                }
            }

            setLoading(true);

            const response = await api.get("/users");

            const apiUsers = Array.isArray(response.data) 
                ? response.data 
                : response.data.users || response.data.data || [];

            const transformedUsers = apiUsers
                .filter((user: ApiUser) => user && user.email)
                .map(transformApiUser);

            adminCache.set(CACHE_KEYS.USERS, transformedUsers);

            setUsers(transformedUsers);
        } catch (error) {
            setUsers([]);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            fetchUsers(false); 
        }
    }, [fetchUsers]);

    const createUser = useCallback(async (formData: Partial<User>) => {
        try {
            setActionLoading(true);

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

            adminCache.invalidate(CACHE_KEYS.USERS);
            await fetchUsers(true);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [fetchUsers]);

    const updateUser = useCallback(async (userId: string | number, formData: Partial<User>) => {
        try {
            setActionLoading(true);

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

            invalidateRelatedCaches('user', String(userId));
            await fetchUsers(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [fetchUsers]);

    const deleteUser = useCallback(async (userId: string | number) => {
        try {
            setActionLoading(true);

            await api.delete(`/users/${userId}`);

            invalidateRelatedCaches('user', String(userId));
            await fetchUsers(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [fetchUsers]);

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

            invalidateRelatedCaches('user', String(userId));
            await fetchUsers(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error as Error };
        } finally {
            setActionLoading(false);
        }
    }, [users, fetchUsers]);

    const refreshUsers = useCallback(async () => {
        await fetchUsers(true); 
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

