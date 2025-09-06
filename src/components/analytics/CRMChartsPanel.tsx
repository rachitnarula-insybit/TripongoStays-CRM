'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Filter,
  Download,
  Maximize2,
  RefreshCw,
  Eye,
  Users,
  DollarSign,
  Phone,
  Target,
  MapPin,
  Clock,
  Star,
  Building,
  Zap,
  Award,
} from 'lucide-react';
import { cn } from '@/utils';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import Button from '@/components/ui/Button';
import FuturisticCard from '@/components/ui/FuturisticCard';
import { dashboardApi, leadsApi, callHistoryApi, bookingsApi } from '@/services/api';
import { Lead, CallRecord, Booking, DashboardStats } from '@/types';

interface ChartData {
  period: string;
  revenue: number;
  leads: number;
  conversions: number;
  bookings: number;
  calls: number;
  satisfaction: number;
}

interface CityPerformance {
  city: string;
  bookings: number;
  revenue: number;
  leads: number;
  occupancy: number;
}

interface LeadSourceData {
  source: string;
  count: number;
  conversion: number;
  revenue: number;
  color: string;
}

interface CallAnalytics {
  hour: number;
  count: number;
  successRate: number;
  avgDuration: number;
}

const CRMChartsPanel: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [cityData, setCityData] = useState<CityPerformance[]>([]);
  const [leadSourceData, setLeadSourceData] = useState<LeadSourceData[]>([]);
  const [callAnalytics, setCallAnalytics] = useState<CallAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('revenue');
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const chartTypes = [
    { id: 'revenue', name: 'Revenue Trends', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { id: 'leads', name: 'Lead Pipeline', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { id: 'calls', name: 'Call Analytics', icon: Phone, color: 'from-purple-500 to-pink-500' },
    { id: 'geography', name: 'Geographic Performance', icon: MapPin, color: 'from-orange-500 to-red-500' },
  ];

  // Fetch and process CRM data for charts
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const [dashStats, leadsData, callsData, bookingsData] = await Promise.all([
          dashboardApi.getStats(),
          leadsApi.getLeads(1, 1000),
          callHistoryApi.getCallHistory(1, 1000),
          bookingsApi.getBookings(1, 1000)
        ]);

        const leads = leadsData.data || [];
        const calls = callsData.data || [];
        const bookings = bookingsData.data || [];

        // Generate time series data
        const timeSeriesData = generateTimeSeriesData(leads, calls, bookings);
        setChartData(timeSeriesData);

        // Generate city performance data
        const cityPerformanceData = generateCityData(bookings, leads);
        setCityData(cityPerformanceData);

        // Generate lead source analysis
        const sourceData = generateLeadSourceData(leads, bookings);
        setLeadSourceData(sourceData);

        // Generate call analytics by hour
        const callHourlyData = generateCallAnalytics(calls);
        setCallAnalytics(callHourlyData);

      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timeRange]);

  const generateTimeSeriesData = (leads: Lead[], calls: CallRecord[], bookings: Booking[]): ChartData[] => {
    // Generate last 6 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentDate = new Date();
    
    return months.map((month, index) => {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index) + 1, 0);
      
      // Filter data for this month
      const monthLeads = leads.filter(l => {
        const leadDate = new Date(l.createdDate);
        return leadDate >= monthStart && leadDate <= monthEnd;
      });
      
      const monthCalls = calls.filter(c => {
        const callDate = new Date(c.date);
        return callDate >= monthStart && callDate <= monthEnd;
      });
      
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdDate);
        return bookingDate >= monthStart && bookingDate <= monthEnd;
      });

      const revenue = monthBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      const conversions = monthLeads.filter(l => l.status === 'Converted').length;
      const conversionRate = monthLeads.length > 0 ? (conversions / monthLeads.length) * 100 : 0;

      return {
        period: month,
        revenue: revenue,
        leads: monthLeads.length,
        conversions: conversionRate,
        bookings: monthBookings.length,
        calls: monthCalls.length,
        satisfaction: 4.2 + (Math.random() * 0.8), // Simulate satisfaction data
      };
    });
  };

  const generateCityData = (bookings: Booking[], leads: Lead[]): CityPerformance[] => {
    const cityMap = new Map<string, { bookings: number; revenue: number; leads: number }>();
    
    // Process bookings by city (extracted from property name)
    bookings.forEach(booking => {
      const city = extractCityFromProperty(booking.propertyName);
      if (!cityMap.has(city)) {
        cityMap.set(city, { bookings: 0, revenue: 0, leads: 0 });
      }
      const cityData = cityMap.get(city)!;
      cityData.bookings += 1;
      cityData.revenue += booking.totalAmount;
    });

    // Add leads data (simplified - in reality would need location data)
    const cities = ['Mumbai', 'Delhi', 'Goa', 'Bangalore', 'Chennai', 'Kolkata'];
    cities.forEach(city => {
      if (!cityMap.has(city)) {
        cityMap.set(city, { bookings: 0, revenue: 0, leads: 0 });
      }
      const cityData = cityMap.get(city)!;
      cityData.leads = Math.floor(leads.length * (0.1 + Math.random() * 0.2)); // Simulate lead distribution
    });

    return Array.from(cityMap.entries()).map(([city, data]) => ({
      city,
      bookings: data.bookings,
      revenue: data.revenue,
      leads: data.leads,
      occupancy: 75 + Math.random() * 20, // Simulate occupancy data
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  };

  const generateLeadSourceData = (leads: Lead[], bookings: Booking[]): LeadSourceData[] => {
    const sourceMap = new Map<string, { count: number; conversions: number; revenue: number }>();
    
    leads.forEach(lead => {
      if (!sourceMap.has(lead.source)) {
        sourceMap.set(lead.source, { count: 0, conversions: 0, revenue: 0 });
      }
      const sourceData = sourceMap.get(lead.source)!;
      sourceData.count += 1;
      
      if (lead.status === 'Converted') {
        sourceData.conversions += 1;
        // Find associated booking revenue (simplified)
        const associatedBooking = bookings.find(b => b.guestEmail === lead.email);
        if (associatedBooking) {
          sourceData.revenue += associatedBooking.totalAmount;
        }
      }
    });

    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
    ];

    return Array.from(sourceMap.entries()).map(([source, data], index) => ({
      source,
      count: data.count,
      conversion: data.count > 0 ? (data.conversions / data.count) * 100 : 0,
      revenue: data.revenue,
      color: colors[index % colors.length],
    }));
  };

  const generateCallAnalytics = (calls: CallRecord[]): CallAnalytics[] => {
    // Process real call data to generate hourly analytics
    const hourlyMap = new Map<number, { count: number; successful: number; totalDuration: number }>();
    
    // Initialize all hours
    for (let hour = 0; hour < 24; hour++) {
      hourlyMap.set(hour, { count: 0, successful: 0, totalDuration: 0 });
    }
    
    calls.forEach(call => {
      const hour = new Date(call.date).getHours();
      const hourData = hourlyMap.get(hour)!;
      hourData.count += 1;
      hourData.totalDuration += call.duration;
      
      if (call.status === 'Connected') {
        hourData.successful += 1;
      }
    });

    return Array.from(hourlyMap.entries()).map(([hour, data]) => ({
      hour,
      count: data.count,
      successRate: data.count > 0 ? (data.successful / data.count) * 100 : 0,
      avgDuration: data.successful > 0 ? data.totalDuration / data.successful : 0,
    }));
  };

  const extractCityFromProperty = (propertyName: string): string => {
    const cityKeywords = ['Mumbai', 'Delhi', 'Goa', 'Bangalore', 'Chennai', 'Kolkata', 'Udaipur', 'Jaipur'];
    for (const city of cityKeywords) {
      if (propertyName.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    return 'Other';
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return `₹${(value / 100000).toFixed(1)}L`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'time':
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      default:
        return value.toFixed(0);
    }
  };

  const handleRefresh = () => {
    hapticFeedback.medium();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'revenue':
        return renderRevenueChart();
      case 'leads':
        return renderLeadChart();
      case 'calls':
        return renderCallChart();
      case 'geography':
        return renderGeographyChart();
      default:
        return renderRevenueChart();
    }
  };

  const renderRevenueChart = () => {
    const maxRevenue = Math.max(...chartData.map(d => d.revenue));
    
    return (
      <div className="space-y-4">
        <div className="h-64 relative bg-gradient-to-t from-neutral-50 to-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="absolute inset-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-500">
              <span>{formatValue(maxRevenue, 'currency')}</span>
              <span>{formatValue(maxRevenue * 0.75, 'currency')}</span>
              <span>{formatValue(maxRevenue * 0.5, 'currency')}</span>
              <span>{formatValue(maxRevenue * 0.25, 'currency')}</span>
              <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="ml-16 mr-4 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[0, 25, 50, 75, 100].map((percent) => (
                  <div
                    key={percent}
                    className="absolute w-full border-t border-neutral-200/50"
                    style={{ bottom: `${percent}%` }}
                  />
                ))}
              </div>

              {/* Revenue bars */}
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {chartData.map((data, index) => {
                  const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <motion.div
                      key={data.period}
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        className="w-12 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t cursor-pointer"
                        style={{ height: `${height}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        whileHover={{ scale: 1.05, opacity: 0.8 }}
                        title={`${data.period}: ${formatValue(data.revenue, 'currency')}`}
                      />
                      <span className="text-xs text-neutral-600 font-medium">
                        {data.period}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue insights */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="text-lg font-bold text-green-600">
              {formatValue(chartData.reduce((sum, d) => sum + d.revenue, 0), 'currency')}
            </div>
            <div className="text-xs text-green-700">Total Revenue</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-lg font-bold text-blue-600">
              {chartData.length > 0 ? formatValue(chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length, 'currency') : '0'}
            </div>
            <div className="text-xs text-blue-700">Avg Monthly</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-lg font-bold text-purple-600">
              {chartData.length > 1 ? 
                formatValue(((chartData[chartData.length - 1].revenue - chartData[chartData.length - 2].revenue) / chartData[chartData.length - 2].revenue) * 100, 'percentage') 
                : '0%'}
            </div>
            <div className="text-xs text-purple-700">MoM Growth</div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeadChart = () => {
    const totalLeads = leadSourceData.reduce((sum, d) => sum + d.count, 0);
    
    return (
      <div className="space-y-4">
        {/* Lead source distribution */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pie chart simulation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700">Lead Sources</h4>
            <div className="space-y-2">
              {leadSourceData.map((source, index) => {
                const percentage = totalLeads > 0 ? (source.count / totalLeads) * 100 : 0;
                
                return (
                  <motion.div
                    key={source.source}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">
                          {source.source}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {source.count}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: source.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                        />
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {percentage.toFixed(1)}% • {formatValue(source.conversion, 'percentage')} conversion
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Lead funnel */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700">Conversion Funnel</h4>
            <div className="space-y-2">
              {[
                { stage: 'New Leads', count: chartData.reduce((sum, d) => sum + d.leads, 0), color: '#3B82F6' },
                { stage: 'Qualified', count: Math.floor(chartData.reduce((sum, d) => sum + d.leads, 0) * 0.7), color: '#10B981' },
                { stage: 'Proposals', count: Math.floor(chartData.reduce((sum, d) => sum + d.leads, 0) * 0.4), color: '#F59E0B' },
                { stage: 'Converted', count: Math.floor(chartData.reduce((sum, d) => sum + d.conversions, 0)), color: '#EF4444' },
              ].map((stage, index) => {
                const maxCount = chartData.reduce((sum, d) => sum + d.leads, 0);
                const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                
                return (
                  <motion.div
                    key={stage.stage}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">
                        {stage.stage}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {stage.count}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: stage.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCallChart = () => {
    const maxCalls = Math.max(...callAnalytics.map(d => d.count));
    const peakHour = callAnalytics.reduce((max, current) => 
      current.count > max.count ? current : max, callAnalytics[0]);
    
    return (
      <div className="space-y-4">
        {/* Call volume by hour */}
        <div className="h-48 relative bg-gradient-to-t from-neutral-50 to-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="absolute inset-4">
            <div className="flex items-end justify-between h-full px-2">
              {callAnalytics.filter(d => d.hour >= 9 && d.hour <= 20).map((data, index) => {
                const height = maxCalls > 0 ? (data.count / maxCalls) * 100 : 0;
                const hourLabel = data.hour > 12 ? `${data.hour - 12}PM` : `${data.hour}AM`;
                
                return (
                  <motion.div
                    key={data.hour}
                    className="flex flex-col items-center gap-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.div
                      className="w-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t cursor-pointer"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 5)}%` }}
                      transition={{ delay: index * 0.05, duration: 0.6 }}
                      whileHover={{ scale: 1.1, opacity: 0.8 }}
                      title={`${hourLabel}: ${data.count} calls, ${data.successRate.toFixed(1)}% success`}
                    />
                    <span className="text-xs text-neutral-600 transform -rotate-45 origin-center">
                      {hourLabel}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call insights */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-lg font-bold text-purple-600">
              {peakHour.hour > 12 ? `${peakHour.hour - 12}PM` : `${peakHour.hour}AM`}
            </div>
            <div className="text-xs text-purple-700">Peak Hour</div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="text-lg font-bold text-green-600">
              {formatValue(callAnalytics.reduce((sum, d) => sum + d.successRate, 0) / callAnalytics.length, 'percentage')}
            </div>
            <div className="text-xs text-green-700">Avg Success Rate</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-lg font-bold text-blue-600">
              {formatValue(callAnalytics.reduce((sum, d) => sum + d.avgDuration, 0) / callAnalytics.length, 'time')}
            </div>
            <div className="text-xs text-blue-700">Avg Duration</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGeographyChart = () => {
    const maxRevenue = Math.max(...cityData.map(d => d.revenue));
    
    return (
      <div className="space-y-4">
        {/* City performance */}
        <div className="space-y-3">
          {cityData.map((city, index) => {
            const revenueWidth = maxRevenue > 0 ? (city.revenue / maxRevenue) * 100 : 0;
            const isSelected = selectedCity === city.city;
            
            return (
              <motion.div
                key={city.city}
                className={cn(
                  'p-4 rounded-lg border cursor-pointer transition-all duration-200',
                  isSelected 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-neutral-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCity(isSelected ? null : city.city)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-neutral-900">{city.city}</span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {formatValue(city.revenue, 'currency')}
                  </div>
                </div>
                
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${revenueWidth}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-neutral-600">
                  <div>
                    <div className="font-medium text-neutral-900">{city.bookings}</div>
                    <div>Bookings</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">{city.leads}</div>
                    <div>Leads</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">{city.occupancy.toFixed(1)}%</div>
                    <div>Occupancy</div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-orange-200"
                    >
                      <div className="text-sm text-neutral-700">
                        <div className="mb-2">
                          <strong>Performance Insights:</strong>
                        </div>
                        <ul className="space-y-1 text-xs">
                          <li>• Revenue per booking: {formatValue(city.bookings > 0 ? city.revenue / city.bookings : 0, 'currency')}</li>
                          <li>• Lead conversion: {city.leads > 0 ? ((city.bookings / city.leads) * 100).toFixed(1) : 0}%</li>
                          <li>• Market position: #{index + 1} by revenue</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <BarChart3 className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              CRM Charts & Visualizations
            </h3>
            <p className="text-sm text-neutral-600">
              Interactive charts and data visualizations
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-white/10"
            title="Refresh data"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
          
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Activity className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-neutral-700">Interactive</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Chart Type Selector */}
      <motion.div
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          const isActive = selectedChart === chart.id;

          return (
            <motion.button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                isActive 
                  ? `bg-gradient-to-r ${chart.color} text-white shadow-lg`
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/60 bg-white/40 border border-white/40'
              )}
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              {chart.name}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Chart Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FuturisticCard className="p-6">
          <div className="space-y-4">
            {/* Chart Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">
                  {chartTypes.find(c => c.id === selectedChart)?.name}
                </h4>
                <p className="text-sm text-neutral-600">
                  {selectedChart === 'revenue' && 'Revenue trends and performance over time'}
                  {selectedChart === 'leads' && 'Lead sources and conversion funnel analysis'}
                  {selectedChart === 'calls' && 'Call volume and success rates by time'}
                  {selectedChart === 'geography' && 'Performance breakdown by city and region'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-xl hover:bg-white/10"
                  title="Export chart"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-xl hover:bg-white/10"
                  title="Expand chart"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chart Content */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-64 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-xl"
                />
              ) : (
                <motion.div
                  key={selectedChart}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderChart()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FuturisticCard>
      </motion.div>
    </div>
  );
};

export default CRMChartsPanel;
