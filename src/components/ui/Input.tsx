import React, { useState, useRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils';
import { useReducedMotion, createMotionVariants } from '@/utils/motion';

interface InputProps extends Omit<HTMLMotionProps<"input">, 'size'> {
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'minimal';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    placeholder,
    error,
    hint,
    size = 'md',
    variant = 'default',
    leftIcon,
    rightIcon,
    isRequired = false,
    isDisabled = false,
    isLoading = false,
    fullWidth = true,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const reducedMotion = useReducedMotion();
    const motionVariants = createMotionVariants(reducedMotion);
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    // Base container styles
    const containerStyles = cn(
      'relative',
      fullWidth && 'w-full'
    );

    // Label styles
    const labelStyles = cn(
      'block text-sm font-medium text-neutral-700 mb-2',
      'transition-colors duration-200',
      isFocused && 'text-brand-accent',
      error && 'text-error-default',
      isDisabled && 'text-neutral-400'
    );

    // Input wrapper styles
    const wrapperStyles = cn(
      'relative flex items-center',
      'transition-all duration-200 ease-apple',
      'border rounded-md',
      // Focus states
      isFocused && !error && [
        'border-brand-accent',
        'ring-2 ring-brand-accent/20'
      ],
      // Error states
      error && [
        'border-error-default',
        'ring-2 ring-error-default/20'
      ],
      // Default states
      !isFocused && !error && 'border-neutral-300',
      // Hover states
      !isDisabled && 'hover:border-neutral-400',
      // Disabled states
      isDisabled && [
        'bg-neutral-100',
        'border-neutral-200',
        'cursor-not-allowed'
      ]
    );

    // Input styles
    const inputStyles = cn(
      'flex-1 bg-transparent',
      'text-neutral-900 placeholder:text-neutral-500',
      'focus:outline-none',
      'transition-all duration-200',
      'disabled:cursor-not-allowed disabled:text-neutral-400',
      // Variant-specific styles
      {
        default: 'bg-white',
        filled: 'bg-neutral-50 focus:bg-white',
        minimal: 'bg-transparent border-0 focus:ring-0',
      }[variant]
    );

    // Size styles
    const sizes = {
      sm: {
        wrapper: 'h-8 px-2',
        input: 'text-sm py-1',
        icon: 'h-4 w-4',
      },
      md: {
        wrapper: 'h-10 px-3',
        input: 'text-sm py-2',
        icon: 'h-4 w-4',
      },
      lg: {
        wrapper: 'h-12 px-4',
        input: 'text-base py-3',
        icon: 'h-5 w-5',
      },
    };

    const sizeConfig = sizes[size];

    return (
      <motion.div
        className={containerStyles}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reducedMotion ? 0.1 : 0.2,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {/* Label */}
        {label && (
          <motion.label
            className={labelStyles}
            htmlFor={props.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reducedMotion ? 0.1 : 0.15,
              delay: reducedMotion ? 0 : 0.05
            }}
          >
            {label}
            {isRequired && (
              <span className="text-error-default ml-1" aria-label="required">
                *
              </span>
            )}
          </motion.label>
        )}

        {/* Input wrapper */}
        <motion.div
          className={cn(wrapperStyles, sizeConfig.wrapper)}
          animate={{
            scale: isFocused && !reducedMotion ? 1.01 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {/* Left icon */}
          {leftIcon && (
            <motion.div
              className={cn('flex-shrink-0 text-neutral-400 mr-2', sizeConfig.icon)}
              animate={{
                color: isFocused ? '#007AFF' : error ? '#EF4444' : '#9CA3AF',
                scale: isFocused && !reducedMotion ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {leftIcon}
            </motion.div>
          )}

          {/* Input */}
          <motion.input
            ref={combinedRef}
            className={cn(inputStyles, sizeConfig.input, className)}
            placeholder={placeholder}
            disabled={isDisabled || isLoading}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={!!error}
            aria-describedby={
              cn(
                error && `${props.id}-error`,
                hint && `${props.id}-hint`
              ) || undefined
            }
            {...props}
          />

          {/* Loading spinner */}
          {isLoading && (
            <motion.div
              className="flex-shrink-0 ml-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className={cn('animate-spin rounded-full border-2 border-brand-accent border-t-transparent', sizeConfig.icon)} />
            </motion.div>
          )}

          {/* Right icon */}
          {rightIcon && !isLoading && (
            <motion.div
              className={cn('flex-shrink-0 text-neutral-400 ml-2', sizeConfig.icon)}
              animate={{
                color: isFocused ? '#007AFF' : error ? '#EF4444' : '#9CA3AF',
                scale: isFocused && !reducedMotion ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {rightIcon}
            </motion.div>
          )}
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-error-default"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{
              duration: reducedMotion ? 0.1 : 0.2,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            role="alert"
            aria-live="polite"
          >
            {error}
          </motion.p>
        )}

        {/* Hint message */}
        {hint && !error && (
          <motion.p
            id={`${props.id}-hint`}
            className="mt-1 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reducedMotion ? 0.1 : 0.15,
              delay: reducedMotion ? 0 : 0.1
            }}
          >
            {hint}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;