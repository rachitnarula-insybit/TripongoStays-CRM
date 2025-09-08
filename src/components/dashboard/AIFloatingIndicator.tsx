import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/utils';

interface AIFloatingIndicatorProps {
  className?: string;
}

const AIFloatingIndicator: React.FC<AIFloatingIndicatorProps> = ({ className }) => {
  const [status, setStatus] = useState<'analyzing' | 'insights' | 'ready' | 'alert'>('analyzing');

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: Array<'analyzing' | 'insights' | 'ready' | 'alert'> = ['analyzing', 'insights', 'ready', 'alert'];
      const currentIndex = statuses.indexOf(status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      setStatus(statuses[nextIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, [status]);

  const getStatusConfig = (currentStatus: typeof status) => {
    switch (currentStatus) {
      case 'analyzing':
        return {
          icon: Brain,
          text: 'AI Analyzing...',
          color: 'text-brand-accent',
          bg: 'bg-brand-accent/10',
          border: 'border-brand-accent/20',
          pulse: true
        };
      case 'insights':
        return {
          icon: Zap,
          text: 'Generating Insights',
          color: 'text-warning-default',
          bg: 'bg-warning-light',
          border: 'border-warning-light',
          pulse: true
        };
      case 'ready':
        return {
          icon: CheckCircle,
          text: 'AI Ready',
          color: 'text-success-default',
          bg: 'bg-success-light',
          border: 'border-success-light',
          pulse: false
        };
      case 'alert':
        return {
          icon: AlertCircle,
          text: 'New Insights',
          color: 'text-error-default',
          bg: 'bg-error-light',
          border: 'border-error-light',
          pulse: true
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <motion.div
      className={cn(
        'fixed bottom-6 right-6 z-50 pointer-events-none',
        className
      )}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-full border backdrop-blur-md shadow-lg',
          config.bg,
          config.border,
          'transition-all duration-300'
        )}
        animate={config.pulse ? {
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9]
        } : {}}
        transition={config.pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        } : {}}
      >
        {/* Animated Background Glow */}
        <AnimatePresence>
          {config.pulse && (
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full opacity-20',
                config.bg
              )}
              initial={{ scale: 1, opacity: 0.2 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {/* Status Icon */}
        <motion.div
          key={status}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <IconComponent className={cn('h-4 w-4', config.color)} />
        </motion.div>

        {/* Status Text */}
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            className={cn('text-sm font-medium', config.color)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {config.text}
          </motion.span>
        </AnimatePresence>

        {/* Neural Network Animation */}
        <div className="relative w-6 h-6">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn('absolute w-1 h-1 rounded-full', config.color.replace('text-', 'bg-'))}
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `rotate(${i * 120}deg) translateX(8px) translateY(-2px)`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Connection Lines */}
      <motion.div
        className="absolute -top-2 -left-2 w-2 h-2 opacity-30"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
      >
        <div className={cn('w-full h-full rounded-full', config.color.replace('text-', 'bg-'))} />
      </motion.div>
      
      <motion.div
        className="absolute -bottom-1 -right-1 w-1.5 h-1.5 opacity-40"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1
        }}
      >
        <div className={cn('w-full h-full rounded-full', config.color.replace('text-', 'bg-'))} />
      </motion.div>
    </motion.div>
  );
};

export default AIFloatingIndicator;
