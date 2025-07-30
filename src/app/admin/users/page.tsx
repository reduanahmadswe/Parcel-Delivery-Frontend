"use client";

import AdminLayout from "@/components/admin/AdminDashboardLayout";
import ConfirmDialog from "@/components/admin/ConfirmationDialog";
import Modal from "@/components/admin/ModalDialogComponent";
import DataTable, { Column } from "@/components/admin/ReusableDataTable";
import StatusBadge from "@/components/admin/StatusIndicatorBadge";
import api from "@/lib/ApiConfiguration";
import { Edit, Eye, Shield, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface User extends Record<string, unknown> {
  id: number;
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      const usersData = response.data.data || response.data;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setActionLoading(true);
      await api.post("/users", formData);
      await fetchUsers();
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const updateData: UserUpdateForm = { ...formData };
      if (!updateData.password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...dataWithoutPassword } = updateData;
        await api.put(`/users/${selectedUser.id}`, dataWithoutPassword);
      } else {
        await api.put(`/users/${selectedUser.id}`, updateData);
      }
      await fetchUsers();
      setIsEditing(false);
      setSelectedUser(null);
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await api.delete(`/users/${selectedUser.id}`);
      await fetchUsers();
      setShowConfirmDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async (user: User) => {
    try {
      setActionLoading(true);
      // Use the correct block/unblock API endpoint
      await api.put(`/users/${user.id}/block-status`);
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
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
    },
    {
      key: "email" as keyof User,
      header: "Email",
      sortable: true,
    },
    {
      key: "role" as keyof User,
      header: "Role",
      sortable: true,
      render: (user: User) => <StatusBadge status={user.role} variant="user" />,
    },
    {
      key: "status" as keyof User,
      header: "Status",
      sortable: true,
      render: (user: User) => (
        <StatusBadge status={user.status} variant="custom" />
      ),
    },
    {
      key: "phone" as keyof User,
      header: "Phone",
      sortable: false,
    },
    {
      key: "createdAt" as keyof User,
      header: "Joined",
      sortable: true,
      render: (user: User) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: "actions" as keyof User,
      header: "Actions",
      sortable: false,
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openUserDetailsModal(user)}
            className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openEditModal(user)}
            className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStatusToggle(user)}
            className={`p-2 ${
              user.status === "active"
                ? "text-yellow-600 hover:text-yellow-700"
                : "text-green-600 hover:text-green-700"
            }`}
            title={user.status === "active" ? "Block User" : "Activate User"}
          >
            <Shield className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowConfirmDialog(true);
            }}
            className="p-2 text-red-600 hover:text-red-700"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              User Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage system users and their permissions
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <DataTable<User>
            data={users}
            columns={columns as Column<User>[]}
            loading={loading}
            searchPlaceholder="Search users by name, email, or phone..."
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                  </label>
                  <p className="text-slate-900 dark:text-slate-100 font-medium">
                    {selectedUser.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <StatusBadge status={selectedUser.role} variant="user" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <StatusBadge status={selectedUser.status} variant="custom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Phone
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
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
