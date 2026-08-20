'use client';

import { Allowance } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit2, Trash2, Banknote } from 'lucide-react';
import { getRandomMessage } from '@/lib/utils';

interface AllowanceListProps {
  allowances: Allowance[];
  onEdit?: (allowance: Allowance) => void;
  onDelete?: (id: string) => void;
}

export function AllowanceList({ allowances, onEdit, onDelete }: AllowanceListProps) {
  if (allowances.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary-subtle flex items-center justify-center">
          <Banknote size={28} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-shade-50">{getRandomMessage()}</p>
        <p className="text-xs text-shade-400 mt-1">No allowances yet. Tap + to add one!</p>
      </div>
    );
  }

  return (
    <div>
      {allowances.map(a => {
        const isNegative = a.amount < 0;
        return (
          <div key={a.id} className="flex items-center justify-between py-3 border-b border-hairline-light dark:border-hairline-dark last:border-b-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-ink-dark truncate">{a.label}</p>
              <p className="text-xs text-shade-40">{formatDate(a.date)}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-heading font-semibold tabular-nums ${isNegative ? 'text-danger' : 'text-primary'}`}>
                {isNegative ? '-' : ''}{formatCurrency(Math.abs(a.amount))}
              </p>
              {onEdit && (
                <button onClick={() => onEdit(a)} className="p-1 rounded-lg hover:bg-shade-20/50 text-shade-40 cursor-pointer">
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(a.id)} className="p-1 rounded-lg hover:bg-danger-soft text-shade-40 hover:text-danger cursor-pointer">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
