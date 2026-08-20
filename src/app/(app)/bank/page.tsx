'use client';

import { useMemo } from 'react';
import { useBank, useGcash, useUndo } from '@/lib/store';
import { formatCurrency, cn } from '@/lib/utils';
import { BankTransactionList } from '@/components/bank/BankTransactionList';
import { UndoToast } from '@/components/ui/UndoToast';
import { BankTransaction } from '@/types';

export default function BankPage() {
  const bank = useBank();
  const gcash = useGcash();
  const { pendingItem, queueUndo, dismissUndo } = useUndo();

  const allTransactions = useMemo(() =>
    [...bank.transactions.map(t => ({ ...t, account: t.account || 'bank' as const })),
     ...gcash.transactions.map(t => ({ ...t, account: 'gcash' as const }))]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [bank.transactions, gcash.transactions]
  );

  const handleDeleteTransaction = (id: string) => {
    const tx = allTransactions.find(t => t.id === id);
    if (!tx) return;
    queueUndo({ type: 'bank', data: tx });
    if (tx.account === 'gcash') {
      gcash.deleteTransaction(id);
    } else {
      bank.deleteTransaction(id);
    }
  };

  const handleUndo = () => {
    if (!pendingItem || pendingItem.type !== 'bank') return;
    const tx = pendingItem.data as BankTransaction;
    if (tx.type === 'deposit') {
      if (tx.account === 'gcash') {
        gcash.deposit(tx.amount, tx.source || 'other', tx.note);
      } else {
        bank.deposit(tx.amount, tx.source || 'other', tx.note);
      }
    } else {
      if (tx.account === 'gcash') {
        gcash.withdraw(tx.amount, tx.note);
      } else {
        bank.withdraw(tx.amount, tx.note);
      }
    }
    dismissUndo();
  };

  return (
    <div className="min-h-screen">
      {/* Hero - Both balances */}
      <div className="bg-gradient-to-br from-[#F2F3F5] via-[#E8F5E0] to-[#F2F3F5] dark:from-canvas-dark dark:via-canvas-dark-elevated dark:to-canvas-dark rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-shade-50 mb-3">Bank Account</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-shade-40 mb-1">Bank</p>
            <p className="text-4xl font-heading font-light text-ink dark:text-ink-dark tabular-nums">{formatCurrency(bank.balance)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-shade-40 mb-1">GCASH</p>
            <p className="text-4xl font-heading font-light text-ink dark:text-ink-dark tabular-nums">{formatCurrency(gcash.balance)}</p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">All Transactions</h3>
        <p className="text-[11px] text-shade-400 mb-4">Bank and GCASH transactions</p>

        <BankTransactionList
          transactions={allTransactions}
          onDelete={handleDeleteTransaction}
        />

        {allTransactions.length === 0 && (
          <div className="py-8 text-center text-sm text-shade-40">
            No transactions yet. Use the + button to deposit or withdraw!
          </div>
        )}
      </div>

      <UndoToast pendingItem={pendingItem} onUndo={handleUndo} onDismiss={dismissUndo} />
    </div>
  );
}
