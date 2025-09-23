"use client";

// Main User Management Component - Modern and Clean
// This file focuses on state orchestration and layout

import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import { Edit, Eye, Power, PowerOff, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  BlockUserModal,
  DataTable,
  DeleteUserModal,
  StatusBadge,
  UserDetailsModal,
  UserFormModal,
  UserManagementHeader,
} from "./components";
import { useUserManagement } from "./hooks";
import { User } from "./types";

export default function AdminUsersPage() {
  // State for modals and UI
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userToView, setUserToView] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Custom hook for user management logic
  const {
    users,
    loading,
    actionLoading,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshUsers,
  } = useUserManagement();

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search term changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handlers for user actions
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleViewUser = (user: User) => {
    setUserToView(user);
    setShowDetailsModal(true);
  };

  const handleBlockUser = (user: User) => {
    setUserToBlock(user);
    setShowBlockModal(true);
  };

  const handleBlockConfirm = async (reason: string) => {
    if (userToBlock) {
      await toggleUserStatus(userToBlock.id, reason);
      setShowBlockModal(false);
      setUserToBlock(null);
    }
  };

  const handleFormSubmit = async (userData: Partial<User>) => {
    if (isEditing && selectedUser) {
      await updateUser(selectedUser.id, userData);
    } else {
      await createUser(userData);
    }
    setIsCreating(false);
    setIsEditing(false);
    setSelectedUser(null);
  };

  // Table columns configuration
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user: User) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (user: User) => (
        <span className="text-muted-foreground">
          {user.phoneNumber || user.phone || "N/A"}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (user: User) => (
        <span className="text-muted-foreground">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewUser(user)}
            className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
            title="View User Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleBlockUser(user)}
            className={`p-2 rounded-lg transition-colors ${
              user.status === "blocked"
                ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                : "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
            }`}
            title={user.status === "blocked" ? "Unblock User" : "Block User"}
          >
            {user.status === "blocked" ? (
              <Power className="h-4 w-4" />
            ) : (
              <PowerOff className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => handleDeleteUser(user)}
            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
      <div className="min-h-screen bg-background mt-8">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6 pb-24">
          {/* Header with stats */}
          <UserManagementHeader
            searchTerm={searchTerm}
            filteredUsers={filteredUsers}
            setSearchTerm={handleSearchChange}
            loading={loading}
            statsLoading={loading}
            onRefresh={refreshUsers}
            onCreateUser={handleCreateUser}
          />

          {/* Users Table */}
          <div className="bg-background border border-border rounded-lg">
            <DataTable
              columns={columns}
              data={paginatedUsers}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-border bg-gradient-to-r from-red-50/10 via-transparent to-green-50/10 dark:from-red-950/5 dark:to-green-950/5 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                    disabled={currentPage === 1} 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage > 1 ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2))
                      .map((page) => (
                        <button 
                          key={page} 
                          onClick={() => setCurrentPage(page)} 
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${page === currentPage ? 'bg-red-600 text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                        >
                          {page}
                        </button>
                      ))
                    }
                  </div>

                  <button 
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages} 
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage < totalPages ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Form Modal */}
          <UserFormModal
            isOpen={isCreating || isEditing}
            onClose={() => {
              setIsCreating(false);
              setIsEditing(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onSubmit={handleFormSubmit}
            actionLoading={actionLoading}
          />

          {/* Block User Modal */}
          <BlockUserModal
            isOpen={showBlockModal}
            onClose={() => {
              setShowBlockModal(false);
              setUserToBlock(null);
            }}
            onConfirm={handleBlockConfirm}
            userName={userToBlock?.name || ""}
            isBlocked={userToBlock?.status === "blocked"}
          />

          {/* Delete User Modal */}
          <DeleteUserModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setUserToDelete(null);
            }}
            onConfirm={handleDeleteConfirm}
            userName={userToDelete?.name || ""}
            userEmail={userToDelete?.email || ""}
          />

          {/* User Details Modal */}
          {showDetailsModal && userToView && (
            <UserDetailsModal
              isOpen={showDetailsModal}
              onClose={() => {
                setShowDetailsModal(false);
                setUserToView(null);
              }}
              user={userToView}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

