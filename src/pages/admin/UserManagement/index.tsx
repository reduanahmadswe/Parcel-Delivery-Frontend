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
            className="group relative p-3 text-purple-600 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 overflow-hidden"
            title="View User Details"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Eye className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="group relative p-3 text-blue-600 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 overflow-hidden"
            title="Edit User"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Edit className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <button
            onClick={() => handleBlockUser(user)}
            className={`group relative p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${
              user.status === "blocked"
                ? "text-green-600 hover:text-white hover:shadow-green-500/25"
                : "text-red-600 hover:text-white hover:shadow-red-500/25"
            }`}
            title={user.status === "blocked" ? "Unblock User" : "Block User"}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${
              user.status === "blocked"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}></div>
            {user.status === "blocked" ? (
              <Power className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <PowerOff className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
          <button
            onClick={() => handleDeleteUser(user)}
            className="group relative p-3 text-red-600 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 overflow-hidden"
            title="Delete User"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Trash2 className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 mt-8">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-8 pb-24">
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

          {/* Modern Users Grid */}
          <DataTable
            columns={columns}
            data={paginatedUsers}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {/* Modern Pagination */}
          {filteredUsers.length > 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
              <div className="relative px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                      Showing <span className="text-foreground font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                      <span className="text-foreground font-bold">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{" "}
                      <span className="text-foreground font-bold">{filteredUsers.length}</span> users
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                      disabled={currentPage === 1} 
                      className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                        currentPage > 1 
                          ? 'bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5' 
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {currentPage > 1 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                      )}
                      <span className="relative z-10">Previous</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {/* Smart Pagination - Show only 4 pages at a time */}
                      {(() => {
                        const maxVisiblePages = 4;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        // Adjust start page if we're near the end
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        const pages = [];
                        
                        // Show first page if not in range
                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              onClick={() => setCurrentPage(1)}
                              className="group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                              <span className="relative z-10">1</span>
                            </button>
                          );
                          
                          if (startPage > 2) {
                            pages.push(
                              <span key="dots-start" className="px-2 text-muted-foreground font-medium">
                                ...
                              </span>
                            );
                          }
                        }

                        // Show visible page range
                        for (let page = startPage; page <= endPage; page++) {
                          pages.push(
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                                page === currentPage 
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' 
                                  : 'bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5'
                              }`}
                            >
                              {page !== currentPage && (
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                              )}
                              <span className="relative z-10">{page}</span>
                            </button>
                          );
                        }

                        // Show last page if not in range
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="dots-end" className="px-2 text-muted-foreground font-medium">
                                ...
                              </span>
                            );
                          }
                          
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => setCurrentPage(totalPages)}
                              className="group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                              <span className="relative z-10">{totalPages}</span>
                            </button>
                          );
                        }

                        return pages;
                      })()}
                    </div>

                    <button 
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                      disabled={currentPage === totalPages} 
                      className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                        currentPage < totalPages 
                          ? 'bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5' 
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {currentPage < totalPages && (
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                      )}
                      <span className="relative z-10">Next</span>
                    </button>
                  </div>
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

