'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Award,
  AlertCircle,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';
import Button from '@/components/ui/Button';
import FuturisticCard from '@/components/ui/FuturisticCard';
import { AIRecommendation } from '@/components/dashboard/AIRecommendations';

interface AIRecommendationsPanelProps {
  recommendations: AIRecommendation[];
}

const priorityConfig: Record<
  AIRecommendation['priority'],
  {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon: LucideIcon;
  }
> = {
  high: {
    color: 'from-red-500 to-pink-500',
    bgColor: 'from-red-500/10 to-pink-500/10',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-600',
    icon: AlertCircle,
  },
  medium: {
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-500/20',
    textColor: 'text-yellow-600',
    icon: Clock,
  },
  low: {
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20',
    textColor: 'text-green-600',
    icon: CheckCircle,
  },
};

const typeConfig: Record<
  AIRecommendation['type'],
  {
    icon: LucideIcon;
    label: string;
    color: string;
  }
> = {
  lead_nurturing: {
    icon: Users,
    label: 'Lead Nurturing',
    color: 'from-blue-500 to-cyan-500',
  },
  revenue_growth: {
    icon: DollarSign,
    label: 'Revenue Growth',
    color: 'from-green-500 to-emerald-500',
  },
  efficiency: {
    icon: Zap,
    label: 'Efficiency',
    color: 'from-purple-500 to-pink-500',
  },
  customer_retention: {
    icon: Award,
    label: 'Customer Retention',
    color: 'from-orange-500 to-red-500',
  },
  booking_optimization: {
    icon: Target,
    label: 'Booking Optimization',
    color: 'from-teal-500 to-cyan-500',
  },
};

const AIRecommendationsPanel: React.FC<AIRecommendationsPanelProps> = ({ recommendations }) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const handleActionClick = (recommendationId: string, action: string) => {
    hapticFeedback.medium();
    setCompletedActions(prev => new Set(prev).add(recommendationId));

    setTimeout(() => {
      console.log(`Executed action: ${action} for recommendation: ${recommendationId}`);
    }, 1000);
  };

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder: Record<AIRecommendation['priority'], number> = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const avgConfidence =
    recommendations.length === 0
      ? 0
      : Math.round(recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length);

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
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Target className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Smart Recommendations</h3>
            <p className="text-sm text-neutral-600">AI-powered actions to optimize performance</p>
          </div>
        </div>

        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Lightbulb className="w-3 h-3 text-green-600" />
          <span className="text-xs font-medium text-neutral-700">{recommendations.length} Actions</span>
        </motion.div>
      </motion.div>

      {/* Priority Summary */}
      <motion.div
        className="grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {(['high', 'medium', 'low'] as const).map((priority) => {
          const count = recommendations.filter(r => r.priority === priority).length;
          const config = priorityConfig[priority];
          const PriorityIcon = config.icon;

          return (
            <motion.div
              key={priority}
              className={cn('p-3 rounded-xl bg-gradient-to-r border', config.bgColor, config.borderColor)}
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <PriorityIcon className={cn('w-4 h-4', config.textColor)} />
                <span className="text-sm font-medium text-neutral-900 capitalize">{priority}</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mt-1">{count}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recommendations List */}
      <motion.div className="space-y-4" variants={motionVariants.staggerContainer} initial="initial" animate="animate">
        {sortedRecommendations.map((recommendation, index) => {
          const isSelected = selectedRecommendation === recommendation.id;
          const isCompleted = completedActions.has(recommendation.id);
          const priorityConfig_ = priorityConfig[recommendation.priority];
          const typeConfig_ = typeConfig[recommendation.type];
          const PriorityIcon = priorityConfig_.icon;
          const TypeIcon = typeConfig_.icon;

          return (
            <motion.div
              key={recommendation.id}
              variants={motionVariants.staggerChild}
              custom={index}
              whileHover={reducedMotion ? {} : { scale: 1.01, y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <FuturisticCard
                className={cn(
                  'p-6 cursor-pointer transition-all duration-300',
                  isSelected && 'ring-2 ring-green-500/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5',
                  isCompleted && 'opacity-60 bg-gradient-to-r from-green-500/10 to-emerald-500/10'
                )}
                onClick={() => setSelectedRecommendation(isSelected ? null : recommendation.id)}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <motion.div
                        className={cn(
                          'flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-white',
                          typeConfig_.color
                        )}
                        whileHover={reducedMotion ? {} : { scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <TypeIcon className="w-6 h-6" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold text-neutral-900 truncate">
                            {recommendation.title}
                          </h4>
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500"
                            >
                              <CheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{recommendation.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full',
                              typeConfig_.color
                                .replace('from-', 'bg-')
                                .replace(' to-emerald-500', '')
                                .replace(' to-cyan-500', '')
                                .replace(' to-pink-500', '')
                                .replace(' to-red-500', '')
                                .replace('500', '100'),
                              'text-neutral-700'
                            )}
                          >
                            {typeConfig_.label}
                          </span>
                          <span className="text-neutral-500">Impact: {recommendation.impact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Priority & Confidence */}
                    <div className="flex flex-col items-end gap-2">
                      <motion.div
                        className={cn(
                          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                          priorityConfig_.bgColor,
                          priorityConfig_.borderColor,
                          'border'
                        )}
                        whileHover={{ scale: 1.05 }}
                      >
                        <PriorityIcon className="w-3 h-3" />
                        <span className="capitalize">{recommendation.priority}</span>
                      </motion.div>

                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        <Star className="w-3 h-3" />
                        {recommendation.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-neutral-50 to-white border border-neutral-200">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-neutral-700">{recommendation.estimatedROI}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-neutral-600">{recommendation.timeToImplement}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className="text-neutral-600 capitalize">{recommendation.effort} effort</span>
                      </div>
                    </div>

                    <motion.div
                      className="text-xs text-neutral-500"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      AI Score: {recommendation.confidence}%
                    </motion.div>
                  </div>

                  {/* Action Button */}
                  <motion.div whileHover={reducedMotion ? {} : { scale: 1.02 }} whileTap={reducedMotion ? {} : { scale: 0.98 }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(recommendation.id, recommendation.actions.primary.action);
                      }}
                      disabled={isCompleted}
                      className={cn(
                        'w-full justify-center transition-all duration-300',
                        isCompleted
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      )}
                      haptic="medium"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Action Completed
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          {recommendation.actions.primary.label}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
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
                            <span className="text-neutral-600">Expected ROI</span>
                            <div className="font-semibold text-green-600">{recommendation.estimatedROI}</div>
                          </div>
                          <div>
                            <span className="text-neutral-600">Time Frame</span>
                            <div className="font-semibold text-neutral-900">{recommendation.timeToImplement}</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-neutral-700">AI Insight</span>
                          </div>
                          <p className="text-sm text-neutral-600">
                            This recommendation is based on analysis of similar patterns in high-performing accounts. The
                            confidence score reflects the likelihood of achieving the projected impact.
                          </p>
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

      {/* Summary */}
      <motion.div
        className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-neutral-900">Potential Impact</h4>
            <p className="text-sm text-neutral-600">If all recommendations are implemented</p>
          </div>

          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">+₹2.8L Revenue</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.priority === 'high').length}
            </div>
            <div className="text-neutral-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{avgConfidence}%</div>
            <div className="text-neutral-600">Avg Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{completedActions.size}</div>
            <div className="text-neutral-600">Completed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIRecommendationsPanel;
