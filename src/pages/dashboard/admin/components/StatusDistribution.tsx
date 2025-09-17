import { PieChart } from "lucide-react";
import { DashboardStats } from "../types";

interface StatusDistributionProps {
  stats: DashboardStats;
}

export const StatusDistribution: React.FC<StatusDistributionProps> = ({
  stats,
}) => {
  const total = stats.parcels.total || 1;
  const pending = stats.parcels.pending || 0;
  const inTransit = stats.parcels.inTransit || 0;
  const delivered = stats.parcels.delivered || 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Status Distribution
        </h3>
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
          <PieChart className="h-5 w-5 text-purple-600" />
        </div>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        {/* 3D Pie Chart */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              {/* Gradients for 3D effect */}
              <radialGradient id="redGradient" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#FF6B8A" />
                <stop offset="100%" stopColor="#FF4757" />
              </radialGradient>
              <radialGradient id="blueGradient" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#74B9FF" />
                <stop offset="100%" stopColor="#3B82F6" />
              </radialGradient>
              <radialGradient id="yellowGradient" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#FDCB6E" />
                <stop offset="100%" stopColor="#F39C12" />
              </radialGradient>
            </defs>

            {(() => {
              const pendingPct = pending / total || 0.33;
              const inTransitPct = inTransit / total || 0.33;
              const deliveredPct = delivered / total || 0.34;

              const radius = 70;
              const centerX = 100;
              const centerY = 100;

              // Calculate angles
              const pendingAngle = pendingPct * 2 * Math.PI;
              const inTransitAngle = inTransitPct * 2 * Math.PI;
              const deliveredAngle = deliveredPct * 2 * Math.PI;

              let startAngle = 0;
              const segments = [
                {
                  angle: pendingAngle,
                  color: "url(#yellowGradient)",
                  label: "Pending",
                  percentage: Math.round(pendingPct * 100),
                },
                {
                  angle: inTransitAngle,
                  color: "url(#blueGradient)",
                  label: "In Transit",
                  percentage: Math.round(inTransitPct * 100),
                },
                {
                  angle: deliveredAngle,
                  color: "url(#redGradient)",
                  label: "Delivered",
                  percentage: Math.round(deliveredPct * 100),
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
                    {/* Shadow/3D effect */}
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
            <div className="text-3xl font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              {total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded backdrop-blur-sm">
              Total
            </div>
          </div>
        </div>
      </div>

      {/* Legend with 3D Style */}
      <div className="space-y-3">
        {[
          {
            label: "Pending",
            value: pending,
            color: "bg-gradient-to-br from-yellow-300 to-yellow-500",
            bgColor:
              "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
            borderColor: "border-yellow-200 dark:border-yellow-700",
            percentage: Math.round((pending / total) * 100),
          },
          {
            label: "In Transit",
            value: inTransit,
            color: "bg-gradient-to-br from-blue-300 to-blue-500",
            bgColor:
              "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
            borderColor: "border-blue-200 dark:border-blue-700",
            percentage: Math.round((inTransit / total) * 100),
          },
          {
            label: "Delivered",
            value: delivered,
            color: "bg-gradient-to-br from-red-300 to-red-500",
            bgColor:
              "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
            borderColor: "border-red-200 dark:border-red-700",
            percentage: Math.round((delivered / total) * 100),
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between p-3 ${item.bgColor} rounded-lg border ${item.borderColor} shadow-sm transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${item.color} shadow-md border border-white/20`}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
