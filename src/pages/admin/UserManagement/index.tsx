"use client";

import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import { Edit, Power, PowerOff, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  BlockUserModal,
  DataTable,
  DeleteUserModal,
  StatusBadge,
  UserFormModal,
  UserManagementHeader,
} from "./components";
import { useUserManagement } from "./hooks";
import { User } from "./types";

export default function AdminUsersPage() {
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

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

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (user: User) => (
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground text-xs sm:text-sm truncate">{user.name}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user: User) => (
        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap">
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
        <span className="text-muted-foreground text-xs sm:text-sm">
          {user.phoneNumber || user.phone || "N/A"}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (user: User) => (
        <span className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (user: User) => (
        <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
          <button
            onClick={() => handleEditUser(user)}
            className="group relative p-1.5 sm:p-2 lg:p-3 text-blue-600 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 overflow-hidden"
            title="Edit User"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <button
            onClick={() => handleBlockUser(user)}
            className={`group relative p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${
              user.status === "blocked"
                ? "text-green-600 hover:text-white hover:shadow-green-500/25"
                : "text-red-600 hover:text-white hover:shadow-red-500/25"
            }`}
            title={user.status === "blocked" ? "Unblock User" : "Block User"}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl ${
              user.status === "blocked"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}></div>
            {user.status === "blocked" ? (
              <Power className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <PowerOff className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
          <button
            onClick={() => handleDeleteUser(user)}
            className="group relative p-1.5 sm:p-2 lg:p-3 text-red-600 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 overflow-hidden"
            title="Delete User"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 mt-4 sm:mt-6 lg:mt-8">
        <div className="max-w-7xl mx-auto pt-1 sm:pt-2 px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 lg:space-y-8 pb-12 sm:pb-16 lg:pb-24">
          {}
          <UserManagementHeader
            searchTerm={searchTerm}
            filteredUsers={filteredUsers}
            setSearchTerm={handleSearchChange}
            loading={loading}
            statsLoading={loading}
            onRefresh={refreshUsers}
            onCreateUser={handleCreateUser}
          />

          {}
          <DataTable
            columns={columns}
            data={paginatedUsers}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {}
          {filteredUsers.length > 0 && (
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
              <div className="relative px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium text-center sm:text-left">
                      Showing <span className="text-foreground font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                      <span className="text-foreground font-bold">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{" "}
                      <span className="text-foreground font-bold">{filteredUsers.length}</span> users
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button 
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                      disabled={currentPage === 1} 
                      className={`group relative px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden ${
                        currentPage > 1 
                          ? 'bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5' 
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {currentPage > 1 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                      )}
                      <span className="relative z-10 hidden xs:inline">Previous</span>
                      <span className="relative z-10 xs:hidden">Prev</span>
                    </button>

                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                      {}
                      {(() => {
                        const maxVisiblePages = window.innerWidth < 640 ? 3 : 4;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        const pages = [];

                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              onClick={() => setCurrentPage(1)}
                              className="group relative px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                              <span className="relative z-10">1</span>
                            </button>
                          );
                          
                          if (startPage > 2) {
                            pages.push(
                              <span key="dots-start" className="px-1 sm:px-2 text-muted-foreground font-medium text-xs sm:text-sm">
                                ...
                              </span>
                            );
                          }
                        }

                        for (let page = startPage; page <= endPage; page++) {
                          pages.push(
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`group relative px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden ${
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

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="dots-end" className="px-1 sm:px-2 text-muted-foreground font-medium text-xs sm:text-sm">
                                ...
                              </span>
                            );
                          }
                          
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => setCurrentPage(totalPages)}
                              className="group relative px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 text-foreground hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5"
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
                      className={`group relative px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden ${
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

          {}
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

          {}
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

          {}
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
        </div>
      </div>
    </AdminLayout>
  );
}

