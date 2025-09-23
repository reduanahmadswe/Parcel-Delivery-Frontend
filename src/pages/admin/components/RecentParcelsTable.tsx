"use client";

import React from "react";
import StatusBadge from "@/pages/admin/StatusIndicatorBadge";
import { Package, Clock, User, MapPin, AlertCircle, TrendingUp } from "lucide-react";

interface RecentParcel {
    id: string | number;
    trackingNumber: string;
    senderName: string;
    recipientName: string;
    status: string;
    isUrgent: boolean;
    createdAt: string;
}

interface Props {
    parcels: RecentParcel[];
}

export default function RecentParcelsTable({ parcels }: Props) {
    return (
        <div className="bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-blue-900/20 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 mb-16 mt-8 overflow-hidden">
            {/* Modern Header with Glass Effect */}
            <div className="relative px-8 py-6 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-green-600/10 dark:from-blue-500/20 dark:via-purple-500/10 dark:to-green-500/20 border-b border-gray-200/30 dark:border-gray-700/30 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-white/60 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/60"></div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                            <div className="relative p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-red-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Recent Parcels
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Latest parcel activities and real-time updates
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {parcels.length} Total
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50/80 via-blue-50/30 to-purple-50/30 dark:from-gray-800/80 dark:via-blue-900/30 dark:to-purple-900/30 backdrop-blur-sm">
                        <tr>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                                        <Package className="h-4 w-4 text-white" />
                                    </div>
                                    Tracking Details
                                </div>
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-red-600" />
                                    Sender
                                </div>
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-600" />
                                    Recipient
                                </div>
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    Priority
                                </div>
                            </th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-red-600" />
                                    Created
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/50 dark:bg-gray-900/50 divide-y divide-gray-200/30 dark:divide-gray-700/30 backdrop-blur-sm">
                        {parcels.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-16 text-center">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-2xl"></div>
                                            <div className="relative p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg">
                                                <Package className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">No recent parcels</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                                                Parcel data will appear here once available. Start tracking your deliveries!
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            parcels.map((parcel, index) => (
                                <tr
                                    key={parcel.id ? `parcel-${parcel.id}` : `parcel-row-${index}`}
                                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-purple-50/30 hover:to-green-50/50 dark:hover:from-blue-900/20 dark:hover:via-purple-900/10 dark:hover:to-green-900/20 transition-all duration-500 group hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5 cursor-pointer transform hover:-translate-y-0.5"
                                >
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                                <div className="relative p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <Package className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-red-600 dark:text-red-400 font-mono tracking-wide bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-lg">
                                                    {parcel.trackingNumber}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                    Live Tracking
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{parcel.senderName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Sender</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-full flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{parcel.recipientName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Recipient</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="transform group-hover:scale-105 transition-transform duration-200">
                                            <StatusBadge status={parcel.status} variant="parcel" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        {parcel.isUrgent ? (
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                </div>
                                                <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-lg group-hover:shadow-red-500/25 transform group-hover:scale-105 transition-all duration-200">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    URGENT
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 group-hover:scale-105 transition-transform duration-200">
                                                Normal
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                {parcel.createdAt ? new Date(parcel.createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : '--:--'}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
