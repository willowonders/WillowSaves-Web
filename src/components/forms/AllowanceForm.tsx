'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ALLOWANCE_PRESETS } from '@/utils/constants';
import { Allowance } from '@/types';
import { cn } from '@/lib/utils';

interface AllowanceFormProps {
  editingAllowance?: Allowance | null;
  onSave: (amount: number, label: string, date: string) => void;
  onClose: () => void;
}

export function AllowanceForm({ editingAllowance, onSave, onClose }: AllowanceFormProps) {
  const [amount, setAmount] = useState(editingAllowance?.amount?.toString() || '');
  const [label, setLabel] = useState(editingAllowance?.label || '');
  const [date, setDate] = useState(editingAllowance?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !label.trim()) return;
    onSave(numAmount, label.trim(), date);
  };

  const handlePreset = (presetAmount: number, presetLabel: string) => {
    setAmount(presetAmount.toString());
    setLabel(presetLabel);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Quick Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {ALLOWANCE_PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.amount, preset.label)}
              className="px-3 py-2 rounded-xl border-2 border-hairline-light dark:border-hairline-dark text-left hover:border-primary hover:bg-primary-subtle transition-all cursor-pointer"
            >
              <p className="text-xs font-semibold text-ink dark:text-ink-dark">{preset.label}</p>
              <p className="text-sm font-bold text-primary">₱{preset.amount.toLocaleString()}</p>
            </button>
          ))}
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
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Label</label>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Daily Allowance"
          className="w-full px-4 py-3 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark text-base focus:outline-none focus:border-primary transition-colors"
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

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!amount || !label.trim()} className="flex-1">
          {editingAllowance ? 'Update' : 'Add Allowance'}
        </Button>
      </div>
    </div>
  );
}
