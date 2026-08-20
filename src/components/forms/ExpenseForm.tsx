'use client';

import { useState } from 'react';
import { Expense } from '@/types';
import { CATEGORIES } from '@/utils/constants';
import { cn, getCategoryIcon } from '@/lib/utils';
import { Calendar, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseFormProps {
  editingExpense?: Expense | null;
  onSave: (amount: number, category: string, date: string, notes: string) => void;
  onClose: () => void;
}

export function ExpenseForm({ editingExpense, onSave, onClose }: ExpenseFormProps) {
  const [amount, setAmount] = useState(editingExpense?.amount.toString() || '');
  const [category, setCategory] = useState(editingExpense?.category || '');
  const [notes, setNotes] = useState(editingExpense?.notes || '');
  const [date, setDate] = useState(editingExpense?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    onSave(parseFloat(amount), category, date, notes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Amount */}
      <div>
        <label className="text-sm font-semibold text-ink dark:text-ink-dark mb-2 block">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-shade-40 text-sm font-semibold">₱</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-shade-20/40 dark:bg-shade-70/40 rounded-xl text-base font-semibold text-ink dark:text-ink-dark placeholder:text-shade-40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-semibold text-ink dark:text-ink-dark mb-2 block">Category</label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                  category === cat.id
                    ? 'bg-primary text-on-primary ring-2 ring-primary'
                    : 'bg-shade-20/40 dark:bg-shade-70/40 text-shade-60 dark:text-shade-40 hover:bg-shade-30/40'
                )}
              >
                <Icon size={18} className={category === cat.id ? 'text-on-primary' : ''} style={{ color: category !== cat.id ? cat.iconColor : undefined }} />
                <span className="truncate w-full text-center">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="text-sm font-semibold text-ink dark:text-ink-dark mb-2 block">Date</label>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-shade-40" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-shade-20/40 dark:bg-shade-700/40 rounded-xl text-base font-semibold text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
            required
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-semibold text-ink dark:text-ink-dark mb-2 block">Notes (Optional)</label>
        <div className="relative">
          <FileText size={16} className="absolute left-3 top-3 text-shade-40" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-shade-20/40 dark:bg-shade-700/40 rounded-xl text-base text-ink dark:text-ink-dark placeholder:text-shade-40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Add notes about this expense..."
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-shade-60 dark:text-shade-40 bg-shade-20/50 dark:bg-shade-700/50 hover:bg-shade-30/50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl text-sm font-bold text-on-primary bg-primary hover:bg-primary-dark transition-colors cursor-pointer"
        >
          {editingExpense ? 'Update' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
