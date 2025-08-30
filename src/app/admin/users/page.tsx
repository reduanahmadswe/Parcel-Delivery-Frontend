"use client";

import AdminLayout from "@/components/admin/AdminDashboardLayout";
import ConfirmDialog from "@/components/admin/ConfirmationDialog";
import Modal from "@/components/admin/ModalDialogComponent";
import DataTable, { Column } from "@/components/admin/ReusableDataTable";
import StatusBadge from "@/components/admin/StatusIndicatorBadge";
import api from "@/lib/ApiConfiguration";
import { AxiosError } from "axios";
import {
  Edit,
  Eye,
  Package,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ApiUser {
  id?: number;
  _id?: string | number; // MongoDB ObjectId
  name?: string;
  email?: string;
  role?: "admin" | "sender" | "receiver";
  status?: "active" | "blocked" | "pending";
  phone?: string;
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

interface User extends Record<string, unknown> {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "sender" | "receiver";
  status: "active" | "blocked" | "pending";
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sender" | "receiver";
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface UserUpdateForm {
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

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  pendingUsers: number;
  adminUsers: number;
  senderUsers: number;
  receiverUsers: number;
  newUsersThisMonth: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    pendingUsers: 0,
    adminUsers: 0,
    senderUsers: 0,
    receiverUsers: 0,
    newUsersThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    role: "sender",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    fetchUsers(); // This will now also update the stats
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = users.filter((user) => {
        // Search in name, email, phone, and role
        const searchableFields = [
          user.name,
          user.email,
          user.phone,
          user.role,
          user.status,
        ];

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setStatsLoading(true);
      console.log("Fetching users from API...");
      console.log("API Base URL:", api.defaults.baseURL);

      // Try admin-specific endpoint first, fallback to general users endpoint
      let response;
      try {
        response = await api.get("/admin/users"); // Try admin endpoint first
        console.log("Using admin users endpoint");
      } catch {
        console.log(
          "Admin endpoint not available, trying general users endpoint"
        );
        response = await api.get("/users"); // Fallback to general endpoint
      }

      console.log("Full API response:", JSON.stringify(response.data, null, 2));

      // Try different possible data structures
      let usersData = null;
      if (response.data.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
        console.log("Using response.data.data");
      } else if (response.data.users && Array.isArray(response.data.users)) {
        usersData = response.data.users;
        console.log("Using response.data.users");
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
        console.log("Using response.data directly");
      } else {
        console.log("No valid users array found in response");
        usersData = [];
      }

      console.log("Extracted users data:", usersData);
      console.log("Users data type:", typeof usersData);
      console.log("Is array:", Array.isArray(usersData));
      console.log("Length:", usersData?.length);

      // Validate and normalize user data
      const validUsers: User[] =
        Array.isArray(usersData) && usersData.length > 0
          ? usersData.map((user: ApiUser, index: number) => {
              console.log(
                `Processing user ${index}:`,
                JSON.stringify(user, null, 2)
              );

              // Handle MongoDB _id field
              const userId = user.id || user._id || 0;

              const processedUser = {
                id: userId,
                name:
                  user.name ||
                  (user.username as string) ||
                  (user.fullName as string) ||
                  `User ${userId}`,
                email: user.email || `user${userId}@example.com`,
                role: (user.role || "sender") as
                  | "admin"
                  | "sender"
                  | "receiver",
                status: (user.status ||
                  ((user.isActive as boolean) ? "active" : "pending")) as
                  | "active"
                  | "blocked"
                  | "pending",
                phone:
                  user.phone ||
                  (user.phoneNumber as string) ||
                  (user.mobile as string) ||
                  `+8801${String(userId).padStart(9, "0")}`,
                address: {
                  street:
                    user.address?.street ||
                    ((user.address as Record<string, unknown>)
                      ?.line1 as string) ||
                    "Not specified",
                  city: user.address?.city || "Not specified",
                  state:
                    user.address?.state ||
                    ((user.address as Record<string, unknown>)
                      ?.division as string) ||
                    "Not specified",
                  zipCode:
                    user.address?.zipCode ||
                    ((user.address as Record<string, unknown>)
                      ?.postalCode as string) ||
                    "0000",
                },
                createdAt:
                  user.createdAt ||
                  (user.created_at as string) ||
                  new Date().toISOString(),
                updatedAt:
                  user.updatedAt ||
                  (user.updated_at as string) ||
                  new Date().toISOString(),
              } as User;

              console.log(
                `Processed user ${index}:`,
                JSON.stringify(processedUser, null, 2)
              );
              return processedUser;
            })
          : ([
              // Mock data for testing if no API data is available
              {
                id: 1,
                name: "Admin User",
                email: "admin@example.com",
                role: "admin",
                status: "active",
                phone: "+8801711234567",
                address: {
                  street: "123 Admin Street",
                  city: "Dhaka",
                  state: "Dhaka Division",
                  zipCode: "1000",
                },
                createdAt: new Date(
                  Date.now() - 30 * 24 * 60 * 60 * 1000
                ).toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 2,
                name: "John Sender",
                email: "john@example.com",
                role: "sender",
                status: "active",
                phone: "+8801987654321",
                address: {
                  street: "456 Sender Avenue",
                  city: "Chittagong",
                  state: "Chittagong Division",
                  zipCode: "4000",
                },
                createdAt: new Date(
                  Date.now() - 15 * 24 * 60 * 60 * 1000
                ).toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 3,
                name: "Jane Receiver",
                email: "jane@example.com",
                role: "receiver",
                status: "pending",
                phone: "+8801555666777",
                address: {
                  street: "789 Receiver Road",
                  city: "Sylhet",
                  state: "Sylhet Division",
                  zipCode: "3100",
                },
                createdAt: new Date(
                  Date.now() - 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 4,
                name: "Bob Blocked",
                email: "bob@example.com",
                role: "sender",
                status: "blocked",
                phone: "+8801444555666",
                address: {
                  street: "321 Blocked Street",
                  city: "Rajshahi",
                  state: "Rajshahi Division",
                  zipCode: "6000",
                },
                createdAt: new Date(
                  Date.now() - 60 * 24 * 60 * 60 * 1000
                ).toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ] as User[]);

      console.log("Final processed users:", validUsers.length);
      if (validUsers.length > 0 && usersData && usersData.length === 0) {
        console.log("Using mock data for testing - API returned no users");
      }
      console.log(
        "Sample processed user:",
        JSON.stringify(validUsers[0], null, 2)
      );

      // Debug: Log all users for table display
      console.log(
        "All users being set:",
        validUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
        }))
      );

      setUsers(validUsers);
      setFilteredUsers(validUsers); // Initialize filtered users

      // Calculate and update stats immediately from the fetched data
      updateStatsFromUsers(validUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      if ((error as AxiosError)?.response) {
        const axiosError = error as AxiosError;
        console.error("API Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }
      setUsers([]); // Set empty array on error
      setFilteredUsers([]); // Set empty filtered array on error
      // Set empty stats on error
      updateStatsFromUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate stats from users array
  const updateStatsFromUsers = (usersArray: User[]) => {
    console.log("Calculating stats from", usersArray.length, "users");

    const stats: UserStats = {
      totalUsers: usersArray.length,
      activeUsers: usersArray.filter((user) => user.status === "active").length,
      blockedUsers: usersArray.filter((user) => user.status === "blocked")
        .length,
      pendingUsers: usersArray.filter((user) => user.status === "pending")
        .length,
      adminUsers: usersArray.filter((user) => user.role === "admin").length,
      senderUsers: usersArray.filter((user) => user.role === "sender").length,
      receiverUsers: usersArray.filter((user) => user.role === "receiver")
        .length,
      newUsersThisMonth: usersArray.filter((user) => {
        if (!user.createdAt) return false;
        const userDate = new Date(user.createdAt);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return (
          userDate.getMonth() === currentMonth &&
          userDate.getFullYear() === currentYear
        );
      }).length,
    };

    console.log("Calculated stats:", stats);
    setUserStats(stats);
    setStatsLoading(false);
  };

  const handleCreateUser = async () => {
    try {
      setActionLoading(true);
      console.log("Creating new user with data:", formData);

      // Use POST method to create new user
      const response = await api.post("/users", formData);

      console.log("User created successfully:", response.data);
      await fetchUsers(); // This will automatically update stats
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      if ((error as AxiosError)?.response) {
        const axiosError = error as AxiosError;
        console.error("Create User Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      console.log("Updating user with ID:", selectedUser.id);
      console.log("Update data:", formData);

      const updateData: UserUpdateForm = { ...formData };
      if (!updateData.password || updateData.password.trim() === "") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...dataWithoutPassword } = updateData;
        console.log("Updating user without password");
        await api.put(`/users/${selectedUser.id}`, dataWithoutPassword);
      } else {
        console.log("Updating user with new password");
        await api.put(`/users/${selectedUser.id}`, updateData);
      }

      console.log("User updated successfully");
      await fetchUsers(); // This will automatically update stats
      setIsEditing(false);
      setSelectedUser(null);
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
      if ((error as AxiosError)?.response) {
        const axiosError = error as AxiosError;
        console.error("Update Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      console.log("Deleting user with ID:", selectedUser.id);
      console.log("Deleting user:", selectedUser.name);

      // Use DELETE method for user deletion
      await api.delete(`/users/${selectedUser.id}`);

      console.log(`User ${selectedUser.name} deleted successfully`);

      // Show detailed success feedback
      const successMessage = `✅ User "${selectedUser.name}" has been deleted successfully!\n\n🗑️ The following data has been removed:\n• User account and profile\n• All personal information\n• Associated parcel history\n• Access permissions\n\n⚠️ This action cannot be undone.`;
      alert(successMessage);

      await fetchUsers(); // This will automatically update stats
      setShowConfirmDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);

      // Show detailed error feedback
      const errorMessage = `❌ Failed to delete user "${
        selectedUser?.name || "Unknown"
      }"\n\n🔧 Possible reasons:\n• User has active parcels\n• Network connection issue\n• Server temporarily unavailable\n• Insufficient permissions\n\n💡 Try blocking the user first or contact support.`;
      alert(errorMessage);

      if ((error as AxiosError)?.response) {
        const axiosError = error as AxiosError;
        console.error("Delete Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async (user: User) => {
    try {
      setActionLoading(true);
      console.log("Toggling status for user with ID:", user.id);
      console.log("Current user status:", user.status);

      const currentStatus = user.status || "pending";
      const actionText = currentStatus === "active" ? "blocking" : "activating";
      const newStatus = currentStatus === "active" ? "blocked" : "active";

      console.log(`${actionText} user: ${user.name}`);

      // Use PATCH method for block/unblock status
      const response = await api.patch(`/users/${user.id}/block-status`);

      console.log("Status toggle response:", response.data);
      console.log(`User ${user.name} ${newStatus} successfully`);

      // Show detailed success feedback
      const successMessage =
        currentStatus === "active"
          ? `✅ User "${user.name}" has been blocked successfully!\n\n🚫 This user can no longer:\n• Log into the system\n• Create new parcels\n• Access their account\n\n⚡ You can unblock them anytime.`
          : `✅ User "${user.name}" has been activated successfully!\n\n✅ This user can now:\n• Log into the system\n• Create and manage parcels\n• Access all features\n\n🎉 They have full access restored!`;

      alert(successMessage);

      await fetchUsers(); // This will automatically update stats
    } catch (error) {
      console.error("Error updating user status:", error);

      const currentStatus = user.status || "pending";
      const actionText = currentStatus === "active" ? "block" : "activate";

      // Show detailed error feedback
      const errorMessage = `❌ Failed to ${actionText} user "${user.name}"\n\n🔧 Possible reasons:\n• Network connection issue\n• Server temporarily unavailable\n• User may not exist\n• Insufficient permissions\n\n💡 Please try again or contact support.`;
      alert(errorMessage);

      if ((error as AxiosError)?.response) {
        const axiosError = error as AxiosError;
        console.error("Status Toggle Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "sender",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone,
      address: user.address,
    });
    setIsEditing(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreating(true);
  };

  const openUserDetailsModal = (user: User) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const columns = [
    {
      key: "name" as keyof User,
      header: "Name",
      sortable: true,
      render: (value: unknown, user: User) => (
        <div className="font-medium text-foreground">{user.name || "N/A"}</div>
      ),
    },
    {
      key: "email" as keyof User,
      header: "Email",
      sortable: true,
      render: (value: unknown, user: User) => (
        <div className="text-muted-foreground">{user.email || "N/A"}</div>
      ),
    },
    {
      key: "role" as keyof User,
      header: "Role",
      sortable: true,
      render: (value: unknown, user: User) => (
        <StatusBadge status={user.role || "unknown"} variant="user" />
      ),
    },
    {
      key: "status" as keyof User,
      header: "Status",
      sortable: true,
      render: (value: unknown, user: User) => (
        <StatusBadge status={user.status || "pending"} variant="custom" />
      ),
    },
    {
      key: "phone" as keyof User,
      header: "Phone",
      sortable: false,
      render: (value: unknown, user: User) => (
        <div className="text-muted-foreground">{user.phone || "N/A"}</div>
      ),
    },
    {
      key: "createdAt" as keyof User,
      header: "Joined",
      sortable: true,
      render: (value: unknown, user: User) => {
        try {
          return (
            <div className="text-muted-foreground">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </div>
          );
        } catch {
          return <div className="text-muted-foreground">N/A</div>;
        }
      },
    },
    {
      key: "actions" as keyof User,
      header: "Actions",
      sortable: false,
      render: (value: unknown, user: User) => {
        // Add safety check for user object
        if (!user || !user.id) {
          return (
            <span className="text-muted-foreground">No actions available</span>
          );
        }

        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openUserDetailsModal(user)}
              className="p-2 text-muted-foreground hover:text-green-500 transition-colors duration-300"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => openEditModal(user)}
              className="p-2 text-muted-foreground hover:text-green-500 transition-colors duration-300"
              title="Edit User"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const currentStatus = user.status || "pending";
                const detailedMessage =
                  currentStatus === "active"
                    ? `🚫 Block User: ${user.name}\n\nThis will:\n• Prevent login access\n• Disable parcel creation\n• Suspend all activities\n\n⚠️ You can unblock them later.\n\nProceed?`
                    : `✅ Activate User: ${user.name}\n\nThis will:\n• Enable login access\n• Allow parcel creation\n• Restore full functionality\n\n🎉 User will have complete access.\n\nProceed?`;

                if (window.confirm(detailedMessage)) {
                  handleStatusToggle(user);
                }
              }}
              disabled={actionLoading}
              className={`p-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                (user.status || "pending") === "active"
                  ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  : "text-green-500 hover:text-green-600"
              }`}
              title={
                (user.status || "pending") === "active"
                  ? "Block User - Disable access"
                  : "Activate User - Enable access"
              }
            >
              {(user.status || "pending") === "active" ? (
                <ShieldX className="h-4 w-4" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowConfirmDialog(true);
              }}
              disabled={actionLoading}
              className="p-2 text-red-600 hover:text-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete User"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage system users and their permissions
            </p>
            {searchTerm && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>
                  Showing {filteredUsers.length} result
                  {filteredUsers.length !== 1 ? "s" : ""} for &ldquo;
                  {searchTerm}&rdquo;
                </span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchUsers(); // This will automatically refresh stats too
              }}
              disabled={loading || statsLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-background border border-border text-foreground rounded-md hover:bg-muted transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading || statsLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-md hover:shadow-lg transition-all duration-300"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Guide */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-blue-400 mt-1">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                User Management Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-800 dark:text-blue-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-green-500" />
                  <span>
                    <strong>Activate:</strong> Enable user access
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldX className="h-3 w-3 text-red-500" />
                  <span>
                    <strong>Block:</strong> Disable user access
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trash2 className="h-3 w-3 text-red-600" />
                  <span>
                    <strong>Delete:</strong> Permanently remove user
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {statsLoading ? "..." : userStats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {statsLoading
                    ? "..."
                    : userStats.activeUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/10">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Blocked Users
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {statsLoading
                    ? "..."
                    : userStats.blockedUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/10">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {statsLoading
                    ? "..."
                    : userStats.newUsersThisMonth.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500/10 to-yellow-600/10">
                <UserPlus className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Admin Users
              </h3>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {statsLoading ? "..." : userStats.adminUsers.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              System administrators
            </p>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Senders</h3>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10">
                <Package className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {statsLoading ? "..." : userStats.senderUsers.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Parcel senders</p>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Receivers
              </h3>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {statsLoading ? "..." : userStats.receiverUsers.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Parcel receivers
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow border border-border hover:shadow-lg transition-all duration-300">
          <DataTable<User>
            data={filteredUsers}
            columns={columns as Column<User>[]}
            loading={loading}
            searchPlaceholder="Search by name, email, phone, role, or status..."
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserDetailsModal}
        onClose={() => {
          setShowUserDetailsModal(false);
          setSelectedUser(null);
        }}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-foreground font-medium">
                    {selectedUser.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <StatusBadge status={selectedUser.role} variant="user" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <StatusBadge status={selectedUser.status} variant="custom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="text-foreground">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Joined
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Address Information
              </h3>
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                {selectedUser.address &&
                (selectedUser.address.street || selectedUser.address.city) ? (
                  <div className="space-y-2">
                    {selectedUser.address.street && (
                      <p className="text-slate-900 dark:text-slate-100">
                        <span className="font-medium">Street:</span>{" "}
                        {selectedUser.address.street}
                      </p>
                    )}
                    <p className="text-slate-900 dark:text-slate-100">
                      <span className="font-medium">City:</span>{" "}
                      {selectedUser.address.city || "Not provided"}
                    </p>
                    <p className="text-slate-900 dark:text-slate-100">
                      <span className="font-medium">State:</span>{" "}
                      {selectedUser.address.state || "Not provided"}
                    </p>
                    <p className="text-slate-900 dark:text-slate-100">
                      <span className="font-medium">ZIP Code:</span>{" "}
                      {selectedUser.address.zipCode || "Not provided"}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    No address information provided
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowUserDetailsModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowUserDetailsModal(false);
                  openEditModal(selectedUser);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit User
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isCreating || isEditing}
        onClose={() => {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedUser(null);
          resetForm();
        }}
        title={isEditing ? "Edit User" : "Create New User"}
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditing) {
              handleUpdateUser();
            } else {
              handleCreateUser();
            }
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password {isEditing ? "(leave blank to keep current)" : "*"}
              </label>
              <input
                type="password"
                required={!isEditing}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "admin" | "sender" | "receiver",
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="sender">Sender</option>
                <option value="receiver">Receiver</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Street
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setSelectedUser(null);
                resetForm();
              }}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {actionLoading
                ? "Saving..."
                : isEditing
                ? "Update User"
                : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        type="danger"
        loading={actionLoading}
      />
    </AdminLayout>
  );
}
