import React from 'react';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-neutral-gray">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              'w-full rounded-lg border border-neutral-border-gray px-3 py-2 text-sm placeholder:text-neutral-gray/60 focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-secondary-red focus:border-secondary-red focus:ring-secondary-red/20',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-secondary-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;