'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Phone,
  Calendar,
  Target,
  Activity,
  Zap,
  Clock,
  Award,
} from 'lucide-react';
import { cn } from '@/utils';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';
import FuturisticCard from '@/components/ui/FuturisticCard';

interface MetricData {
  id: string;
  title: string;
  value: string | number;
  previousValue: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  description: string;
  unit?: string;
  format?: 'currency' | 'percentage' | 'number';
}

const mockMetrics: MetricData[] = [
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: 2840000,
    previousValue: 2650000,
    change: 7.2,
    trend: 'up',
    icon: DollarSign,
    color: 'from-blue-600 to-blue-700',
    description: 'Monthly recurring revenue',
    format: 'currency',
  },
  {
    id: 'active-leads',
    title: 'Active Leads',
    value: 147,
    previousValue: 132,
    change: 11.4,
    trend: 'up',
    icon: Target,
    color: 'from-blue-700 to-blue-800',
    description: 'Qualified leads in pipeline',
    format: 'number',
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: 23.8,
    previousValue: 21.2,
    change: 12.3,
    trend: 'up',
    icon: TrendingUp,
    color: 'from-blue-800 to-blue-900',
    description: 'Lead to customer conversion',
    unit: '%',
    format: 'percentage',
  },
  {
    id: 'avg-response-time',
    title: 'Avg Response Time',
    value: 4.2,
    previousValue: 6.1,
    change: -31.1,
    trend: 'up', // Negative change is good for response time
    icon: Clock,
    color: 'from-blue-500 to-blue-600',
    description: 'Average lead response time',
    unit: 'hrs',
    format: 'number',
  },
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction',
    value: 4.7,
    previousValue: 4.5,
    change: 4.4,
    trend: 'up',
    icon: Award,
    color: 'from-blue-600 to-blue-700',
    description: 'Average customer rating',
    unit: '/5',
    format: 'number',
  },
  {
    id: 'booking-occupancy',
    title: 'Occupancy Rate',
    value: 87.3,
    previousValue: 82.1,
    change: 6.3,
    trend: 'up',
    icon: Calendar,
    color: 'from-blue-700 to-blue-800',
    description: 'Property occupancy percentage',
    unit: '%',
    format: 'percentage',
  },
];

const PerformanceMetricsGrid: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: string | number, format?: string, unit?: string) => {
    if (format === 'currency') {
      return `₹${(Number(value) / 100000).toFixed(1)}L`;
    }
    if (format === 'percentage') {
      return `${value}${unit || '%'}`;
    }
    return `${value}${unit || ''}`;
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
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Activity className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Performance Overview
            </h3>
            <p className="text-sm text-neutral-600">
              Key metrics and performance indicators
            </p>
          </div>
        </div>
        
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-neutral-700">Real-time</span>
        </motion.div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
        key={animationKey}
      >
        {mockMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isSelected = selectedMetric === metric.id;

          return (
            <motion.div
              key={metric.id}
              variants={motionVariants.staggerChild}
              custom={index}
              whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <FuturisticCard
                className={cn(
                  'p-6 cursor-pointer transition-all duration-300',
                  isSelected 
                    ? 'ring-2 ring-blue-500/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5' 
                    : 'hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-cyan-500/5'
                )}
                onClick={() => setSelectedMetric(isSelected ? null : metric.id)}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={cn(
                          'flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-white',
                          metric.color
                        )}
                        whileHover={reducedMotion ? {} : { scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                          {metric.title}
                        </h4>
                        <p className="text-xs font-semibold text-blue-700">
                          {metric.description}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Value */}
                  <motion.div
                    className="space-y-2"
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <div className="text-3xl font-black text-blue-900">
                      {formatValue(metric.value, metric.format, metric.unit)}
                    </div>
                  </motion.div>


                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 pt-3 border-t border-neutral-200"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-neutral-600">Current</span>
                            <div className="font-semibold text-neutral-900">
                              {formatValue(metric.value, metric.format, metric.unit)}
                            </div>
                          </div>
                          <div>
                            <span className="text-neutral-600">Previous</span>
                            <div className="font-semibold text-neutral-900">
                              {formatValue(metric.previousValue, metric.format, metric.unit)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-neutral-50 to-white">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-neutral-700">
                              Trend Analysis
                            </span>
                          </div>
                          <div className={cn(
                            'text-sm font-bold',
                            getTrendColor(metric.trend, metric.change)
                          )}>
                            {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FuturisticCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-neutral-900">
              Overall Performance
            </h4>
            <p className="text-sm text-neutral-600">
              Compared to previous period
            </p>
          </div>
          
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">+8.7% Growth</span>
          </motion.div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">↑ 5</div>
            <div className="text-neutral-600">Improving</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-600">→ 1</div>
            <div className="text-neutral-600">Stable</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">↓ 0</div>
            <div className="text-neutral-600">Declining</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceMetricsGrid;


