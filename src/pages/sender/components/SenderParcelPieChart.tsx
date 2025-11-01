import { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Import Highcharts modules (they auto-register when imported)
import 'highcharts/modules/exporting';
import 'highcharts/modules/accessibility';

interface SenderParcelPieChartProps {
  parcels: Array<{
    currentStatus: string;
    deliveryInfo?: {
      isUrgent?: boolean;
    };
  }>;
}

export default function SenderParcelPieChart({ parcels }: SenderParcelPieChartProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  // Calculate stats from parcels array
  const stats = {
    total: parcels.length,
    requested: parcels.filter((p) => p.currentStatus === 'requested').length,
    approved: parcels.filter((p) => p.currentStatus === 'approved').length,
    dispatched: parcels.filter((p) => p.currentStatus === 'dispatched').length,
    pending: parcels.filter((p) => p.currentStatus === 'pending').length,
    inTransit: parcels.filter((p) => 
      p.currentStatus === 'in-transit' || p.currentStatus === 'in_transit'
    ).length,
    delivered: parcels.filter((p) => p.currentStatus === 'delivered').length,
    cancelled: parcels.filter((p) => p.currentStatus === 'cancelled').length,
    returned: parcels.filter((p) => p.currentStatus === 'returned').length,
    urgent: parcels.filter((p) => p.deliveryInfo?.isUrgent).length,
  };

  // Check if dark mode
  const isDark = theme === 'dark';

  // Theme-aware colors
  const colors = {
    requested: isDark ? '#A855F7' : '#9333EA',
    approved: isDark ? '#22D3EE' : '#06B6D4',
    dispatched: isDark ? '#A78BFA' : '#8B5CF6',
    pending: isDark ? '#FBBF24' : '#F59E0B',
    inTransit: isDark ? '#60A5FA' : '#3B82F6',
    delivered: isDark ? '#34D399' : '#10B981',
    cancelled: isDark ? '#F87171' : '#EF4444',
    returned: isDark ? '#FBBF24' : '#F59E0B',
  };

  const textColor = isDark ? '#E5E7EB' : '#1F2937';
  const subtitleColor = isDark ? '#9CA3AF' : '#6B7280';
  const borderColor = isDark ? '#374151' : '#ffffff';

  // Responsive chart height based on screen size
  const getChartHeight = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 300; // mobile
      if (window.innerWidth < 768) return 350; // sm
      if (window.innerWidth < 1024) return 400; // md
      return 450; // lg and above
    }
    return 400;
  };

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: getChartHeight(),
      spacing: [10, 10, 10, 10],
    },
    title: {
      text: 'My Parcel Status Distribution',
      style: {
        fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '16px' : '20px',
        fontWeight: 'bold',
        color: textColor,
      },
    },
    subtitle: {
      text: `Total: ${stats.total} Parcels | Urgent: ${stats.urgent}`,
      style: {
        fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '12px' : '14px',
        color: subtitleColor,
      },
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> parcels ({point.percentage:.1f}%)',
      style: {
        fontSize: '13px',
      },
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderWidth: 2,
        borderColor: borderColor,
        size: typeof window !== 'undefined' && window.innerWidth < 640 ? '85%' : '75%',
        dataLabels: [
          {
            enabled: typeof window !== 'undefined' ? window.innerWidth >= 640 : true,
            distance: typeof window !== 'undefined' && window.innerWidth < 640 ? 15 : 25,
            format: '{point.name}',
            style: {
              fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '10px' : '13px',
              fontWeight: 'bold',
              color: textColor,
              textOutline: 'none',
            },
          },
          {
            enabled: true,
            distance: typeof window !== 'undefined' && window.innerWidth < 640 ? -30 : -40,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '12px' : '16px',
              fontWeight: 'bold',
              textOutline: 'none',
              color: '#ffffff',
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 5,
            },
          },
        ],
        showInLegend: true,
      },
    },
    legend: {
      align: typeof window !== 'undefined' && window.innerWidth < 768 ? 'center' : 'right',
      verticalAlign: typeof window !== 'undefined' && window.innerWidth < 768 ? 'bottom' : 'middle',
      layout: typeof window !== 'undefined' && window.innerWidth < 768 ? 'horizontal' : 'vertical',
      itemStyle: {
        color: textColor,
        fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '11px' : '13px',
        fontWeight: '500',
      },
      itemHoverStyle: {
        color: isDark ? '#60A5FA' : '#3B82F6',
      },
      itemMarginBottom: 5,
      maxHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : undefined,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: 'pie',
        name: 'Parcels',
        data: [
          {
            name: 'Requested',
            y: stats.requested,
            sliced: false,
            selected: false,
            color: colors.requested,
          },
          {
            name: 'Approved',
            y: stats.approved,
            sliced: false,
            selected: false,
            color: colors.approved,
          },
          {
            name: 'Dispatched',
            y: stats.dispatched,
            sliced: false,
            selected: false,
            color: colors.dispatched,
          },
          {
            name: 'Pending',
            y: stats.pending,
            sliced: false,
            selected: false,
            color: colors.pending,
          },
          {
            name: 'In Transit',
            y: stats.inTransit,
            sliced: false,
            selected: false,
            color: colors.inTransit,
          },
          {
            name: 'Delivered',
            y: stats.delivered,
            sliced: true,
            selected: true,
            color: colors.delivered,
          },
          {
            name: 'Cancelled',
            y: stats.cancelled,
            sliced: false,
            selected: false,
            color: colors.cancelled,
          },
          {
            name: 'Returned',
            y: stats.returned,
            sliced: false,
            selected: false,
            color: colors.returned,
          },
        ].filter((item) => item.y > 0), // Only show non-zero values
      } as any,
    ],
  };

  // Update chart when parcels change
  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update(options, true, true);
    }
  }, [parcels, theme]);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setTheme(isDarkMode ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Handle window resize for responsive chart
  useEffect(() => {
    const handleResize = () => {
      if (chartComponentRef.current) {
        chartComponentRef.current.chart.update(options, true, true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show empty state if no parcels
  if (parcels.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg">
        <div className="relative text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center opacity-20">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No Parcels Yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
            You haven't created any parcels yet. Create your first parcel to see statistics!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />
        
        {/* Urgent Parcels Badge */}
        {stats.urgent > 0 && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-6 lg:right-6 flex items-center space-x-1.5 sm:space-x-2 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg shadow-md">
            <svg
              className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-orange-700 dark:text-orange-300">
                {stats.urgent} Urgent
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
