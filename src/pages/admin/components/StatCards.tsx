"use client";

import { ArrowDownRight, ArrowUpRight, Activity, BarChart3, CheckCircle, Clock, TrendingUp } from "lucide-react";
import React from "react";

interface StatCard {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  change: string;
  trend: "up" | "down" | "neutral";
  gradient: string;
  iconBg: string;
  iconColor: string;
}

interface Props {
  statCards: StatCard[];
}

export default function StatCards({ statCards }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
            className={`bg-background p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer ${card.gradient} hover:border-${card.color}-200`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${card.iconColor}`} />
              </div>
              <div className={`p-1 rounded-full bg-${card.color}-50 dark:bg-${card.color}-950/20`}>
                <TrendIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${card.iconColor}`} />
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2 truncate">{card.title}</p>
              <div className="flex items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold text-foreground group-hover:text-${card.color}-600 transition-colors duration-300`}>
                  {typeof card.value === "number" && !isNaN(Number(card.value)) ? Number(card.value).toLocaleString() : card.value}
                </p>
                {card.trend === "up" && <span className="text-xs sm:text-sm text-green-500 font-medium">↑</span>}
                {card.trend === "down" && <span className="text-xs sm:text-sm text-red-500 font-medium">↓</span>}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{card.change}</p>
            </div>

            {}
            <div className="mt-3 sm:mt-4 w-full bg-muted rounded-full h-1 sm:h-1.5">
              <div className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 h-1 sm:h-1.5 rounded-full`} style={{ width: "70%" }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

