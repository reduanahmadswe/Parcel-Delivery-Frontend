import { useEffect, useRef } from 'react';
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
        color: 'var(--foreground)',
      },
    },
    subtitle: {
      text: `Total: ${stats.total} Parcels | Urgent: ${stats.urgent}`,
      style: {
        fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '12px' : '14px',
        color: 'var(--muted-foreground)',
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
        borderColor: '#ffffff',
        size: typeof window !== 'undefined' && window.innerWidth < 640 ? '85%' : '75%',
        dataLabels: [
          {
            enabled: typeof window !== 'undefined' ? window.innerWidth >= 640 : true,
            distance: typeof window !== 'undefined' && window.innerWidth < 640 ? 15 : 25,
            format: '{point.name}',
            style: {
              fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '10px' : '13px',
              fontWeight: 'bold',
              color: 'var(--foreground)',
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
        color: 'var(--foreground)',
        fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '11px' : '13px',
        fontWeight: '500',
      },
      itemHoverStyle: {
        color: 'var(--primary)',
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
            color: '#9333EA', // Purple
          },
          {
            name: 'Approved',
            y: stats.approved,
            sliced: false,
            selected: false,
            color: '#06B6D4', // Cyan
          },
          {
            name: 'Dispatched',
            y: stats.dispatched,
            sliced: false,
            selected: false,
            color: '#8B5CF6', // Violet
          },
          {
            name: 'Pending',
            y: stats.pending,
            sliced: false,
            selected: false,
            color: '#FFA500', // Orange
          },
          {
            name: 'In Transit',
            y: stats.inTransit,
            sliced: false,
            selected: false,
            color: '#3B82F6', // Blue
          },
          {
            name: 'Delivered',
            y: stats.delivered,
            sliced: true,
            selected: true,
            color: '#10B981', // Green
          },
          {
            name: 'Cancelled',
            y: stats.cancelled,
            sliced: false,
            selected: false,
            color: '#EF4444', // Red
          },
          {
            name: 'Returned',
            y: stats.returned,
            sliced: false,
            selected: false,
            color: '#F59E0B', // Amber
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
  }, [parcels]);

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
      <div className="relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
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
    <div className="relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
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
