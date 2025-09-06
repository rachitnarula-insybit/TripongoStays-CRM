import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { useReducedMotion } from '@/utils/motion';

interface FuturisticGradientProps {
  variant?: 'neon' | 'electric' | 'cyber' | 'plasma' | 'aurora';
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const FuturisticGradient: React.FC<FuturisticGradientProps> = ({
  variant = 'neon',
  intensity = 'medium',
  animated = true,
  className,
  children
}) => {
  const reducedMotion = useReducedMotion();

  const gradientVariants = {
    neon: {
      subtle: 'bg-gradient-to-br from-futuristic-neon/10 via-transparent to-futuristic-plasma/5',
      medium: 'bg-gradient-to-br from-futuristic-neon/20 via-brand-primary-100 to-futuristic-plasma/10',
      strong: 'bg-gradient-to-br from-futuristic-neon/30 via-brand-primary-200 to-futuristic-plasma/20'
    },
    electric: {
      subtle: 'bg-gradient-to-br from-futuristic-electric/10 via-transparent to-brand-accent/5',
      medium: 'bg-gradient-to-br from-futuristic-electric/20 via-brand-primary-100 to-brand-accent/10',
      strong: 'bg-gradient-to-br from-futuristic-electric/30 via-brand-primary-200 to-brand-accent/20'
    },
    cyber: {
      subtle: 'bg-gradient-to-br from-futuristic-cyber/10 via-transparent to-futuristic-electric/5',
      medium: 'bg-gradient-to-br from-futuristic-cyber/20 via-brand-primary-100 to-futuristic-electric/10',
      strong: 'bg-gradient-to-br from-futuristic-cyber/30 via-brand-primary-200 to-futuristic-electric/20'
    },
    plasma: {
      subtle: 'bg-gradient-to-br from-futuristic-plasma/10 via-transparent to-brand-primary-300/5',
      medium: 'bg-gradient-to-br from-futuristic-plasma/20 via-brand-primary-100 to-brand-primary-300/10',
      strong: 'bg-gradient-to-br from-futuristic-plasma/30 via-brand-primary-200 to-brand-primary-300/20'
    },
    aurora: {
      subtle: 'bg-gradient-to-br from-futuristic-neon/8 via-futuristic-cyber/5 to-futuristic-plasma/8',
      medium: 'bg-gradient-to-br from-futuristic-neon/15 via-futuristic-cyber/10 to-futuristic-plasma/15',
      strong: 'bg-gradient-to-br from-futuristic-neon/25 via-futuristic-cyber/18 to-futuristic-plasma/25'
    }
  };

  const animationVariants = {
    subtle: {
      initial: { opacity: 0.8 },
      animate: { 
        opacity: [0.8, 1, 0.8],
        scale: [1, 1.02, 1]
      },
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    medium: {
      initial: { opacity: 0.9 },
      animate: { 
        opacity: [0.9, 1, 0.9],
        scale: [1, 1.01, 1],
        rotate: [0, 1, 0]
      },
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    strong: {
      initial: { opacity: 1 },
      animate: { 
        opacity: [1, 0.9, 1],
        scale: [1, 1.03, 1],
        rotate: [0, 2, 0]
      },
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const Component = animated && !reducedMotion ? motion.div : 'div';
  const motionProps = animated && !reducedMotion ? {
    initial: animationVariants[intensity].initial,
    animate: animationVariants[intensity].animate,
    transition: animationVariants[intensity].transition
  } : {};

  return (
    <Component
      className={cn(
        'relative overflow-hidden',
        gradientVariants[variant][intensity],
        className
      )}
      {...motionProps}
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
      
      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </Component>
  );
};

export default FuturisticGradient;
