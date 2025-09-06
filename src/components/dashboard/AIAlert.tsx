import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';
import { cn } from '@/utils';
import FuturisticCard from '@/components/ui/FuturisticCard';

export interface AIAlertData {
  id: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  impact?: string;
  confidence: number;
  actionRequired: boolean;
  trend?: 'up' | 'down' | 'stable';
  metric?: string;
  change?: number;
  timeframe?: string;
}

interface AIAlertProps {
  alert: AIAlertData;
  className?: string;
}

const AIAlert: React.FC<AIAlertProps> = ({
  alert,
  className
}) => {
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);

  const getAlertConfig = (type: AIAlertData['type']) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-error-light',
          iconColor: 'text-error-default',
          borderColor: 'border-error-light',
          accentColor: 'bg-error-default'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-warning-light',
          iconColor: 'text-warning-default',
          borderColor: 'border-warning-light',
          accentColor: 'bg-warning-default'
        };
      case 'info':
        return {
          icon: Info,
          iconBg: 'bg-brand-primary-100',
          iconColor: 'text-brand-primary-600',
          borderColor: 'border-brand-primary-200',
          accentColor: 'bg-brand-primary-500'
        };
      case 'success':
        return {
          icon: TrendingUp,
          iconBg: 'bg-success-light',
          iconColor: 'text-success-default',
          borderColor: 'border-success-light',
          accentColor: 'bg-success-default'
        };
      default:
        return {
          icon: Info,
          iconBg: 'bg-neutral-100',
          iconColor: 'text-neutral-600',
          borderColor: 'border-neutral-200',
          accentColor: 'bg-neutral-500'
        };
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return null;
    }
  };

  const config = getAlertConfig(alert.type);
  const IconComponent = config.icon;
  const TrendIcon = getTrendIcon(alert.trend);

  const getGradientType = (type: AIAlertData['type']) => {
    switch (type) {
      case 'critical':
        return 'cyber';
      case 'warning':
        return 'electric';
      case 'success':
        return 'neon';
      case 'info':
      default:
        return 'plasma';
    }
  };

  return (
    <motion.div
      variants={motionVariants.staggerChild}
      className={cn(
        'relative overflow-hidden',
        className
      )}
    >
      <FuturisticCard 
        variant="gradient" 
        gradientType={getGradientType(alert.type)}
        intensity="subtle"
        hover
        glow
        className={cn(
          'relative border-l-4 transition-all duration-300',
          config.borderColor
        )}
      >
        {/* AI Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-futuristic-neon/10 rounded-full border border-futuristic-neon/20">
            <div className="w-1.5 h-1.5 bg-futuristic-neon rounded-full animate-pulse" />
            <span className="text-xs font-medium text-futuristic-neon">AI</span>
          </div>
        </div>

        {/* Accent Bar */}
        <div className={cn('absolute top-0 left-0 w-1 h-full', config.accentColor)} />

        <div className="pb-3">
          <div className="flex items-start gap-3 pr-16">
            <div className={cn('p-2 rounded-lg', config.iconBg)}>
              <IconComponent className={cn('h-5 w-5', config.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-neutral-900 text-sm leading-tight">
                  {alert.title}
                </h3>
                {alert.actionRequired && (
                  <span className="px-2 py-0.5 bg-error-light text-error-default text-xs font-medium rounded-full">
                    Action Required
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {alert.description}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-0">
          {/* Metrics Row */}
          {(alert.metric || alert.confidence) && (
            <div className="flex items-center justify-between mb-4 p-3 bg-neutral-50 rounded-lg">
              {alert.metric && (
                <div className="flex items-center gap-2">
                  {TrendIcon && (
                    <TrendIcon className={cn(
                      'h-4 w-4',
                      alert.trend === 'up' ? 'text-success-default' : 
                      alert.trend === 'down' ? 'text-error-default' : 
                      'text-neutral-500'
                    )} />
                  )}
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">
                      {alert.metric}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {alert.change && alert.change > 0 ? '+' : ''}{alert.change}%
                      {alert.timeframe && (
                        <span className="text-xs text-neutral-500 ml-1">
                          {alert.timeframe}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="text-right">
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  AI Confidence
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full transition-all duration-500',
                        alert.confidence >= 80 ? 'bg-success-default' :
                        alert.confidence >= 60 ? 'bg-warning-default' :
                        'bg-error-default'
                      )}
                      style={{ width: `${alert.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    {alert.confidence}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Impact Statement */}
          {alert.impact && (
            <div className="mb-4 p-3 bg-brand-primary-50 rounded-lg border border-brand-primary-100">
              <p className="text-sm text-brand-primary-700">
                <span className="font-medium">Impact:</span> {alert.impact}
              </p>
            </div>
          )}

        </div>
      </FuturisticCard>
    </motion.div>
  );
};

export default AIAlert;
