import {
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { DashboardStats, MonthlyData } from "../types";

interface DashboardChartsProps {
  stats: DashboardStats;
  monthlyData: MonthlyData[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  stats,
  monthlyData,
}) => {
  return (
    <>
      {/* Combined Parcel Status Overview with Real-time Charts */}
      <ComprehensiveParcelChart stats={stats} monthlyData={monthlyData} />
    </>
  );
};

// Comprehensive Parcel Chart Component
const ComprehensiveParcelChart: React.FC<{
  stats: DashboardStats;
  monthlyData: MonthlyData[];
}> = ({ stats, monthlyData }) => {
  const total = stats.parcels.total || 1;
  const pending = stats.parcels.pending || 0;
  const inTransit = stats.parcels.inTransit || 0;
  const delivered = stats.parcels.delivered || 0;

  const statusItems = [
    {
      label: "Pending",
      value: pending,
      color: "yellow",
      icon: Clock,
      bgGradient: "from-yellow-500/10 to-yellow-600/10",
      chartColor: "#F39C12",
    },
    {
      label: "In Transit",
      value: inTransit,
      color: "blue",
      icon: TrendingUp,
      bgGradient: "from-blue-500/10 to-blue-600/10",
      chartColor: "#3B82F6",
    },
    {
      label: "Delivered",
      value: delivered,
      color: "green",
      icon: CheckCircle,
      bgGradient: "from-green-500/10 to-green-600/10",
      chartColor: "#10B981",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Parcel Status Overview - Real-time Analytics
        </h3>
        <div className="flex gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10">
            <Activity className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Three-column layout: Bar Chart, Pie Chart, Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart with Status Bars */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Status Distribution (Bar)
          </h4>
          {statusItems.map((item) => {
            const percentage = Math.round((item.value / total) * 100);
            const ItemIcon = item.icon;

            return (
              <div
                key={`bar-${item.label}`}
                className={`p-4 rounded-lg bg-gradient-to-r ${item.bgGradient} border border-${item.color}-200 dark:border-${item.color}-800 hover:scale-102 transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                      <ItemIcon className={`h-4 w-4 text-${item.color}-600`} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.value.toLocaleString()}
                    </div>
                    <div
                      className={`text-sm text-${item.color}-600 font-medium`}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center: 3D Pie Chart */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Status Distribution (Pie)
          </h4>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="yellowGradient" cx="0.3" cy="0.3">
                  <stop offset="0%" stopColor="#FDCB6E" />
                  <stop offset="100%" stopColor="#F39C12" />
                </radialGradient>
                <radialGradient id="blueGradient" cx="0.3" cy="0.3">
                  <stop offset="0%" stopColor="#74B9FF" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </radialGradient>
                <radialGradient id="greenGradient" cx="0.3" cy="0.3">
                  <stop offset="0%" stopColor="#55E6C1" />
                  <stop offset="100%" stopColor="#10B981" />
                </radialGradient>
              </defs>

              {(() => {
                const pendingPct = pending / total || 0.33;
                const inTransitPct = inTransit / total || 0.33;
                const deliveredPct = delivered / total || 0.34;

                const radius = 70;
                const centerX = 100;
                const centerY = 100;

                let startAngle = 0;
                const segments = [
                  {
                    angle: pendingPct * 2 * Math.PI,
                    color: "url(#yellowGradient)",
                    label: "Pending",
                  },
                  {
                    angle: inTransitPct * 2 * Math.PI,
                    color: "url(#blueGradient)",
                    label: "In Transit",
                  },
                  {
                    angle: deliveredPct * 2 * Math.PI,
                    color: "url(#greenGradient)",
                    label: "Delivered",
                  },
                ];

                return segments.map((segment, index) => {
                  if (segment.angle === 0) return null;

                  const endAngle = startAngle + segment.angle;

                  const x1 = centerX + radius * Math.cos(startAngle);
                  const y1 = centerY + radius * Math.sin(startAngle);
                  const x2 = centerX + radius * Math.cos(endAngle);
                  const y2 = centerY + radius * Math.sin(endAngle);

                  const largeArcFlag = segment.angle > Math.PI ? 1 : 0;

                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  const result = (
                    <g key={index}>
                      <path
                        d={pathData}
                        fill={segment.color}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:scale-105 drop-shadow-lg"
                        style={{
                          filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.1))",
                          transform: "translate(0, -1px)",
                        }}
                      />
                    </g>
                  );

                  startAngle = endAngle;
                  return result;
                });
              })()}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                {total}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total
              </div>
            </div>
          </div>

          {/* Pie Chart Legend */}
          <div className="mt-4 space-y-2 w-full">
            {statusItems.map((item, index) => (
              <div
                key={`pie-legend-${item.label}`}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.chartColor }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Monthly Shipment Trends */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Monthly Shipments
          </h4>
          <div className="space-y-3">
            {monthlyData.slice(-6).map((month, index) => {
              const maxValue = Math.max(...monthlyData.map((m) => m.shipments));
              const percentage = (month.shipments / maxValue) * 100;

              return (
                <div key={`monthly-${month.month}`} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {month.month}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {month.shipments.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Delivery Rate: {month.deliveryRate}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Status Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Parcels
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((delivered / total) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Delivery Rate
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pending
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {inTransit}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              In Transit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
