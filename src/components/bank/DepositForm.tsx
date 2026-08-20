'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useSavings } from '@/lib/store';

interface DepositFormProps {
  onDeposit: (amount: number, source: 'savings' | 'other', note: string, account: 'bank' | 'gcash') => void;
  onClose: () => void;
}

export function DepositForm({ onDeposit, onClose }: DepositFormProps) {
  const { savings } = useSavings();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<'savings' | 'other'>('savings');
  const [account, setAccount] = useState<'bank' | 'gcash'>('bank');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (source === 'savings' && numAmount > savings) return;
    onDeposit(numAmount, source, note, account);
  };

  const numAmount = parseFloat(amount) || 0;
  const insufficient = source === 'savings' && numAmount > savings;

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
        {insufficient && (
          <p className="text-xs text-danger mt-1 font-medium">Insufficient savings. Available: {formatCurrency(savings)}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Source</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSource('savings')}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
              source === 'savings'
                ? 'border-primary bg-primary-subtle'
                : 'border-hairline-light dark:border-hairline-dark hover:border-shade-30'
            }`}
          >
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">From Savings</p>
            <p className="text-xs text-shade-50">Available: {formatCurrency(savings)}</p>
          </button>
          <button
            onClick={() => setSource('other')}
            className={`px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
              source === 'other'
                ? 'border-primary bg-primary-subtle'
                : 'border-hairline-light dark:border-hairline-dark hover:border-shade-30'
            }`}
          >
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">Other Source</p>
            <p className="text-xs text-shade-50">External deposit</p>
          </button>
        </div>
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
        <Button variant="primary" onClick={handleSubmit} disabled={!amount || numAmount <= 0 || insufficient} className="flex-1">
          Deposit
        </Button>
      </div>
    </div>
  );
}
