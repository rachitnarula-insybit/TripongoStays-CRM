import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Mail,
  Phone,
  DollarSign,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle,
  X,
  BarChart3,
  Gauge,
  ArrowUp,
  ArrowDown,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';
import { cn } from '@/utils';

export interface AIRecommendation {
  id: string;
  type: 'lead_nurturing' | 'booking_optimization' | 'revenue_growth' | 'customer_retention' | 'efficiency';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  effort: 'low' | 'medium' | 'high';
  estimatedROI?: string;
  timeToImplement?: string;
  confidence: number;
  actions: {
    primary: {
      label: string;
      action: string;
    };
    secondary?: {
      label: string;
      action: string;
    };
  };
}

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  onActionClick?: (recommendationId: string, actionType: 'primary' | 'secondary') => void;
  onDismiss?: (recommendationId: string) => void;
  className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onActionClick,
  onDismiss,
  className
}) => {
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const getRecommendationConfig = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'lead_nurturing':
        return {
          icon: Users,
          iconBg: 'bg-brand-primary-100',
          iconColor: 'text-brand-primary-600',
          category: 'Lead Management'
        };
      case 'booking_optimization':
        return {
          icon: Calendar,
          iconBg: 'bg-success-light',
          iconColor: 'text-success-default',
          category: 'Booking Optimization'
        };
      case 'revenue_growth':
        return {
          icon: DollarSign,
          iconBg: 'bg-warning-light',
          iconColor: 'text-warning-default',
          category: 'Revenue Growth'
        };
      case 'customer_retention':
        return {
          icon: Target,
          iconBg: 'bg-info-light',
          iconColor: 'text-info-default',
          category: 'Customer Retention'
        };
      case 'efficiency':
        return {
          icon: Zap,
          iconBg: 'bg-brand-accent/10',
          iconColor: 'text-brand-accent',
          category: 'Efficiency'
        };
      default:
        return {
          icon: Sparkles,
          iconBg: 'bg-neutral-100',
          iconColor: 'text-neutral-600',
          category: 'General'
        };
    }
  };

  const getPriorityConfig = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return {
          color: 'text-error-default',
          bg: 'bg-error-light',
          label: 'High Priority'
        };
      case 'medium':
        return {
          color: 'text-warning-default',
          bg: 'bg-warning-light',
          label: 'Medium Priority'
        };
      case 'low':
        return {
          color: 'text-success-default',
          bg: 'bg-success-light',
          label: 'Low Priority'
        };
    }
  };

  const getEffortConfig = (effort: AIRecommendation['effort']) => {
    switch (effort) {
      case 'low':
        return { label: 'Quick Win', color: 'text-success-default' };
      case 'medium':
        return { label: 'Medium Effort', color: 'text-warning-default' };
      case 'high':
        return { label: 'High Effort', color: 'text-error-default' };
    }
  };

  const handleActionClick = (recommendationId: string, actionType: 'primary' | 'secondary') => {
    setCompletedActions(prev => new Set(prev).add(`${recommendationId}-${actionType}`));
    onActionClick?.(recommendationId, actionType);
  };

  if (recommendations.length === 0) {
    return (
      <Card variant="glass" className={className}>
        <CardContent className="text-center py-8">
          <Sparkles className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600">No AI recommendations available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={motionVariants.staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      <Card variant="glass" hover className="overflow-hidden shadow-lg">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-brand-accent/10 to-futuristic-neon/10 rounded-xl border border-brand-accent/20">
                <Sparkles className="h-6 w-6 text-brand-accent" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-neutral-900">
                  AI-Recommended Actions
                </CardTitle>
                <CardDescription className="text-sm">
                  Smart suggestions to boost your business performance
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-sm">
              <span className="text-sm font-semibold text-white">High Impact</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <AnimatePresence>
            {recommendations.map((recommendation, index) => {
              const isHighPriority = recommendation.priority === 'high';
              
              return (
                <motion.div
                  key={recommendation.id}
                  variants={motionVariants.staggerChild}
                  layout
                  className="relative"
                >
                  <div className={cn(
                    'p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] group',
                    'bg-white/80 border-neutral-200 hover:border-brand-accent/40 hover:shadow-md',
                    'backdrop-blur-sm hover:bg-white/90'
                  )}>
                    {/* Title and Priority */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-neutral-900 font-semibold text-base leading-tight flex-1 pr-3">
                        {recommendation.title}
                      </h4>
                      {isHighPriority && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200">
                          high
                        </span>
                      )}
                      {recommendation.priority === 'medium' && (
                        <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-200">
                          medium
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                      {recommendation.description}
                    </p>

                    {/* Impact Highlight */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {recommendation.impact.includes('$') && (
                          <div className="p-1.5 bg-green-50 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                        {recommendation.impact.includes('%') && !recommendation.impact.includes('$') && (
                          <div className="p-1.5 bg-green-50 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                        <span className="text-green-600 font-bold text-base">
                          {recommendation.impact}
                        </span>
                      </div>
                      
                      {/* Action Button */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleActionClick(recommendation.id, 'primary')}
                        className={cn(
                          'transition-all duration-200 hover:shadow-md',
                          completedActions.has(`${recommendation.id}-primary`) && 
                          'bg-green-600 hover:bg-green-700'
                        )}
                        rightIcon={
                          completedActions.has(`${recommendation.id}-primary`) ? 
                          <CheckCircle className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                        disabled={completedActions.has(`${recommendation.id}-primary`)}
                        haptic="light"
                      >
                        {completedActions.has(`${recommendation.id}-primary`) ? 
                          'Completed' : 
                          recommendation.actions.primary.label
                        }
                      </Button>
                    </div>

                    {/* Dismiss Button */}
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(recommendation.id)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIRecommendations;
