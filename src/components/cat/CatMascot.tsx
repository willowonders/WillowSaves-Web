'use client';

import { motion } from 'framer-motion';
import { Cat } from 'lucide-react';

interface CatMascotProps {
  savingsRate: number;
  size?: 'sm' | 'md' | 'lg';
}

export function CatMascot({ savingsRate, size = 'md' }: CatMascotProps) {
  const sizes = { sm: 48, md: 64, lg: 80 };
  const iconSizes = { sm: 24, md: 32, lg: 40 };

  const getAnimation = () => {
    if (savingsRate > 50) return { scale: [1, 1.15, 1], y: [0, -6, 0] };
    if (savingsRate > 20) return { y: [0, -4, 0] };
    return { rotate: [-2, 2, -2] };
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{ repeat: Infinity, duration: savingsRate > 50 ? 1.5 : 2.5, ease: 'easeInOut' }}
      style={{ width: sizes[size], height: sizes[size] }}
      className="relative flex-shrink-0"
    >
      <div className="w-full h-full rounded-full bg-primary-subtle flex items-center justify-center">
        <Cat size={iconSizes[size]} className="text-primary" />
      </div>
    </motion.div>
  );
}
