'use client';

import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface BankBalanceCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function BankBalanceCard({ balance, onDeposit, onWithdraw }: BankBalanceCardProps) {
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    v: balance * (0.85 + Math.random() * 0.3),
  }));

  return (
    <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 h-full">
      <div className="mb-1">
        <p className="text-xs font-bold uppercase tracking-wider text-shade-50">Bank Balance</p>
        <p className="text-[11px] text-shade-40">Total amount goal</p>
      </div>

      <div className="mt-3 mb-2">
        <p className="text-xs text-shade-40 mb-0.5">Total Balance</p>
        <p className="text-3xl font-heading font-bold text-ink dark:text-ink-dark tabular-nums">
          {formatCurrency(balance)}
        </p>
      </div>

      <div className="h-16 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E8540" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2E8540" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#2E8540" fill="url(#balanceGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-2">
        <motion.button
          onClick={onDeposit}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send <ArrowUpRight size={14} />
        </motion.button>
        <motion.button
          onClick={onWithdraw}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border-2 border-hairline-light dark:border-hairline-dark text-shade-60 dark:text-shade-40 rounded-xl text-sm font-semibold cursor-pointer hover:bg-shade-20/50 dark:hover:bg-shade-70/50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Receive <ArrowDownRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}
