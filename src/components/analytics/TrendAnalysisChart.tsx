'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  RefreshCw,
  Activity,
  Calendar,
  Download,
} from 'lucide-react';
import { cn } from '@/utils';
import Button from '@/components/ui/Button';
import FuturisticCard from '@/components/ui/FuturisticCard';

interface TrendData {
  period: string;
  revenue: number;
  leads: number;
  conversions: number;
  satisfaction: number;
}

const mockTrendData: TrendData[] = [
  { period: 'Jan', revenue: 2200000, leads: 120, conversions: 23, satisfaction: 4.2 },
  { period: 'Feb', revenue: 2350000, leads: 135, conversions: 25, satisfaction: 4.3 },
  { period: 'Mar', revenue: 2180000, leads: 118, conversions: 22, satisfaction: 4.1 },
  { period: 'Apr', revenue: 2420000, leads: 142, conversions: 28, satisfaction: 4.4 },
  { period: 'May', revenue: 2680000, leads: 156, conversions: 31, satisfaction: 4.5 },
  { period: 'Jun', revenue: 2840000, leads: 147, conversions: 35, satisfaction: 4.7 },
];

const chartTypes = [
  { id: 'line', name: 'Line Chart', icon: LineChart, color: 'from-blue-500 to-cyan-500' },
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
  { id: 'area', name: 'Area Chart', icon: Activity, color: 'from-purple-500 to-pink-500' },
];

const metrics = [
  { id: 'revenue', name: 'Revenue', color: 'rgb(34, 197, 94)', unit: '₹' },
  { id: 'leads', name: 'Leads', color: 'rgb(59, 130, 246)', unit: '' },
  { id: 'conversions', name: 'Conversions', color: 'rgb(168, 85, 247)', unit: '%' },
  { id: 'satisfaction', name: 'Satisfaction', color: 'rgb(245, 158, 11)', unit: '/5' },
];

