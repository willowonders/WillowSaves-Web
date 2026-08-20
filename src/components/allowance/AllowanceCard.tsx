'use client';

import { Allowance } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit2, Trash2, Banknote } from 'lucide-react';

interface AllowanceCardProps {
  allowance: Allowance;
  onEdit?: (allowance: Allowance) => void;
  onDelete?: (id: string) => void;
}

export function AllowanceCard({ allowance, onEdit, onDelete }: AllowanceCardProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-hairline-light dark:border-hairline-dark last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary-subtle flex items-center justify-center flex-shrink-0">
          <Banknote size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink dark:text-ink-dark truncate">{allowance.label}</p>
          <p className="text-xs text-shade-40">{formatDate(allowance.date)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-heading font-semibold text-primary tabular-nums">
          +{formatCurrency(allowance.amount)}
        </p>
        {onEdit && (
          <button onClick={() => onEdit(allowance)} className="p-1 rounded-lg hover:bg-shade-20/50 text-shade-40 cursor-pointer">
            <Edit2 size={14} />
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(allowance.id)} className="p-1 rounded-lg hover:bg-danger-soft text-shade-40 hover:text-danger cursor-pointer">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
