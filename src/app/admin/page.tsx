"use client";

import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  DollarSign,
  Eye,
  Filter,
  Package,
  Search,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Parcel {
  id: number;
  trackingNumber: string;
  type: string;
  description: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cost: number;
  deliveryType: string;
  isInsured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

interface DashboardStats {
  totalParcels: number;
  totalUsers: number;
  totalRevenue: number;
  activeDeliveries: number;
  pendingParcels: number;
  deliveredParcels: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalParcels: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    pendingParcels: 0,
    deliveredParcels: 0,
  });
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchDashboardData();
    }
  }, [user, loading]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, parcelsRes, usersRes] = await Promise.all([
        api.get("/users/stats"),
        api.get("/parcels"),
        api.get("/users"),
      ]);

      setStats(statsRes.data.data || statsRes.data);
      setParcels(parcelsRes.data.data || parcelsRes.data);
      setUsers(usersRes.data.data || usersRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateParcelStatus = async (parcelId: number, newStatus: string) => {
    try {
      setIsUpdating(true);
      await api.put(`/parcels/${parcelId}/status`, { status: newStatus });
      toast.success("Parcel status updated successfully");
      fetchDashboardData();
      setSelectedParcel(null);
    } catch (error) {
      console.error("Error updating parcel status:", error);
      toast.error("Failed to update parcel status");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteParcel = async (parcelId: number) => {
    if (!confirm("Are you sure you want to delete this parcel?")) return;

    try {
      await api.delete(`/parcels/${parcelId}`);
      toast.success("Parcel deleted successfully");
      fetchDashboardData();
      setSelectedParcel(null);
    } catch (error) {
      console.error("Error deleting parcel:", error);
      toast.error("Failed to delete parcel");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      confirmed: { color: "bg-blue-100 text-blue-800", text: "Confirmed" },
      picked_up: { color: "bg-purple-100 text-purple-800", text: "Picked Up" },
      in_transit: {
        color: "bg-orange-100 text-orange-800",
        text: "In Transit",
      },
      out_for_delivery: {
        color: "bg-indigo-100 text-indigo-800",
        text: "Out for Delivery",
      },
      delivered: { color: "bg-green-100 text-green-800", text: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || parcel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage parcels, users, and system operations
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview" },
                { id: "parcels", name: "Parcels" },
                { id: "users", name: "Users" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Parcels
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalParcels}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stats.totalRevenue}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Deliveries
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeDeliveries}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Parcels */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Parcels
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {parcels.slice(0, 5).map((parcel) => (
                  <div key={parcel.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {parcel.trackingNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {parcel.senderName} → {parcel.recipientName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(parcel.status)}
                        <span className="text-sm text-gray-500">
                          ${parcel.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Parcels Tab */}
        {activeTab === "parcels" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by tracking number, sender, or recipient..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parcels List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Parcels ({filteredParcels.length})
                </h2>
              </div>

              {filteredParcels.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No parcels found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredParcels.map((parcel) => (
                    <div key={parcel.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {parcel.trackingNumber}
                            </h3>
                            {getStatusBadge(parcel.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {parcel.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>
                              {parcel.senderName} → {parcel.recipientName}
                            </span>
                            <span>{parcel.weight}kg</span>
                            <span>${parcel.cost}</span>
                            <span>
                              {new Date(parcel.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedParcel(parcel)}
                            className="p-2 text-blue-600 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteParcel(parcel.id)}
                            className="p-2 text-red-600 hover:text-red-700"
                            title="Delete Parcel"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Users ({users.length})
              </h2>
            </div>

            {users.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span className="capitalize">{user.role}</span>
                          <span>{user.phone}</span>
                          <span>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "sender"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Parcel Details Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Manage Parcel
              </h2>
              <button
                onClick={() => setSelectedParcel(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Update Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "confirmed",
                    "picked_up",
                    "in_transit",
                    "out_for_delivery",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateParcelStatus(selectedParcel.id, status)
                      }
                      disabled={isUpdating || selectedParcel.status === status}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        selectedParcel.status === status
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {status
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parcel Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Parcel Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Tracking:</span>{" "}
                    {selectedParcel.trackingNumber}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {selectedParcel.type}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedParcel.description}
                  </p>
                  <p>
                    <span className="font-medium">Weight:</span>{" "}
                    {selectedParcel.weight}kg
                  </p>
                  <p>
                    <span className="font-medium">Cost:</span> $
                    {selectedParcel.cost}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {getStatusBadge(selectedParcel.status)}
                  </p>
                </div>
              </div>

              {/* Sender & Recipient */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Sender
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedParcel.senderName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedParcel.senderEmail}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedParcel.senderPhone}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Recipient
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedParcel.recipientName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedParcel.recipientEmail}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedParcel.recipientPhone}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedParcel.recipientAddress.street},{" "}
                      {selectedParcel.recipientAddress.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Close
                </button>
                <button
                  onClick={() => deleteParcel(selectedParcel.id)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Parcel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
