import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';
import { useReducedMotion } from '@/utils/motion';
import FuturisticCard from '@/components/ui/FuturisticCard';

interface FuturisticStatsCardProps {
  title: string;
  value: string | number;
  growth?: number;
  icon: LucideIcon;
  gradientType?: 'neon' | 'electric' | 'cyber' | 'plasma' | 'aurora';
  isLoading?: boolean;
}

const FuturisticStatsCard: React.FC<FuturisticStatsCardProps> = ({
  title,
  value,
  growth,
  icon: Icon,
  gradientType = 'neon',
  isLoading = false
}) => {
  const reducedMotion = useReducedMotion();

  if (isLoading) {
    return (
      <FuturisticCard variant="glass" className="animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-brand-primary-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-brand-primary-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-brand-primary-200 rounded w-20"></div>
          <div className="h-4 bg-brand-primary-200 rounded w-16"></div>
        </div>
      </FuturisticCard>
    );
  }

  const gradientColors = {
    neon: 'from-futuristic-neon to-futuristic-plasma',
    electric: 'from-futuristic-electric to-brand-accent',
    cyber: 'from-futuristic-cyber to-futuristic-electric',
    plasma: 'from-futuristic-plasma to-brand-primary-400',
    aurora: 'from-futuristic-neon via-futuristic-cyber to-futuristic-plasma'
  };

  return (
    <FuturisticCard 
      variant="gradient" 
      gradientType={gradientType}
      intensity="subtle"
      hover
      glow
    >
      <div className="space-y-4">
        {/* Header with Icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">
            {title}
          </h3>
          <motion.div 
            className={cn(
              'p-2 rounded-lg',
              `bg-gradient-to-br ${gradientColors[gradientType]}`,
              'shadow-lg'
            )}
            whileHover={reducedMotion ? {} : { 
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 }
            }}
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>
        </div>

        {/* Value */}
        <motion.div 
          className="text-3xl font-bold text-neutral-900"
          initial={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={reducedMotion ? {} : { scale: 1, opacity: 1 }}
          transition={reducedMotion ? {} : { duration: 0.4, delay: 0.1 }}
        >
          {value}
        </motion.div>

        {/* Growth Indicator */}
        {growth !== undefined && (
          <motion.div 
            className="flex items-center space-x-1"
            initial={reducedMotion ? {} : { x: -20, opacity: 0 }}
            animate={reducedMotion ? {} : { x: 0, opacity: 1 }}
            transition={reducedMotion ? {} : { duration: 0.3, delay: 0.2 }}
          >
            <div className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
              growth >= 0 
                ? 'bg-success-light text-success-dark' 
                : 'bg-error-light text-error-dark'
            )}>
              <span>{growth >= 0 ? '↗' : '↘'}</span>
              <span>{Math.abs(growth)}%</span>
            </div>
            <span className="text-xs text-neutral-600">vs last month</span>
          </motion.div>
        )}

        {/* Subtle animated line */}
        <motion.div 
          className={cn(
            'h-0.5 rounded-full',
            `bg-gradient-to-r ${gradientColors[gradientType]}`
          )}
          initial={reducedMotion ? {} : { width: 0 }}
          animate={reducedMotion ? {} : { width: '100%' }}
          transition={reducedMotion ? {} : { duration: 0.8, delay: 0.3 }}
        />
      </div>
    </FuturisticCard>
  );
};

export default FuturisticStatsCard;
