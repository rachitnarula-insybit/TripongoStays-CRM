'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { BarChart3, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/utils';
import { useReducedMotion, hapticFeedback } from '@/utils/motion';
import Button from '@/components/ui/Button';

interface AnalyticsLauncherProps {
  className?: string;
  variant?: 'button' | 'fab' | 'minimal';
  showLabel?: boolean;
}

const AnalyticsLauncher: React.FC<AnalyticsLauncherProps> = ({ 
  className,
  variant = 'button',
  showLabel = true 
}) => {
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  const handleOpenAnalytics = () => {
    hapticFeedback.medium();
    router.push('/analytics');
  };

  if (variant === 'fab') {
    return (
      <>
        {/* Floating Action Button */}
        <motion.div
          className={cn(
            'fixed bottom-6 right-6 z-30',
            className
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.button
            onClick={handleOpenAnalytics}
            className={cn(
              'w-14 h-14 rounded-full shadow-2xl',
              'bg-gradient-to-r from-purple-500 to-pink-500',
              'text-white flex items-center justify-center',
              'hover:shadow-purple-500/25 hover:scale-110',
              'transition-all duration-300',
              'relative overflow-hidden group'
            )}
            whileHover={reducedMotion ? {} : { scale: 1.1 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
            title="Open Analytics Hub"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            
            {/* Icon */}
            <motion.div
              className="relative z-10"
              whileHover={reducedMotion ? {} : { rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <BarChart3 className="w-6 h-6" />
            </motion.div>
            
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>
      </>
    );
  }

  if (variant === 'minimal') {
    return (
      <>
        <motion.button
          onClick={handleOpenAnalytics}
          className={cn(
            'p-2 rounded-xl transition-all duration-200',
            'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10',
            'border border-transparent hover:border-purple-500/20',
            className
          )}
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
          whileTap={reducedMotion ? {} : { scale: 0.95 }}
          title="Open Analytics"
        >
          <motion.div
            whileHover={reducedMotion ? {} : { rotate: [0, 360] }}
            transition={{ duration: 0.6 }}
          >
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </motion.div>
        </motion.button>
      </>
    );
  }

  // Default button variant
  return (
    <>
      <motion.div
        whileHover={reducedMotion ? {} : { scale: 1.02 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
        className={className}
      >
        <Button
          onClick={handleOpenAnalytics}
          className={cn(
            'w-full justify-start gap-3 px-4 py-3 rounded-xl',
            'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
            'border border-purple-500/20',
            'hover:from-purple-500/20 hover:to-pink-500/20',
            'hover:border-purple-500/30',
            'text-neutral-700 hover:text-neutral-900',
            'transition-all duration-200 group relative overflow-hidden'
          )}
          haptic="medium"
        >
          {/* Background animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Icon with special effects */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            whileHover={reducedMotion ? {} : { 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.8 }}
          >
            <BarChart3 className="w-4 h-4" />
          </motion.div>
          
          <AnimatePresence>
            {showLabel && (
              <motion.div
                className="flex-1 relative z-10"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Analytics Hub</div>
                    <div className="text-xs text-purple-600/80 flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      AI-powered insights
                    </div>
                  </div>
                  
                  {/* Live indicator */}
                  <motion.div
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 border border-green-200"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-green-500"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-xs font-medium text-green-700">Live</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Sparkle effects */}
          <motion.div
            className="absolute top-1 right-1 w-2 h-2"
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: 1,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-2 h-2 text-purple-400" />
          </motion.div>
        </Button>
      </motion.div>
    </>
  );
};

export default AnalyticsLauncher;
