'use client';

import { formatCurrency, formatDate } from '@/lib/utils';
import { BankTransaction } from '@/types';
import { Edit2, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface BankTransactionListProps {
  transactions: BankTransaction[];
  onEdit?: (tx: BankTransaction) => void;
  onDelete?: (id: string) => void;
}

export function BankTransactionList({ transactions, onEdit, onDelete }: BankTransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-shade-50">No transactions yet</p>
      </div>
    );
  }

  return (
    <div>
      {transactions.map(tx => {
        const isDeposit = tx.type === 'deposit';
        return (
          <div key={tx.id} className="flex items-center justify-between py-3 border-b border-hairline-light dark:border-hairline-dark last:border-b-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDeposit ? 'bg-primary-subtle' : 'bg-danger-soft'}`}>
                {isDeposit ? (
                  <ArrowDownLeft size={18} className="text-primary" />
                ) : (
                  <ArrowUpRight size={18} className="text-danger" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink dark:text-ink-dark">
                  {isDeposit ? 'Deposit' : 'Withdrawal'}
                  {tx.note && <span className="font-normal text-shade-50"> — {tx.note}</span>}
                </p>
                <p className="text-xs text-shade-40">
                  {formatDate(tx.date)}
                  {isDeposit && tx.source === 'savings' && ' · From Savings'}
                  {isDeposit && tx.source === 'other' && ' · External'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-heading font-semibold tabular-nums ${isDeposit ? 'text-primary' : 'text-danger'}`}>
                {isDeposit ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
              {onEdit && (
                <button onClick={() => onEdit(tx)} className="p-1 rounded-lg hover:bg-shade-20/50 text-shade-40 cursor-pointer">
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(tx.id)} className="p-1 rounded-lg hover:bg-danger-soft text-shade-40 hover:text-danger cursor-pointer">
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
