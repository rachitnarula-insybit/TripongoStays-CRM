import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/utils';
import { DashboardStats } from '@/types';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';
import { cn } from '@/utils';

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const reducedMotion = useReducedMotion();
  const motionVariants = createMotionVariants(reducedMotion);
  
  const statsData = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      format: formatNumber,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      iconColor: 'bg-blue-600',
    },
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      format: formatNumber,
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
      iconColor: 'bg-blue-700',
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      format: formatNumber,
      color: 'text-blue-900',
      bgColor: 'bg-blue-200',
      iconColor: 'bg-blue-800',
    },
    {
      title: 'Revenue',
      value: stats.revenue,
      format: formatCurrency,
      color: 'text-blue-800',
      bgColor: 'bg-blue-150',
      iconColor: 'bg-blue-700',
    },
  ];

  if (isLoading) {
    return (
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={motionVariants.cardContainer}
        initial="hidden"
        animate="visible"
      >
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            variants={motionVariants.card}
            style={reducedMotion ? {} : { willChange: 'transform, opacity' }}
          >
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      variants={motionVariants.cardContainer}
      initial="hidden"
      animate="visible"
    >
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          variants={motionVariants.card}
          whileHover="hover"
          style={reducedMotion ? {} : { willChange: 'transform, opacity' }}
          onAnimationComplete={() => {
            // Remove will-change after animation for performance
            if (!reducedMotion) {
              const element = document.querySelector(`[data-card-index="${index}"]`);
              if (element instanceof HTMLElement) {
                element.style.willChange = 'auto';
              }
            }
          }}
        >
          <Card 
            className={cn(
              "hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden",
              "border-l-2 border-l-transparent hover:border-l-brand-accent/30"
            )}
            data-card-index={index}
          >
            {/* AI Prediction Indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 px-2 py-1 bg-brand-accent/5 rounded-full">
                <Brain className="h-3 w-3 text-brand-accent" />
                <div className="w-1 h-1 bg-brand-accent rounded-full animate-pulse" />
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <motion.p 
                    className="text-sm font-bold text-neutral-900 uppercase tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      duration: reducedMotion ? 0.1 : 0.3,
                      delay: reducedMotion ? 0 : index * 0.1 + 0.2
                    }}
                  >
                    {stat.title}
                  </motion.p>
                  
                  <motion.p 
                    className={`text-3xl font-black ${stat.color} mt-2 leading-tight`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: reducedMotion ? 0.1 : 0.4,
                      delay: reducedMotion ? 0 : index * 0.1 + 0.3,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    {stat.format(stat.value)}
                  </motion.p>
                  
                </div>
                
                <motion.div 
                  className={`p-4 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: reducedMotion ? 0.1 : 0.5,
                    delay: reducedMotion ? 0 : index * 0.1 + 0.6,
                    type: reducedMotion ? "tween" : "spring",
                    stiffness: 150
                  }}
                >
                  <div className={`h-8 w-8 rounded-lg ${stat.iconColor}`}></div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;