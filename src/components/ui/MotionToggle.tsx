import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ZapOff } from 'lucide-react';
import Button from './Button';
import { motionPrefs, useReducedMotion, hapticFeedback } from '@/utils/motion';
import { cn } from '@/utils';

interface MotionToggleProps {
  className?: string;
  variant?: 'button' | 'switch' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showSystemStatus?: boolean;
}

const MotionToggle: React.FC<MotionToggleProps> = ({ 
  className,
  variant = 'button',
  size = 'md',
  showLabel = true,
  showSystemStatus = true
}) => {
  const systemReducedMotion = useReducedMotion();
  const [userReducedMotion, setUserReducedMotion] = useState(false);

  useEffect(() => {
    setUserReducedMotion(motionPrefs.getPreference());
  }, []);

  const handleToggle = () => {
    const newValue = motionPrefs.togglePreference();
    setUserReducedMotion(newValue);
    
    // Provide haptic feedback
    if (!newValue) { // Motion was enabled
      hapticFeedback.light();
    } else { // Motion was disabled
      hapticFeedback.medium();
    }
  };

  const isMotionEnabled = !systemReducedMotion && !userReducedMotion;

  if (variant === 'switch') {
    return (
      <motion.div
        className={cn('flex items-center gap-3', className)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {showLabel && (
          <motion.span 
            className="text-sm font-medium text-neutral-700"
            animate={{ 
              color: isMotionEnabled ? '#007AFF' : '#8E8E93'
            }}
            transition={{ duration: 0.2 }}
          >
            Motion
          </motion.span>
        )}
        
        <motion.button
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2',
            isMotionEnabled 
              ? 'bg-brand-accent' 
              : 'bg-neutral-300'
          )}
          onClick={handleToggle}
          role="switch"
          aria-checked={isMotionEnabled}
          aria-label={`${isMotionEnabled ? 'Disable' : 'Enable'} animations`}
        >
          <motion.span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200',
              isMotionEnabled ? 'translate-x-6' : 'translate-x-1'
            )}
            animate={{
              x: isMotionEnabled ? 24 : 4,
              scale: isMotionEnabled ? 1.1 : 1
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 1
            }}
          >
            <motion.div
              className="flex items-center justify-center h-full w-full"
              animate={{
                rotate: isMotionEnabled ? 0 : 180
              }}
              transition={{ duration: 0.3 }}
            >
              {isMotionEnabled ? (
                <Zap className="h-2 w-2 text-brand-accent" />
              ) : (
                <ZapOff className="h-2 w-2 text-neutral-600" />
              )}
            </motion.div>
          </motion.span>
        </motion.button>
        
        {systemReducedMotion && showSystemStatus && (
          <motion.p 
            className="text-xs text-neutral-500"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            System prefers reduced motion
          </motion.p>
        )}
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.button
        className={cn(
          'inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium transition-colors duration-200',
          'hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1',
          isMotionEnabled ? 'text-brand-accent' : 'text-neutral-600',
          className
        )}
        onClick={handleToggle}
        title={`${isMotionEnabled ? 'Disable' : 'Enable'} animations`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ rotate: isMotionEnabled ? 0 : 180 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {isMotionEnabled ? (
            <Zap className="h-4 w-4" />
          ) : (
            <ZapOff className="h-4 w-4" />
          )}
        </motion.div>
        {showLabel && (
          <span>
            {isMotionEnabled ? 'On' : 'Off'}
          </span>
        )}
      </motion.button>
    );
  }

  // Default button variant
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Button
        variant={isMotionEnabled ? 'primary' : 'secondary'}
        size={size}
        onClick={handleToggle}
        leftIcon={
          <motion.div
            animate={{ rotate: isMotionEnabled ? 0 : 180 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {isMotionEnabled ? (
              <Zap className="h-4 w-4" />
            ) : (
              <ZapOff className="h-4 w-4" />
            )}
          </motion.div>
        }
        haptic="light"
        className="text-sm font-medium"
        title={`${isMotionEnabled ? 'Disable' : 'Enable'} animations`}
      >
        {showLabel && (
          <>
            Motion {isMotionEnabled ? 'On' : 'Off'}
          </>
        )}
      </Button>
      
      {systemReducedMotion && showSystemStatus && (
        <motion.p 
          className="text-xs text-neutral-500 mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          System prefers reduced motion
        </motion.p>
      )}
    </motion.div>
  );
};

export default MotionToggle;