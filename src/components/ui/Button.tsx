'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-primary-dark shadow-sm',
      soft: 'bg-primary-subtle text-primary-dark dark:text-primary-light hover:bg-primary/20',
      outline: 'border-2 border-shade-30 dark:border-shade-70 text-ink dark:text-ink-dark hover:bg-shade-20/50 dark:hover:bg-shade-70/50',
      ghost: 'text-shade-60 dark:text-shade-40 hover:bg-shade-20/50 dark:hover:bg-shade-70/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
