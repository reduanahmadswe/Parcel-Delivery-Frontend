import {
  AlertTriangle,
  Calendar,
  Edit,
  Eye,
  Mail,
  MapIcon,
  MapPin,
  Package,
  Phone,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetUserParcelsQuery } from "../../../features/parcels/parcelsApi";
import { BlockUserReason, User } from "./types";

// Enhanced Modal Component with modern animations
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

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Modal glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-background rounded-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Status Badge Component with animations
export function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          bg: "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40",
          text: "text-green-800 dark:text-green-300",
          border: "border-green-300/50 dark:border-green-600/50",
          shadow: "shadow-green-500/20",
          dot: "bg-green-500",
        };
      case "blocked":
        return {
          bg: "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40",
          text: "text-red-800 dark:text-red-300",
          border: "border-red-300/50 dark:border-red-600/50",
          shadow: "shadow-red-500/20",
          dot: "bg-red-500",
        };
      case "pending":
        return {
          bg: "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40",
          text: "text-yellow-800 dark:text-yellow-300",
          border: "border-yellow-300/50 dark:border-yellow-600/50",
          shadow: "shadow-yellow-500/20",
          dot: "bg-yellow-500",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40",
          text: "text-gray-800 dark:text-gray-300",
          border: "border-gray-300/50 dark:border-gray-600/50",
          shadow: "shadow-gray-500/20",
          dot: "bg-gray-500",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="relative group">
      <span
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${config.bg} ${config.text} ${config.border} shadow-sm hover:shadow-md hover:${config.shadow} transition-all duration-300 group-hover:scale-105`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></div>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
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

// Delete User Modal Component
export function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Delete User</h2>
              <p className="text-white/80 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">
                  Permanent Deletion Warning
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  You are about to permanently delete{" "}
                  <strong>{userName}</strong>'s account. This will remove all
                  associated data and cannot be recovered.
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-2">User Details:</h4>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Name:</span> {userName}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span> {userEmail}
              </p>
            </div>
          </div>

          {/* Consequences */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">
              This will permanently:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Delete all user account information
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Remove user access to the platform
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Delete associated user data and history
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-6 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// User Details Modal Component
export function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}) {
  // Use RTK Query to fetch user parcels
  const {
    data: parcelsResponse,
    isLoading: loading,
    error,
  } = useGetUserParcelsQuery(
    { userId: user?.id?.toString() || user?._id?.toString() || "" },
    { skip: !isOpen || !user }
  );

  const userParcels = parcelsResponse?.data || [];

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-600 dark:from-red-600 dark:to-red-700 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <p className="text-white/80 text-sm">
                Complete information for {user.name}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* User Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Personal Information
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Email Address
                    </p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="font-medium text-foreground">
                      {user.phoneNumber || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={user.status} />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                  <MapIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Address Information
                </h3>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {user.address?.street || "N/A"}
                      </p>
                      <p className="text-foreground">
                        {user.address?.city || "N/A"},{" "}
                        {user.address?.state || "N/A"}
                      </p>
                      <p className="text-foreground">
                        {user.address?.zipCode || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Close
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

// Modern Data Table Component with Cards Layout
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
    <div className="space-y-6">
      {/* Modern Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-hover:text-red-500 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-6 py-4 w-full border border-border/50 rounded-xl bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 hover:border-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl relative"
          />
        </div>
      </div>

      {/* Users Grid Layout */}
      <div className="grid grid-cols-1 gap-4">
        {data.map((user, index) => (
          <div
            key={index}
            className="group bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                {/* User Info Section */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar with gradient background */}
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* User Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-red-600 transition-colors duration-300 truncate">
                        {user.name}
                      </h3>
                      {/* Role Badge */}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400 shadow-sm">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{user.phoneNumber || user.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions Section */}
                <div className="flex items-center gap-4">
                  {/* Enhanced Status Badge */}
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={user.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 transition-all duration-300">
                    {columns
                      .find((col) => col.accessorKey === "actions")
                      ?.cell(user)}
                  </div>
                </div>
              </div>
            </div>

            {/* Animated bottom border */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {data.length === 0 && (
        <div className="text-center py-16">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-full blur-xl opacity-50"></div>
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No users found
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchTerm
              ? "We couldn't find any users matching your search criteria. Try adjusting your search terms."
              : "Your user directory is empty. Start building your team by adding your first user."}
          </p>
          {!searchTerm && (
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:-translate-y-0.5">
              <Plus className="w-4 h-4" />
              Add Your First User
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Modern Page Header Component with enhanced animations
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
    <div className="space-y-8">
      {/* Modern Header with gradient background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 via-red-600/5 to-transparent dark:from-red-900/20 dark:via-red-800/10 dark:to-transparent backdrop-blur-sm border border-red-500/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  User Management
                </h1>
              </div>
              <p className="text-muted-foreground text-lg ml-14">
                Manage users, roles, and access permissions with modern tools
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="group relative flex items-center space-x-3 px-6 py-3 bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 rounded-2xl transition-all duration-300 text-foreground font-medium shadow-lg hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-5 w-5 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                <span>Refresh</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
              </button>
              
              <button
                onClick={onCreateUser}
                className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 font-medium hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300"></div>
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with hover effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="group relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 rounded-2xl transition-all duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">
                Total Users
              </p>
              <p className="text-3xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                {statsLoading ? (
                  <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.total
                )}
              </p>
              <div className="text-xs text-muted-foreground">
                +{Math.floor(stats.total * 0.12)} this month
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="group relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:to-green-600/5 rounded-2xl transition-all duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-green-600 transition-colors duration-300">
                Active Users
              </p>
              <p className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform duration-300">
                {statsLoading ? (
                  <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.active
                )}
              </p>
              <div className="text-xs text-green-600">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Power className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Blocked Users Card */}
        <div className="group relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-600/0 group-hover:from-red-500/5 group-hover:to-red-600/5 rounded-2xl transition-all duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-red-600 transition-colors duration-300">
                Blocked Users
              </p>
              <p className="text-3xl font-bold text-red-600 group-hover:scale-105 transition-transform duration-300">
                {statsLoading ? (
                  <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.blocked
                )}
              </p>
              <div className="text-xs text-red-600">
                {stats.total > 0 ? Math.round((stats.blocked / stats.total) * 100) : 0}% of total
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <PowerOff className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Administrators Card */}
        <div className="group relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-600 transition-colors duration-300">
                Administrators
              </p>
              <p className="text-3xl font-bold text-purple-600 group-hover:scale-105 transition-transform duration-300">
                {statsLoading ? (
                  <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.admins
                )}
              </p>
              <div className="text-xs text-purple-600">
                {stats.total > 0 ? Math.round((stats.admins / stats.total) * 100) : 0}% of total
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

