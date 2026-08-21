'use client';

import { formatCurrency, formatDate, getCategoryById, getCategoryIcon } from '@/lib/utils';
import { Edit2, Trash2 } from 'lucide-react';
import { Expense } from '@/types';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const cat = getCategoryById(expense.category);
  const Icon = getCategoryIcon(cat.icon);

  return (
    <div className="flex items-center justify-between py-3 border-b border-hairline-light dark:border-hairline-dark last:border-0 overflow-hidden">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cat.color }}
        >
          <Icon size={18} style={{ color: cat.iconColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink dark:text-ink-dark truncate">{cat.name}</p>
          {expense.source && expense.source !== 'allowance' && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">From {expense.source === 'gcash' ? 'GCASH' : 'Bank'}</p>
          )}
          {expense.notes && (
            <p className="text-xs text-shade-50 truncate">{expense.notes}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 ml-2 shrink-0 max-w-[45%]">
        <div className="text-right">
          <p className="text-xs sm:text-sm font-heading font-semibold text-danger tabular-nums">
            -{formatCurrency(expense.amount)}
          </p>
          <p className="text-[11px] text-shade-40">{formatDate(expense.date)}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onEdit(expense)}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-shade-20/50 dark:hover:bg-shade-70/50 text-shade-40 hover:text-shade-60 transition-colors cursor-pointer"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-danger-soft text-shade-40 hover:text-danger transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
