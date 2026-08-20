'use client';

import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SavingsCardProps {
  currentSavings: number;
  savingsRate: number;
}

export function SavingsCard({ currentSavings, savingsRate }: SavingsCardProps) {
  return (
    <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 h-full">
      <div className="mb-1">
        <p className="text-xs font-bold uppercase tracking-wider text-shade-50">Savings Goal</p>
        <p className="text-[11px] text-shade-40">Total amount goal</p>
      </div>

      <motion.div
        className="relative rounded-2xl overflow-hidden mt-4 p-5 text-white"
        style={{
          background: 'linear-gradient(135deg, #2E8540 0%, #1F5C2E 50%, #164420 100%)',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="white" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative">
          <p className="text-xs font-semibold opacity-80 mb-1">Savings Account</p>
          <p className="text-2xl font-heading font-bold tabular-nums">{formatCurrency(currentSavings)}</p>
          <div className="flex items-center justify-end mt-4">
            <p className="text-xs opacity-60">{savingsRate.toFixed(1)}% rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
