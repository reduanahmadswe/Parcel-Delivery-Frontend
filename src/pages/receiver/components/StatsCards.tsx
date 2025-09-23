import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react";
import React from "react";
import { ParcelStats } from "../types";

interface StatsCardsProps {
  stats: ParcelStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statsConfig = [
    {
      label: "Total Parcels",
      value: stats.total,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
      subtitle: `${stats.total > 0 ? "Updated" : "No parcels yet"}`,
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-600 dark:text-yellow-400",
      subtitle:
        stats.pending > 0 ? `${stats.pending} awaiting` : "All processed",
    },
    {
      label: "In Transit",
      value: stats.inTransit,
      icon: Truck,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600 dark:text-orange-400",
      subtitle:
        stats.inTransit > 0
          ? `${stats.inTransit} on the way`
          : "None in transit",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600 dark:text-green-400",
      subtitle:
        stats.delivered > 0
          ? `${stats.successRate}% success rate`
          : "No deliveries yet",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600 dark:text-red-400",
      subtitle: "Failed",
    },
  ];

  return (
    <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className={`text-xs ${stat.textColor} mt-1`}>
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {stat.subtitle}
                </p>
              </div>
              <div
                className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-200`}
              >
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

