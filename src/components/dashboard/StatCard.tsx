'use client';

import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Wallet, CreditCard, TrendingUp, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title?: string;
  label?: string;
  value: number | string;
  icon?: string;
  type?: 'neutral' | 'expense' | 'savings';
  featured?: boolean;
}

export function StatCard({ title, label, value, icon, type = 'neutral', featured }: StatCardProps) {
  const displayLabel = title || label || '';
  const displayValue = typeof value === 'number' ? formatCurrency(value) : value;

  const iconMap: Record<string, React.ReactNode> = {
    wallet: <Wallet size={18} />,
    card: <CreditCard size={18} />,
    trending: <TrendingUp size={18} />,
  };

  const typeIcon = {
    neutral: <Wallet size={18} />,
    expense: <CreditCard size={18} />,
    savings: <PiggyBank size={18} />,
  };

  const typeColors = {
    neutral: 'bg-shade-20/60 dark:bg-shade-70/60 text-shade-60 dark:text-shade-40',
    expense: 'bg-danger-soft text-danger',
    savings: 'bg-primary-subtle text-primary',
  };

  return (
    <Card
      variant={featured ? 'highlight' : 'default'}
      className={cn(featured && 'border-primary')}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-shade-50 dark:text-shade-40 mb-1">
            {displayLabel}
          </p>
          <p className="text-xl font-heading font-light text-ink dark:text-ink-dark tabular-nums">
            {displayValue}
          </p>
        </div>
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center',
          typeColors[type]
        )}>
          {icon ? iconMap[icon] : typeIcon[type]}
        </div>
      </div>
    </Card>
  );
}
