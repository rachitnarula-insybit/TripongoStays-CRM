import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils';
import { useReducedMotion, createMotionVariants, hapticFeedback } from '@/utils/motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  haptic?: 'light' | 'medium' | 'heavy' | false;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    isDisabled = false,
    leftIcon,
    rightIcon,
    children, 
    haptic = 'light',
    fullWidth = false,
    rounded = 'md',
    onClick,
    ...props 
  }, ref) => {
    const reducedMotion = useReducedMotion();
    const motionVariants = createMotionVariants(reducedMotion);
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled || isLoading) return;
      
      // Haptic feedback
      if (haptic && !reducedMotion) {
        hapticFeedback[haptic]();
      }
      
      onClick?.(event);
    };
    
    // Base styles with Apple-inspired refinements
    const baseStyles = cn(
      // Layout
      'inline-flex items-center justify-center gap-2',
      'relative overflow-hidden',
      'font-medium text-center',
      'transition-all duration-200 ease-apple',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-40',
      // Typography
      'text-sm leading-none tracking-tight',
      // Interaction states
      'select-none touch-manipulation',
      // Full width
      fullWidth && 'w-full',
      // Disabled state
      (isDisabled || isLoading) && 'cursor-not-allowed'
    );
    
    // Variant styles
    const variants = {
      primary: cn(
        'bg-gradient-to-r from-brand-primary-600 to-brand-primary-500',
        'hover:from-brand-primary-700 hover:to-brand-primary-600',
        'text-white shadow-md hover:shadow-lg hover:shadow-brand-primary-500/25',
        'border border-brand-primary-600 hover:border-brand-primary-700',
        'focus-visible:ring-brand-primary-500'
      ),
      secondary: cn(
        'bg-neutral-100 hover:bg-neutral-200',
        'text-neutral-900 shadow-sm hover:shadow-md',
        'border border-neutral-300 hover:border-neutral-400',
        'focus-visible:ring-neutral-500'
      ),
      tertiary: cn(
        'bg-transparent hover:bg-neutral-100',
        'text-neutral-700 hover:text-neutral-900',
        'border border-neutral-300 hover:border-neutral-400',
        'focus-visible:ring-neutral-500'
      ),
      ghost: cn(
        'bg-transparent hover:bg-neutral-100',
        'text-neutral-700 hover:text-neutral-900',
        'border-0',
        'focus-visible:ring-neutral-500'
      ),
      danger: cn(
        'bg-error-default hover:bg-error-dark',
        'text-white shadow-md hover:shadow-lg',
        'border border-error-default hover:border-error-dark',
        'focus-visible:ring-error-light'
      ),
      success: cn(
        'bg-success-default hover:bg-success-dark',
        'text-white shadow-md hover:shadow-lg',
        'border border-success-default hover:border-success-dark',
        'focus-visible:ring-success-light'
      ),
    };

    // Size styles
    const sizes = {
      xs: 'h-7 px-2 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    };
    
    // Border radius styles
    const borderRadius = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          borderRadius[rounded],
          className
        )}
        disabled={isDisabled || isLoading}
        variants={motionVariants.button}
        initial="initial"
        whileHover={!isDisabled && !isLoading ? "hover" : "initial"}
        whileTap={!isDisabled && !isLoading ? "tap" : "initial"}
        whileFocus="focus"
        onClick={handleClick}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </motion.div>
        )}
        
        {/* Content container */}
        <motion.div
          className={cn(
            'flex items-center justify-center gap-2',
            isLoading && 'opacity-0'
          )}
          initial={{ opacity: isLoading ? 0 : 1 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {/* Left icon */}
          {leftIcon && (
            <motion.span
              className="flex-shrink-0"
              initial={{ opacity: 0, x: -4, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: reducedMotion ? 0.1 : 0.2,
                delay: reducedMotion ? 0 : 0.05,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {leftIcon}
            </motion.span>
          )}
          
          {/* Button text */}
          <motion.span
            className="flex-shrink-0"
            initial={{ opacity: 0.8, y: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: reducedMotion ? 0.1 : 0.15,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            {children}
          </motion.span>
          
          {/* Right icon */}
          {rightIcon && (
            <motion.span
              className="flex-shrink-0"
              initial={{ opacity: 0, x: 4, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: reducedMotion ? 0.1 : 0.2,
                delay: reducedMotion ? 0 : 0.05,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {rightIcon}
            </motion.span>
          )}
        </motion.div>
        
        {/* Ripple effect overlay for primary buttons */}
        {variant === 'primary' && !reducedMotion && (
          <motion.div
            className="absolute inset-0 bg-white rounded-[inherit]"
            initial={{ scale: 0, opacity: 0.3 }}
            whileTap={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ originX: 0.5, originY: 0.5 }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;