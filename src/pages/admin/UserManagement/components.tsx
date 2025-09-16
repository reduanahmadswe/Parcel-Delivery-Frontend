import {
  Edit,
  MapPin,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Shield,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { BlockUserReason, User } from "./types";

// Modal Component
export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-background rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}

// Status Badge Component
export function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}

// Block User Modal Component
export function BlockUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isBlocked,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userName: string;
  isBlocked: boolean;
}) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const predefinedReasons: BlockUserReason[] = [
    { value: "spam", label: "Spam or inappropriate content" },
    { value: "harassment", label: "Harassment or abusive behavior" },
    { value: "fraud", label: "Fraudulent activity" },
    { value: "violation", label: "Terms of service violation" },
    { value: "security", label: "Security concerns" },
    { value: "custom", label: "Other (specify below)" },
  ];

  const handleSubmit = () => {
    const finalReason = reason === "custom" ? customReason : reason;
    if (finalReason.trim()) {
      onConfirm(finalReason);
      setReason("");
      setCustomReason("");
      onClose();
    }
  };

  const handleClose = () => {
    setReason("");
    setCustomReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {isBlocked ? (
                <Power className="w-6 h-6 text-white" />
              ) : (
                <PowerOff className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isBlocked ? "Unblock User" : "Block User"}
              </h2>
              <p className="text-white/80 text-sm">
                {isBlocked
                  ? `Restore access for ${userName}`
                  : `Restrict access for ${userName}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isBlocked && (
            <>
              {/* Warning Message */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">
                      Blocking User Access
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      This action will prevent <strong>{userName}</strong> from
                      accessing their account and using the platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Select a reason for blocking{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {predefinedReasons.map((reasonOption) => (
                      <label
                        key={reasonOption.value}
                        className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="blockReason"
                          value={reasonOption.value}
                          checked={reason === reasonOption.value}
                          onChange={(e) => setReason(e.target.value)}
                          className="mt-1 text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {reasonOption.label}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Reason Input */}
                {reason === "custom" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Please specify the reason{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter the specific reason for blocking this user..."
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {isBlocked && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Power className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-300">
                    Unblock User Access
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    This will restore <strong>{userName}'s</strong> access to
                    their account and platform features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !isBlocked &&
                (!reason || (reason === "custom" && !customReason.trim()))
              }
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isBlocked
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-lg"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg"
              }`}
            >
              {isBlocked ? "Unblock User" : "Block User"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// User Form Modal Component
export function UserFormModal({
  isOpen,
  onClose,
  user,
  onSubmit,
  actionLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  actionLoading: boolean;
}) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const isEditing = Boolean(user);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      phoneNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        phoneNumber: user.phoneNumber || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      });
    } else {
      resetForm();
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-gradient-to-br from-background via-background to-muted/20">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {isEditing ? (
                <Edit className="w-6 h-6 text-white" />
              ) : (
                <Plus className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEditing ? "Edit User" : "Create New User"}
              </h2>
              <p className="text-white/80 text-sm">
                {isEditing
                  ? "Update user information and preferences"
                  : "Add a new user to the system"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role || "user"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as
                        | "admin"
                        | "user"
                        | "sender"
                        | "receiver",
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="sender">Sender</option>
                  <option value="receiver">Receiver</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Address Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address?.street || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        street: e.target.value,
                        city: formData.address?.city || "",
                        state: formData.address?.state || "",
                        zipCode: formData.address?.zipCode || "",
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address?.city || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        street: formData.address?.street || "",
                        city: e.target.value,
                        state: formData.address?.state || "",
                        zipCode: formData.address?.zipCode || "",
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.address?.state || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        street: formData.address?.street || "",
                        city: formData.address?.city || "",
                        state: e.target.value,
                        zipCode: formData.address?.zipCode || "",
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter state or province"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={formData.address?.zipCode || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        street: formData.address?.street || "",
                        city: formData.address?.city || "",
                        state: formData.address?.state || "",
                        zipCode: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter ZIP or postal code"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-6 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? (
                    <Edit className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isEditing ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// Data Table Component
export function DataTable({
  columns,
  data,
  searchTerm,
  onSearchChange,
}: {
  columns: any[];
  data: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.cell ? column.cell(row) : row[column.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No users found
            </h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Get started by adding your first user"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Page Header Component
export function UserManagementHeader({
  searchTerm,
  filteredUsers,
  setSearchTerm,
  loading,
  statsLoading,
  onRefresh,
  onCreateUser,
}: {
  searchTerm: string;
  filteredUsers: User[];
  setSearchTerm: (term: string) => void;
  loading: boolean;
  statsLoading: boolean;
  onRefresh: () => void;
  onCreateUser: () => void;
}) {
  const stats = {
    total: filteredUsers.length,
    active: filteredUsers.filter((u) => u.status === "active").length,
    blocked: filteredUsers.filter((u) => u.status === "blocked").length,
    admins: filteredUsers.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and access permissions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="group flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-900 font-medium shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onCreateUser}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">
                {statsLoading ? "..." : stats.total}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {statsLoading ? "..." : stats.active}
              </p>
            </div>
            <Power className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blocked Users</p>
              <p className="text-2xl font-bold text-red-600">
                {statsLoading ? "..." : stats.blocked}
              </p>
            </div>
            <PowerOff className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Administrators</p>
              <p className="text-2xl font-bold text-purple-600">
                {statsLoading ? "..." : stats.admins}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
