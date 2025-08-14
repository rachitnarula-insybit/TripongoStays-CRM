import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/utils';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const statsData = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      growth: stats.bookingsGrowth,
      format: formatNumber,
      color: 'text-secondary-blue',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      growth: stats.propertiesGrowth,
      format: formatNumber,
      color: 'text-secondary-green',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      growth: stats.leadsGrowth,
      format: formatNumber,
      color: 'text-primary-orange',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Revenue',
      value: stats.revenue,
      growth: stats.revenueGrowth,
      format: formatCurrency,
      color: 'text-secondary-green',
      bgColor: 'bg-green-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-gray">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                  {stat.format(stat.value)}
                </p>
                <div className="flex items-center mt-2">
                  {stat.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-secondary-green mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-secondary-red mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.growth > 0 ? 'text-secondary-green' : 'text-secondary-red'
                    }`}
                  >
                    {stat.growth > 0 ? '+' : ''}{stat.growth}%
                  </span>
                  <span className="text-sm text-neutral-gray ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <div className={`h-6 w-6 rounded ${stat.color.replace('text-', 'bg-')}`}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;