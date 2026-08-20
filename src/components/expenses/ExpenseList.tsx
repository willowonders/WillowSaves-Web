'use client';

import { ExpenseCard } from './ExpenseCard';
import { Expense } from '@/types';
import { getRandomMessage } from '@/lib/utils';
import { Receipt } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary-subtle flex items-center justify-center">
          <Receipt size={28} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-shade-50">{getRandomMessage()}</p>
        <p className="text-xs text-shade-40 mt-1">No expenses yet. Tap + to add one!</p>
      </div>
    );
  }

  return (
    <div>
      {expenses.map(expense => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
