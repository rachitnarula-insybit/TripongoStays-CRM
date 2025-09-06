import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { useReducedMotion } from '@/utils/motion';
import FuturisticGradient from './FuturisticGradient';

interface FuturisticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'gradient';
  gradientType?: 'neon' | 'electric' | 'cyber' | 'plasma' | 'aurora';
  intensity?: 'subtle' | 'medium' | 'strong';
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const FuturisticCard: React.FC<FuturisticCardProps> = ({
  variant = 'glass',
  gradientType = 'neon',
  intensity = 'subtle',
  hover = true,
  glow = false,
  className,
  children,
  ...props
}) => {
  const reducedMotion = useReducedMotion();

  const baseStyles = cn(
    'relative overflow-hidden rounded-xl border transition-all duration-300',
    'backdrop-blur-sm'
  );

  const variantStyles = {
    glass: cn(
      'bg-white/10 border-white/20',
      'shadow-lg shadow-brand-primary-500/10'
    ),
    solid: cn(
      'bg-white border-neutral-200',
      'shadow-md'
    ),
    gradient: cn(
      'border-brand-primary-200/50',
      'shadow-lg shadow-brand-primary-500/20'
    )
  };

  const hoverStyles = hover ? cn(
    'hover:shadow-xl hover:shadow-brand-primary-500/20',
    'hover:border-brand-primary-300/50',
    'hover:-translate-y-1'
  ) : '';

  const glowStyles = glow ? cn(
    'before:absolute before:inset-0 before:-z-10',
    'before:bg-gradient-to-br before:from-brand-primary-500/20 before:to-futuristic-neon/20',
    'before:blur-xl before:opacity-0 hover:before:opacity-100',
    'before:transition-opacity before:duration-300'
  ) : '';

  const Component = hover && !reducedMotion ? motion.div : 'div';
  const motionProps = hover && !reducedMotion ? {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  } : {};

  if (variant === 'gradient') {
    return (
      <Component
        className={cn(
          baseStyles,
          variantStyles[variant],
          hoverStyles,
          glowStyles,
          className
        )}
        {...motionProps}
        {...props}
      >
        <FuturisticGradient
          variant={gradientType}
          intensity={intensity}
          animated={!reducedMotion}
          className="absolute inset-0"
        />
        <div className="relative z-10 p-6">
          {children}
        </div>
      </Component>
    );
  }

  return (
    <Component
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        glowStyles,
        'p-6',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default FuturisticCard;
