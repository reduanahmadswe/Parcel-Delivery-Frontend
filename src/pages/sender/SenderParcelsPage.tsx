"use client";

import { Calendar, Eye, Filter, Package, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/ApiConfiguration";
import { formatDate, getStatusColor } from "../../lib/HelperUtilities";
import { Parcel } from "../../types/GlobalTypeDefinitions";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SenderParcelsPage() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
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

  const filteredParcels = parcels.filter((parcel) => {
    const matchesFilter =
      filterStatus === "" || parcel.currentStatus === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["sender"]}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["sender"]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6 pb-24">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 border border-border rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  My Parcels
                </h1>
                <p className="text-muted-foreground">
                  Manage and track all your parcel deliveries
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-background rounded-lg shadow-sm border border-border p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by tracking ID or receiver name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="">All Status</option>
                  <option value="requested">Requested</option>
                  <option value="approved">Approved</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                </select>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("");
                  }}
                  className="px-4 py-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 flex items-center"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Parcels Table */}
          <div className="bg-background rounded-lg shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Parcels ({filteredParcels.length})
                </h2>
                <Link
                  to="/sender/create-parcel"
                  className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:shadow-lg text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 inline-flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Parcel
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredParcels.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchTerm || filterStatus
                      ? "No matching parcels found"
                      : "No parcels yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus
                      ? "Try adjusting your search or filter criteria."
                      : "Start by creating your first parcel delivery request."}
                  </p>
                  {!searchTerm && !filterStatus && (
                    <Link
                      to="/sender/create-parcel"
                      className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:shadow-lg text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Parcel
                    </Link>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Tracking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Receiver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Destination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredParcels.map((parcel) => (
                      <tr
                        key={parcel._id}
                        className="hover:bg-muted/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                                <Package className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-foreground">
                                {parcel.trackingId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {parcel.receiverInfo.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {parcel.receiverInfo.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">
                            {parcel.receiverInfo.address.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              parcel.currentStatus
                            )}`}
                          >
                            {parcel.currentStatus
                              .replace("-", " ")
                              .toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          ৳{parcel.fee?.totalFee || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(parcel.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/track?id=${parcel.trackingId}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                              title="Track parcel"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/status-history?id=${parcel.trackingId}`}
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                              title="View status history"
                            >
                              <Calendar className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
