'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface WithdrawFormProps {
  onWithdraw: (amount: number, note: string, account: 'bank' | 'gcash') => void;
  onClose: () => void;
  bankBalance: number;
  gcashBalance: number;
}

export function WithdrawForm({ onWithdraw, onClose, bankBalance, gcashBalance }: WithdrawFormProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [account, setAccount] = useState<'bank' | 'gcash'>('bank');

  const balance = account === 'bank' ? bankBalance : gcashBalance;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > balance) return;
    onWithdraw(numAmount, note, account);
  };

  const numAmount = parseFloat(amount) || 0;
  const insufficient = numAmount > balance;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Account</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAccount('bank')}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
              account === 'bank'
                ? 'border-primary bg-primary-subtle'
                : 'border-hairline-light dark:border-hairline-dark hover:border-shade-30'
            }`}
          >
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">Bank</p>
            <p className="text-xs text-shade-50">{formatCurrency(bankBalance)}</p>
          </button>
          <button
            onClick={() => setAccount('gcash')}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
              account === 'gcash'
                ? 'border-primary bg-primary-subtle'
                : 'border-hairline-light dark:border-hairline-dark hover:border-shade-30'
            }`}
          >
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">GCASH</p>
            <p className="text-xs text-shade-50">{formatCurrency(gcashBalance)}</p>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Amount (₱)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark font-heading text-lg focus:outline-none focus:border-primary transition-colors"
        />
        <p className="text-xs text-shade-50 mt-1">Available: {formatCurrency(balance)}</p>
        {insufficient && (
          <p className="text-xs text-danger mt-1 font-medium">Insufficient balance</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. ATM withdrawal"
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!amount || numAmount <= 0 || insufficient}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}