const TrendAnalysisChart: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [timeRange, setTimeRange] = useState('6m');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const getMetricValue = (data: TrendData, metric: string) => {
    switch (metric) {
      case 'revenue':
        return data.revenue / 100000; // Convert to lakhs
      case 'leads':
        return data.leads;
      case 'conversions':
        return data.conversions;
      case 'satisfaction':
        return data.satisfaction;
      default:
        return 0;
    }
  };

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'revenue':
        return `₹${value.toFixed(1)}L`;
      case 'leads':
        return value.toString();
      case 'conversions':
        return `${value}%`;
      case 'satisfaction':
        return `${value}/5`;
      default:
        return value.toString();
    }
  };

  const calculateTrend = () => {
    const currentValue = getMetricValue(mockTrendData[mockTrendData.length - 1], selectedMetric);
    const previousValue = getMetricValue(mockTrendData[mockTrendData.length - 2], selectedMetric);
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return { change, direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable' };
  };

  const trend = calculateTrend();
  const maxValue = Math.max(...mockTrendData.map(d => getMetricValue(d, selectedMetric)));
  const selectedMetricConfig = metrics.find(m => m.id === selectedMetric)!;

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
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <TrendingUp className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Trend Analysis
            </h3>
            <p className="text-sm text-neutral-600">
              Historical performance and patterns
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl hover:bg-white/10"
            title="Refresh data"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          </Button>
          
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Calendar className="w-3 h-3 text-orange-600" />
            <span className="text-xs font-medium text-neutral-700">Last 6 months</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-white border border-neutral-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Chart Type */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">Chart:</span>
          <div className="flex items-center gap-1">
            {chartTypes.map((chart) => {
              const Icon = chart.icon;
              const isActive = selectedChart === chart.id;

              return (
                <motion.button
                  key={chart.id}
                  onClick={() => setSelectedChart(chart.id)}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    isActive 
                      ? `bg-gradient-to-r ${chart.color} text-white shadow-md`
                      : 'text-neutral-600 hover:bg-white/50'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={chart.name}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">Metric:</span>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-1 rounded-lg border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {metrics.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">Period:</span>
          <div className="flex items-center gap-1">
            {['3m', '6m', '1y'].map((range) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200',
                  timeRange === range
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-neutral-600 hover:bg-white/50'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chart Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FuturisticCard className="p-6">
          <div className="space-y-6">
            {/* Chart Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">
                  {selectedMetricConfig.name} Trend
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-neutral-600">
                    Current: {formatValue(getMetricValue(mockTrendData[mockTrendData.length - 1], selectedMetric), selectedMetric)}
                  </span>
                  <motion.div
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                      trend.direction === 'up' ? 'text-green-700 bg-green-100' :
                      trend.direction === 'down' ? 'text-red-700 bg-red-100' :
                      'text-neutral-700 bg-neutral-100'
                    )}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                     trend.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                     <Activity className="w-3 h-3" />}
                    {Math.abs(trend.change).toFixed(1)}%
                  </motion.div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-xl hover:bg-white/10"
                title="Export chart"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            {/* Simplified Chart Visualization */}
            <div className="relative h-64 bg-gradient-to-t from-neutral-50 to-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="absolute inset-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-500">
                  <span>{formatValue(maxValue, selectedMetric)}</span>
                  <span>{formatValue(maxValue * 0.75, selectedMetric)}</span>
                  <span>{formatValue(maxValue * 0.5, selectedMetric)}</span>
                  <span>{formatValue(maxValue * 0.25, selectedMetric)}</span>
                  <span>0</span>
                </div>

                {/* Chart Area */}
                <div className="ml-12 mr-4 h-full relative">
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

                  {/* Chart visualization based on type */}
                  <div className="absolute inset-0 flex items-end justify-between px-2">
                    {mockTrendData.map((data, index) => {
                      const value = getMetricValue(data, selectedMetric);
                      const height = (value / maxValue) * 100;
                      
                      return (
                        <motion.div
                          key={data.period}
                          className="flex flex-col items-center gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {selectedChart === 'bar' && (
                            <motion.div
                              className="w-8 bg-gradient-to-t rounded-t"
                              style={{
                                height: `${height}%`,
                                background: `linear-gradient(to top, ${selectedMetricConfig.color}, ${selectedMetricConfig.color}99)`
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: index * 0.1, duration: 0.8 }}
                              whileHover={{ scale: 1.1 }}
                              title={`${data.period}: ${formatValue(value, selectedMetric)}`}
                            />
                          )}
                          
                          {selectedChart === 'line' && (
                            <motion.div
                              className="w-3 h-3 rounded-full border-2 border-white shadow-md"
                              style={{
                                backgroundColor: selectedMetricConfig.color,
                                position: 'absolute',
                                bottom: `${height}%`,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.5 }}
                              title={`${data.period}: ${formatValue(value, selectedMetric)}`}
                            />
                          )}
                          
                          {selectedChart === 'area' && (
                            <motion.div
                              className="w-8 rounded-t"
                              style={{
                                height: `${height}%`,
                                background: `linear-gradient(to top, ${selectedMetricConfig.color}33, ${selectedMetricConfig.color}66)`
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: index * 0.1, duration: 0.8 }}
                              whileHover={{ scale: 1.05 }}
                              title={`${data.period}: ${formatValue(value, selectedMetric)}`}
                            />
                          )}
                          
                          <span className="text-xs text-neutral-600 font-medium">
                            {data.period}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Line connections for line chart */}
                  {selectedChart === 'line' && (
                    <svg className="absolute inset-0 pointer-events-none">
                      <motion.path
                        d={`M ${mockTrendData.map((data, index) => {
                          const value = getMetricValue(data, selectedMetric);
                          const height = (value / maxValue) * 100;
                          const x = (index / (mockTrendData.length - 1)) * 100;
                          return `${x}% ${100 - height}%`;
                        }).join(' L ')}`}
                        fill="none"
                        stroke={selectedMetricConfig.color}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Chart Insights */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-neutral-700">Peak Performance</h5>
                <div className="text-lg font-bold text-green-600">
                  {formatValue(maxValue, selectedMetric)}
                </div>
                <p className="text-xs text-neutral-500">
                  Highest value in selected period
                </p>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-neutral-700">Growth Rate</h5>
                <div className={cn(
                  'text-lg font-bold',
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                </div>
                <p className="text-xs text-neutral-500">
                  Month-over-month change
                </p>
              </div>
            </div>
          </div>
        </FuturisticCard>
      </motion.div>

      {/* Additional Insights */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <FuturisticCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900">Best Month</h4>
              <p className="text-sm text-neutral-600">June 2024</p>
              <p className="text-xs text-green-600">+12% growth</p>
            </div>
          </div>
        </FuturisticCard>

        <FuturisticCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900">Avg Growth</h4>
              <p className="text-sm text-neutral-600">Monthly</p>
              <p className="text-xs text-blue-600">+8.3% average</p>
            </div>
          </div>
        </FuturisticCard>
      </motion.div>
    </div>
  );
};

export default TrendAnalysisChart;


