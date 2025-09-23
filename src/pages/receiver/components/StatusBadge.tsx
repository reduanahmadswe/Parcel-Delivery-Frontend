import { ParcelStatus } from "@/types/GlobalTypeDefinitions";
import { CheckCircle2, Clock, MapPin, Package, Truck, X } from "lucide-react";
import React from "react";

interface StatusBadgeProps {
  status: ParcelStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    requested: {
      color:
        "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-300",
      text: "Requested",
      icon: Clock,
    },
    approved: {
      color:
        "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-300",
      text: "Approved",
      icon: CheckCircle2,
    },
    dispatched: {
      color:
        "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-300",
      text: "Dispatched",
      icon: Package,
    },
    "in-transit": {
      color:
        "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300",
      text: "In Transit",
      icon: Truck,
    },
    delivered: {
      color:
        "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300",
      text: "Delivered",
      icon: CheckCircle2,
    },
    cancelled: {
      color:
        "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-300",
      text: "Cancelled",
      icon: X,
    },
    returned: {
      color:
        "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-300",
      text: "Returned",
      icon: MapPin,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.requested;
  const StatusIcon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border ${config.color}`}
    >
      <StatusIcon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

export default StatusBadge;

