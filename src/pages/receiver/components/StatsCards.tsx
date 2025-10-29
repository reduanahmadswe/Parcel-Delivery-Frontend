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
      bgColor: "from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800/50",
      hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
      iconBg: "bg-blue-50 dark:bg-blue-950/20",
      iconHoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
      subtitle: stats.total > 0 ? `Updated with ${stats.total} parcels` : "No parcels yet",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      bgColor: "from-yellow-50/50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800/50",
      hoverBorder: "hover:border-yellow-300 dark:hover:border-yellow-700",
      iconBg: "bg-yellow-50 dark:bg-yellow-950/20",
      iconHoverBg: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-600",
      subtitle: stats.pending > 0 ? `${stats.pending} awaiting` : "All processed",
    },
    {
      label: "In Transit",
      value: stats.inTransit,
      icon: Truck,
      bgColor: "from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800/50",
      hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700",
      iconBg: "bg-purple-50 dark:bg-purple-950/20",
      iconHoverBg: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      iconColor: "text-purple-600",
      textColor: "text-purple-600",
      subtitle: stats.inTransit > 0 ? `${stats.inTransit} on the way` : "None in transit",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle2,
      bgColor: "from-green-50/50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20",
      borderColor: "border-green-200 dark:border-green-800/50",
      hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
      iconBg: "bg-green-50 dark:bg-green-950/20",
      iconHoverBg: "hover:bg-green-100 dark:hover:bg-green-900/30",
      iconColor: "text-green-600",
      textColor: "text-green-600",
      subtitle: stats.delivered > 0 ? `${stats.successRate}% success rate` : "No deliveries yet",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: AlertCircle,
      bgColor: "from-red-50/50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20",
      borderColor: "border-red-200 dark:border-red-800/50",
      hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
      iconBg: "bg-red-50 dark:bg-red-950/20",
      iconHoverBg: "hover:bg-red-100 dark:hover:bg-red-900/30",
      iconColor: "text-red-600",
      textColor: "text-red-600",
      subtitle: "Failed deliveries",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mt-3 xs:mt-4 sm:mt-6 lg:mt-8">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 hover:shadow-lg hover:scale-[1.03] ${stat.hoverBorder} transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
              <div className={`p-1.5 xs:p-2 sm:p-2.5 ${stat.iconBg} rounded-lg sm:rounded-xl transition-colors duration-300 ${stat.iconHoverBg} flex-shrink-0`}>
                <IconComponent className={`h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 truncate">
                  {stat.label}
                </p>
                <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className={`text-[9px] xs:text-[10px] sm:text-xs ${stat.textColor} font-medium mt-0.5 truncate`}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

