"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthenticationContext";
import api from "@/lib/ApiConfiguration";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusIcon,
} from "@/lib/HelperUtilities";
import { Parcel } from "@/types/GlobalTypeDefinitions";
import {
  Calendar,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SenderDashboard() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await api.get("/parcels/me");
      setParcels(response.data.data);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      toast.error("Failed to fetch parcels");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelParcel = async (parcelId: string) => {
    if (!confirm("Are you sure you want to cancel this parcel?")) return;

    try {
      await api.patch(`/parcels/cancel/${parcelId}`, {
        note: "Cancelled by sender",
      });
      toast.success("Parcel cancelled successfully");
      fetchParcels();
    } catch (error) {
      toast.error(
        (error as ApiError).response?.data?.message || "Failed to cancel parcel"
      );
    }
  };

  const filteredParcels = parcels.filter((parcel) => {
    const matchesFilter = filter === "all" || parcel.currentStatus === filter;
    const matchesSearch =
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: parcels.length,
    pending: parcels.filter((p) =>
      ["requested", "approved"].includes(p.currentStatus)
    ).length,
    inTransit: parcels.filter((p) =>
      ["dispatched", "in-transit"].includes(p.currentStatus)
    ).length,
    delivered: parcels.filter((p) => p.currentStatus === "delivered").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["sender"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Sender Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.name}! Manage your parcel deliveries.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Parcels
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    In Transit
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.inTransit}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.delivered}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                My Parcels
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search parcels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="requested">Requested</option>
                    <option value="approved">Approved</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Create Parcel Button */}
                <Link
                  href="/sender/create-parcel"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Parcel
                </Link>
              </div>
            </div>
          </div>

          {/* Parcels List */}
          <div className="bg-white rounded-lg shadow-sm">
            {filteredParcels.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No parcels found
                </h3>
                <p className="text-gray-600 mb-4">
                  {parcels.length === 0
                    ? "You haven't created any parcels yet."
                    : "No parcels match your current filter."}
                </p>
                {parcels.length === 0 && (
                  <Link
                    href="/sender/create-parcel"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Parcel
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParcels.map((parcel) => (
                      <tr key={parcel._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 font-mono">
                              {parcel.trackingId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {parcel.receiverInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {parcel.receiverInfo.address.city},{" "}
                              {parcel.receiverInfo.address.state}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              parcel.currentStatus
                            )}`}
                          >
                            {getStatusIcon(parcel.currentStatus)}{" "}
                            {parcel.currentStatus
                              .replace("-", " ")
                              .toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(parcel.fee.totalFee)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(parcel.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/track?id=${parcel.trackingId}`}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                            {["requested", "approved"].includes(
                              parcel.currentStatus
                            ) && (
                              <button
                                onClick={() => handleCancelParcel(parcel._id)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
