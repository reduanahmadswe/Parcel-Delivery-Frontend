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
            {}
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-50/50 via-transparent to-green-50/50 dark:from-red-950/20 dark:to-green-950/20 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg flex-shrink-0">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                                Recent Parcels
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-0.5 sm:mt-1">
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                <span className="line-clamp-1">Latest parcel activities and real-time updates</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center self-start sm:self-center">
                        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-muted/50 rounded-xl border border-border">
                            <span className="text-xs sm:text-sm font-medium text-foreground">
                                {parcels.length} Total
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {}
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
                    <div className="space-y-3 p-3 sm:p-4">
                        {parcels.map((parcel, index) => (
                            <div key={parcel.id ? `mobile-parcel-${parcel.id}` : `mobile-parcel-row-${index}`} className="bg-muted/30 rounded-xl p-3 sm:p-4 border border-border">
                                <div className="flex items-start justify-between mb-3 gap-2">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{parcel.trackingNumber}</p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                                                {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                                        <StatusBadge status={parcel.status} variant="parcel" />
                                        {parcel.isUrgent && (
                                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-500 text-white whitespace-nowrap">
                                                <AlertCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                                URGENT
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <div className="min-w-0">
                                        <p className="text-muted-foreground mb-1">Sender</p>
                                        <p className="font-medium text-foreground truncate">{parcel.senderName}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-muted-foreground mb-1">Recipient</p>
                                        <p className="font-medium text-foreground truncate">{parcel.recipientName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <Package className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 flex-shrink-0" />
                                    <span className="hidden lg:inline">Tracking Details</span>
                                    <span className="lg:hidden">Tracking</span>
                                </div>
                            </th>
                            <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 flex-shrink-0" />
                                    <span>Sender</span>
                                </div>
                            </th>
                            <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 flex-shrink-0" />
                                    <span>Recipient</span>
                                </div>
                            </th>
                            <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">Status</th>
                            <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 flex-shrink-0" />
                                    <span>Priority</span>
                                </div>
                            </th>
                            <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 flex-shrink-0" />
                                    <span>Created</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {parcels.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
                                    <div className="flex flex-col items-center gap-4 sm:gap-6">
                                        <div className="p-4 sm:p-6 bg-muted rounded-2xl">
                                            <Package className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1 sm:space-y-2">
                                            <p className="text-base sm:text-lg font-semibold text-foreground">No recent parcels</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground max-w-md px-4">
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
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 lg:gap-3">
                                            <div className="p-1.5 lg:p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex-shrink-0">
                                                <Package className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 lg:gap-1 min-w-0">
                                                <span className="text-xs lg:text-sm font-semibold text-foreground font-mono truncate">
                                                    {parcel.trackingNumber}
                                                </span>
                                                <span className="text-[10px] lg:text-xs text-muted-foreground flex items-center gap-1">
                                                    <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                                                    <span className="hidden lg:inline">Live Tracking</span>
                                                    <span className="lg:hidden">Live</span>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                                        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="text-xs lg:text-sm font-medium text-foreground truncate">{parcel.senderName}</div>
                                        </div>
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                                        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                                <MapPin className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="text-xs lg:text-sm font-medium text-foreground truncate">{parcel.recipientName}</div>
                                        </div>
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                        <StatusBadge status={parcel.status} variant="parcel" />
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                        {parcel.isUrgent ? (
                                            <span className="inline-flex items-center px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                <AlertCircle className="h-2 w-2 lg:h-3 lg:w-3 mr-0.5 lg:mr-1" />
                                                <span className="hidden lg:inline">URGENT</span>
                                                <span className="lg:hidden">URG</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                Normal
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                        <div className="text-xs lg:text-sm text-foreground">
                                            {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div className="text-[10px] lg:text-xs text-muted-foreground">
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

