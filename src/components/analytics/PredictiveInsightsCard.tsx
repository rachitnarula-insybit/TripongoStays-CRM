'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { cn } from '@/utils';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';
import FuturisticCard from '@/components/ui/FuturisticCard';
import Button from '@/components/ui/Button';

interface PredictionData {
  id: string;
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'revenue' | 'leads' | 'efficiency' | 'market';
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  actionable: boolean;
}

const mockPredictions: PredictionData[] = [
  {
    id: 'revenue-forecast',
    title: 'Q4 Revenue Projection',
    description: 'Based on current booking patterns and market trends',
    prediction: '₹18.5L expected revenue increase',
    confidence: 87,
    timeframe: 'Next 3 months',
    impact: 'positive',
    category: 'revenue',
    trend: { direction: 'up', percentage: 23 },
    actionable: true,
  },
  {
    id: 'lead-conversion',
    title: 'Lead Conversion Optimization',
    description: 'AI analysis of lead quality and response patterns',
    prediction: '34% improvement in conversion rate',
    confidence: 92,
    timeframe: 'Next 30 days',
    impact: 'positive',
    category: 'leads',
    trend: { direction: 'up', percentage: 34 },
    actionable: true,
  },
  {
    id: 'market-demand',
    title: 'Mumbai Market Surge',
    description: 'Predictive analysis shows increasing demand',
    prediction: 'Premium property demand +45%',
    confidence: 78,
    timeframe: 'Next 2 months',
    impact: 'positive',
    category: 'market',
    trend: { direction: 'up', percentage: 45 },
    actionable: false,
  },
  {
    id: 'efficiency-gain',
    title: 'Process Automation Impact',
    description: 'Expected efficiency gains from current implementations',
    prediction: '28% reduction in response time',
    confidence: 85,
    timeframe: 'Next 6 weeks',
    impact: 'positive',
    category: 'efficiency',
    trend: { direction: 'up', percentage: 28 },
    actionable: true,
  },
];

const categoryIcons = {
  revenue: BarChart3,
  leads: Target,
  efficiency: Zap,
  market: PieChart,
};

const categoryColors = {
  revenue: 'from-green-500 to-emerald-500',
  leads: 'from-blue-500 to-cyan-500',
  efficiency: 'from-purple-500 to-pink-500',
  market: 'from-orange-500 to-red-500',
};

const PredictiveInsightsCard: React.FC = () => {
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Activity;
    }
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
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              AI Predictions
            </h3>
            <p className="text-sm text-neutral-600">
              Future insights based on data analysis
            </p>
          </div>
        </div>
        
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-neutral-700">Live Analysis</span>
        </motion.div>
      </motion.div>

      {/* Predictions Grid */}
      <motion.div
        className="grid grid-cols-1 gap-4"
        variants={motionVariants.staggerContainer}
        initial="initial"
        animate="animate"
        key={animationKey}
      >
        {mockPredictions.map((prediction, index) => {
          const CategoryIcon = categoryIcons[prediction.category];
          const TrendIcon = getTrendIcon(prediction.trend.direction);
          const isSelected = selectedPrediction === prediction.id;

          return (
            <motion.div
              key={prediction.id}
              variants={motionVariants.staggerChild}
              custom={index}
              whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <FuturisticCard
                className={cn(
                  'p-6 cursor-pointer transition-all duration-300',
                  isSelected 
                    ? 'ring-2 ring-purple-500/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5' 
                    : 'hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-pink-500/5'
                )}
                onClick={() => setSelectedPrediction(isSelected ? null : prediction.id)}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br text-white',
                          categoryColors[prediction.category]
                        )}
                        whileHover={reducedMotion ? {} : { scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <CategoryIcon className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h4 className="text-base font-semibold text-neutral-900">
                          {prediction.title}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          {prediction.description}
                        </p>
                      </div>
                    </div>

                    {/* Confidence Badge */}
                    <motion.div
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        getConfidenceColor(prediction.confidence)
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {prediction.confidence}%
                    </motion.div>
                  </div>

                  {/* Prediction */}
                  <motion.div
                    className="p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-white border border-neutral-200"
                    whileHover={reducedMotion ? {} : { scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-neutral-900">
                          {prediction.prediction}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-600">
                            {prediction.timeframe}
                          </span>
                        </div>
                      </div>
                      
                      <motion.div
                        className={cn(
                          'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                          prediction.trend.direction === 'up' 
                            ? 'text-green-700 bg-green-100'
                            : prediction.trend.direction === 'down'
                            ? 'text-red-700 bg-red-100'
                            : 'text-neutral-700 bg-neutral-100'
                        )}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        <TrendIcon className="w-4 h-4" />
                        {prediction.trend.percentage}%
                      </motion.div>
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
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-3 h-3 rounded-full',
                              prediction.impact === 'positive' ? 'bg-green-500' :
                              prediction.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                            )} />
                            <span className="text-neutral-600 capitalize">
                              {prediction.impact} Impact
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Target className="w-3 h-3 text-neutral-500" />
                            <span className="text-neutral-600 capitalize">
                              {prediction.category}
                            </span>
                          </div>
                        </div>

                        {prediction.actionable && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Button
                              variant="tertiary"
                              size="sm"
                              className="w-full justify-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Take Action
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FuturisticCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Processing Indicator */}
      <motion.div
        className="mt-8 p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <Brain className="w-4 h-4 text-white" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-neutral-900">
              AI Continuously Learning
            </p>
            <p className="text-xs text-neutral-600">
              Predictions become more accurate with every data point
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveInsightsCard;


