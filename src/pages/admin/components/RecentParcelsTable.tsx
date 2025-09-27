"use client";

import React from "react";
import StatusBadge from "../../../components/common/StatusIndicatorBadge";
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
        <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-50/50 via-transparent to-green-50/50 dark:from-red-950/20 dark:to-green-950/20 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">
                                Recent Parcels
                            </h3>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Latest parcel activities and real-time updates
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="px-4 py-2 bg-muted/50 rounded-xl border border-border">
                            <span className="text-sm font-medium text-foreground">
                                {parcels.length} Total
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Card View - Hidden on md+ */}
            <div className="block md:hidden">
                {parcels.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-muted rounded-xl">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-base font-semibold text-foreground">No recent parcels</p>
                                <p className="text-sm text-muted-foreground">Parcel data will appear here once available.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 p-4">
                        {parcels.map((parcel, index) => (
                            <div key={parcel.id ? `mobile-parcel-${parcel.id}` : `mobile-parcel-row-${index}`} className="bg-muted/30 rounded-xl p-4 border border-border">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                            <Package className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{parcel.trackingNumber}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={parcel.status} variant="parcel" />
                                        {parcel.isUrgent && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                URGENT
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Sender</p>
                                        <p className="font-medium text-foreground truncate">{parcel.senderName}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Recipient</p>
                                        <p className="font-medium text-foreground truncate">{parcel.recipientName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-red-600" />
                                    Tracking Details
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-red-600" />
                                    Sender
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-600" />
                                    Recipient
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    Priority
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-red-600" />
                                    Created
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {parcels.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-16 text-center">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="p-6 bg-muted rounded-2xl">
                                            <Package className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-semibold text-foreground">No recent parcels</p>
                                            <p className="text-sm text-muted-foreground max-w-md">
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
                                    className="hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                                                <Package className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-foreground font-mono">
                                                    {parcel.trackingNumber}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                    Live Tracking
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="text-sm font-medium text-foreground truncate">{parcel.senderName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="text-sm font-medium text-foreground truncate">{parcel.recipientName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={parcel.status} variant="parcel" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {parcel.isUrgent ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                URGENT
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                Normal
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">
                                            {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {parcel.createdAt ? new Date(parcel.createdAt).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '--:--'}
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

