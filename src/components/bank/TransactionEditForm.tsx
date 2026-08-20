'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BankTransaction } from '@/types';

interface TransactionEditFormProps {
  transaction: BankTransaction;
  onSave: (updates: Partial<Pick<BankTransaction, 'amount' | 'note' | 'date'>>) => void;
  onClose: () => void;
}

export function TransactionEditForm({ transaction, onSave, onClose }: TransactionEditFormProps) {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [note, setNote] = useState(transaction.note);
  const [date, setDate] = useState(transaction.date);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    onSave({ amount: numAmount, note, date });
  };

  const numAmount = parseFloat(amount) || 0;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Amount (₱)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark font-heading text-lg focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark text-base focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. From salary"
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark text-base focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!amount || numAmount <= 0} className="flex-1">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
