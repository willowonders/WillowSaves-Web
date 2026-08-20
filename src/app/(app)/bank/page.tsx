'use client';

import { useState } from 'react';
import { useBank, useGcash, useUndo } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { BankTransactionList } from '@/components/bank/BankTransactionList';
import { BankEditModal } from '@/components/bank/BankEditModal';
import { UndoToast } from '@/components/ui/UndoToast';
import { BankTransaction } from '@/types';

export default function BankPage() {
  const bank = useBank();
  const gcash = useGcash();
  const { pendingItem, queueUndo, dismissUndo } = useUndo();
  const [editingTx, setEditingTx] = useState<BankTransaction | null>(null);

  const handleDeleteTransaction = (id: string, account: 'bank' | 'gcash') => {
    const tx = account === 'gcash'
      ? gcash.transactions.find(t => t.id === id)
      : bank.transactions.find(t => t.id === id);
    if (!tx) return;
    queueUndo({ type: 'bank', data: { ...tx, account } });
    if (account === 'gcash') {
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

      {/* Bank Transactions */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-6">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">Bank Transactions</h3>
        <p className="text-[11px] text-shade-400 mb-4">Deposits and withdrawals from your bank account</p>

        <BankTransactionList
          transactions={bank.transactions}
          onEdit={(tx) => setEditingTx({ ...tx, account: 'bank' })}
          onDelete={(id) => handleDeleteTransaction(id, 'bank')}
        />
      </div>

      {/* GCASH Transactions */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">GCASH Transactions</h3>
        <p className="text-[11px] text-shade-400 mb-4">Deposits and withdrawals from your GCASH account</p>

        <BankTransactionList
          transactions={gcash.transactions}
          onEdit={(tx) => setEditingTx({ ...tx, account: 'gcash' })}
          onDelete={(id) => handleDeleteTransaction(id, 'gcash')}
        />
      </div>

      {/* Edit Modal */}
      {editingTx && (
        <BankEditModal transaction={editingTx} onClose={() => setEditingTx(null)} />
      )}

      <UndoToast pendingItem={pendingItem} onUndo={handleUndo} onDismiss={dismissUndo} />
    </div>
  );
}
