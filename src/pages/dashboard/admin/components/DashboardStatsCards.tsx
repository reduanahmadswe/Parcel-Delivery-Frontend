import { 
  Activity, 
  ArrowDownRight, 
  ArrowUpRight, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle 
} from "lucide-react";
import { DashboardStats } from "../types";
import { formatNumber } from "../utils";

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  stats,
}) => {
  const statCards = [
    {
      title: "Total Users",
      value: stats.users.total || 0,
      icon: Users,
      color: "blue",
      change: `+${stats.users.newThisMonth || 0} this month`,
      trend: "up" as const,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Total Parcels", 
      value: stats.parcels.total || 0,
      icon: Package,
      color: "green",
      change: `${stats.parcels.delivered || 0} delivered`,
      trend: "up" as const,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Active Parcels",
      value: (stats.parcels.pending || 0) + (stats.parcels.inTransit || 0),
      icon: TrendingUp,
      color: "yellow",
      change: `${stats.parcels.urgent || 0} urgent`,
      trend: "neutral" as const,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: "Issues & Alerts",
      value: stats.parcels.flagged || 0,
      icon: AlertTriangle,
      color: "red",
      change: "Needs attention",
      trend: "down" as const,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600",
      borderColor: "border-red-200 dark:border-red-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon =
          card.trend === "up"
            ? ArrowUpRight
            : card.trend === "down"
            ? ArrowDownRight
            : Activity;

        return (
          <div
            key={`stat-card-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
            className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor} shadow-sm`}>
                <Icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div className="flex items-center">
                <TrendIcon className={`h-4 w-4 ${card.textColor}`} />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {card.title}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className={`text-3xl font-bold text-gray-900 dark:text-white`}>
                  {formatNumber(card.value)}
                </p>
                {card.trend === "up" && (
                  <span className="text-xs text-green-500 font-medium">↑</span>
                )}
                {card.trend === "down" && (
                  <span className="text-xs text-red-500 font-medium">↓</span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {card.change}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div
                className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 h-1 rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      10,
                      (card.value / Math.max(...statCards.map((c) => c.value))) * 100
                    )
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};