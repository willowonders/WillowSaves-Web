'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'hero' | 'analytics' | 'highlight' | 'empty';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, variant = 'default', className, style, onClick }: CardProps) {
  const base = 'rounded-2xl transition-all duration-200';

  const variants = {
    default: 'bg-white dark:bg-canvas-dark-elevated shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
    hero: 'bg-white dark:bg-canvas-dark-elevated shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-2 border-primary',
    analytics: 'bg-white dark:bg-canvas-dark-elevated shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
    highlight: 'bg-sage-green dark:bg-sage-green-dark shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-2 border-primary',
    empty: 'bg-white dark:bg-canvas-dark-elevated shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-2 border-dashed border-shade-30 dark:border-shade-70',
  };

  return (
    <motion.div
      className={cn(base, variants[variant], className)}
      style={style}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      <div className="p-3 sm:p-5">{children}</div>
    </motion.div>
  );
}
