import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils';
import { useReducedMotion, createMotionVariants, sharedElementTransitions } from '@/utils/motion';

interface CardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'minimal';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  layoutId?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    children, 
    variant = 'default',
    padding = 'md',
    rounded = 'lg',
    shadow = 'sm',
    hover = false,
    interactive = false,
    layoutId,
    ...props 
  }, ref) => {
    const reducedMotion = useReducedMotion();
    const motionVariants = createMotionVariants(reducedMotion);
    
    // Base styles with Apple-inspired refinements
    const baseStyles = cn(
      'relative overflow-hidden',
      'transition-all duration-200 ease-apple',
      interactive && [
        'cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2'
      ]
    );
    
    // Variant styles
    const variants = {
      default: cn(
        'bg-neutral-white',
        'border border-neutral-300'
      ),
      glass: cn(
        'glass-light',
        'border border-white/20',
        'shadow-glass'
      ),
      elevated: cn(
        'bg-neutral-white',
        'border-0'
      ),
      outlined: cn(
        'bg-transparent',
        'border border-neutral-300'
      ),
      minimal: cn(
        'bg-neutral-50',
        'border-0'
      ),
    };
    
    // Padding styles
    const paddings = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };
    
    // Border radius styles
    const borderRadius = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    };
    
    // Shadow styles
    const shadows = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };

    const MotionCard = motion.div;

    return (
      <MotionCard
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          borderRadius[rounded],
          shadows[shadow],
          hover && 'hover:shadow-lg hover:-translate-y-1',
          className
        )}
        variants={motionVariants.card}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={hover || interactive ? "hover" : undefined}
        layoutId={layoutId ? sharedElementTransitions.layoutId(layoutId) : undefined}
        transition={layoutId ? sharedElementTransitions.transition : undefined}
        {...props}
      >
        {children}
      </MotionCard>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, padding = 'none', ...props }, ref) => {
    const paddings = {
      none: 'pb-0',
      sm: 'pb-2',
      md: 'pb-4',
      lg: 'pb-6',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'flex flex-col space-y-2',
          paddings[padding],
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.2, 
          delay: 0.05,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, level = 3, size = 'md', ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    
    const sizes = {
      sm: 'text-sm font-medium',
      md: 'text-base font-semibold',
      lg: 'text-lg font-semibold',
      xl: 'text-xl font-bold',
    };

    return (
      <Component
        ref={ref as any}
        className={cn(
          'text-neutral-900 leading-tight tracking-tight',
          'text-balance',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, size = 'sm', ...props }, ref) => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
    };

    return (
      <motion.p
        ref={ref}
        className={cn(
          'text-neutral-600 leading-relaxed',
          'text-pretty',
          sizes[size],
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.2, 
          delay: 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        {...props}
      >
        {children}
      </motion.p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, padding = 'none', ...props }, ref) => {
    const paddings = {
      none: 'pt-0',
      sm: 'pt-2',
      md: 'pt-4',
      lg: 'pt-6',
    };

    return (
      <motion.div 
        ref={ref} 
        className={cn(paddings[padding], className)} 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.2, 
          delay: 0.15,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  justify?: 'start' | 'center' | 'end' | 'between';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, padding = 'md', justify = 'start', ...props }, ref) => {
    const paddings = {
      none: 'pt-0',
      sm: 'pt-2',
      md: 'pt-4',
      lg: 'pt-6',
    };
    
    const justifications = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'flex items-center gap-2',
          paddings[padding],
          justifications[justify],
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.2, 
          delay: 0.2,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };