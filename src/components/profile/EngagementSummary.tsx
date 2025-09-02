import React from 'react';
import {
  Phone,
  PhoneCall,
  PhoneMissed,
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  Target,
  Activity
} from 'lucide-react';
import { UserProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDuration, formatCurrency, formatDate } from '@/utils';

interface EngagementSummaryProps {
  profile: UserProfile;
}

const EngagementSummary: React.FC<EngagementSummaryProps> = ({ profile }) => {
  const { engagementSummary } = profile;

  const getEngagementLevel = () => {
    const score = (
      (engagementSummary.callsConnected * 10) +
      (engagementSummary.totalBookings * 25) +
      (engagementSummary.totalRevenue / 1000)
    );

    if (score >= 100) return { level: 'High', color: 'text-green-600 bg-green-100', percentage: Math.min(100, score / 2) };
    if (score >= 50) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100', percentage: score * 2 };
    return { level: 'Low', color: 'text-red-600 bg-red-100', percentage: score * 4 };
  };

  const engagement = getEngagementLevel();

  const stats = [
    {
      title: 'Total Calls',
      value: engagementSummary.totalCalls,
      icon: Phone,
      color: 'text-blue-600 bg-blue-100',
      description: `${engagementSummary.callsConnected} connected, ${engagementSummary.callsMissed} missed`,
    },
    {
      title: 'Call Duration',
      value: formatDuration(engagementSummary.totalCallDuration),
      icon: Clock,
      color: 'text-purple-600 bg-purple-100',
      description: `Avg: ${engagementSummary.totalCalls > 0 ? formatDuration(Math.floor(engagementSummary.totalCallDuration / engagementSummary.totalCalls)) : '0m'}`,
    },
    {
      title: 'Total Bookings',
      value: engagementSummary.totalBookings,
      icon: Calendar,
      color: 'text-emerald-600 bg-emerald-100',
      description: `${engagementSummary.conversionRate.toFixed(1)}% conversion rate`,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(engagementSummary.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
      description: `Avg: ${formatCurrency(engagementSummary.averageBookingValue)}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Engagement Level Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-700" />
            Engagement Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {engagement.level} Engagement
              </div>
              <div className="text-sm text-gray-600">
                Based on calls, bookings, and revenue
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${engagement.color}`}>
              {engagement.percentage.toFixed(0)}% Score
            </div>
          </div>

          {/* Engagement Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, engagement.percentage)}%` }}
            ></div>
          </div>

          {/* Last Call Info */}
          {engagementSummary.lastCallDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <PhoneCall className="h-4 w-4" />
              <span>Last call: {formatDate(engagementSummary.lastCallDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.description}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-700" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Call Success Rate */}
            <div className="text-center">
              <div className="mb-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                  {engagementSummary.totalCalls > 0 
                    ? Math.round((engagementSummary.callsConnected / engagementSummary.totalCalls) * 100)
                    : 0}%
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">Call Success Rate</div>
              <div className="text-xs text-gray-500">
                {engagementSummary.callsConnected} of {engagementSummary.totalCalls} calls connected
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="text-center">
              <div className="mb-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {engagementSummary.conversionRate.toFixed(0)}%
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">Conversion Rate</div>
              <div className="text-xs text-gray-500">
                {engagementSummary.totalBookings} bookings generated
              </div>
            </div>

            {/* Average Order Value */}
            <div className="text-center">
              <div className="mb-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  ₹{Math.round(engagementSummary.averageBookingValue / 1000)}K
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">Avg Booking Value</div>
              <div className="text-xs text-gray-500">
                {formatCurrency(engagementSummary.averageBookingValue)} per booking
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementSummary;

