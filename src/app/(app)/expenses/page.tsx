'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { UndoToast } from '@/components/ui/UndoToast';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseForm } from '@/components/forms/ExpenseForm';

import { useExpensesStore, useUndo } from '@/lib/store';
import { useFab } from '@/lib/fab-context';
import { calculateAnalytics } from '@/lib/analytics';
import { formatCurrency, cn, getMonthName } from '@/lib/utils';
import { CATEGORIES } from '@/utils/constants';
import { Expense } from '@/types';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpensesStore();
  const { pendingItem, queueUndo, dismissUndo } = useUndo();
  const { activeModal, closeModal } = useFab();
  const analytics = useMemo(() => calculateAnalytics(expenses), [expenses]);

  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [historyView, setHistoryView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    if (activeModal === 'expense') {
      setShowForm(true);
      closeModal();
    }
  }, [activeModal, closeModal]);

  const now = new Date();

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (categoryFilter) result = result.filter(e => e.category === categoryFilter);

    if (historyView === 'daily') {
      const dayOfWeek = now.getDay();
      const mondayOffset = (dayOfWeek + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      result = result.filter(e => {
        const d = new Date(e.date + 'T00:00:00Z');
        return d >= monday && d <= sunday;
      });
    } else if (historyView === 'weekly') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      result = result.filter(e => {
        const d = new Date(e.date + 'T00:00:00Z');
        return d >= firstDay && d <= lastDay;
      });
    } else if (historyView === 'monthly') {
      result = result.filter(e => {
        const d = new Date(e.date + 'T00:00:00Z');
        return d.getUTCMonth() === selectedMonth && d.getUTCFullYear() === selectedYear;
      });
    } else if (historyView === 'yearly') {
      result = result.filter(e => {
        const d = new Date(e.date + 'T00:00:00Z');
        return d.getUTCFullYear() === selectedYear;
      });
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, categoryFilter, historyView, selectedMonth, selectedYear]);

  const handleSave = useCallback((amount: number, category: string, date: string, notes: string) => {
    if (editing) updateExpense({ ...editing, amount, category, date, notes });
    else addExpense(amount, category, date, notes);
    setEditing(null);
    setShowForm(false);
  }, [editing, addExpense, updateExpense]);

  const handleDelete = useCallback((id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) { queueUndo({ type: 'expense', data: expense }); deleteExpense(id); }
  }, [expenses, queueUndo, deleteExpense]);

  const isFormOpen = showForm || editing !== null;
  const months = Array.from({ length: 12 }, (_, i) => getMonthName(i));
  const years = [selectedYear - 1, selectedYear, selectedYear + 1];

  const getDateLabel = () => {
    if (historyView === 'daily') return 'This Week';
    if (historyView === 'weekly') return `${getMonthName(now.getMonth())} ${now.getFullYear()}`;
    if (historyView === 'yearly') return `${selectedYear}`;
    return `${getMonthName(selectedMonth)} ${selectedYear}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#F2F3F5] via-[#E8F5E0] to-[#F2F3F5] dark:from-canvas-dark dark:via-canvas-dark-elevated dark:to-canvas-dark rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-shade-50 mb-1">Total Spending</p>
            <p className="text-4xl font-heading font-light text-ink dark:text-ink-dark tabular-nums">{formatCurrency(analytics.totalSpent)}</p>
            <p className="text-sm font-medium text-shade-50 mt-2">{expenses.length} expense{expenses.length !== 1 ? 's' : ''} recorded</p>
          </div>
          <img 
            src="/hero-mascot.png" 
            alt="Mascot" 
            className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
          />
        </div>
      </div>

      {/* History Period Toggle + Date Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-1 bg-white dark:bg-canvas-dark-elevated rounded-full p-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(v => (
            <button
              key={v}
              onClick={() => setHistoryView(v)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize cursor-pointer',
                historyView === v ? 'bg-primary text-on-primary shadow-sm' : 'text-shade-50'
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {(historyView === 'monthly' || historyView === 'yearly') && (
          <div className="relative">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-canvas-dark-elevated rounded-full text-xs font-semibold text-ink dark:text-ink-dark shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer"
            >
              {getDateLabel()}
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {showMonthPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 top-full mt-2 bg-white dark:bg-canvas-dark-elevated rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-hairline-light dark:border-hairline-dark p-3 z-50 w-56"
                >
                  {historyView === 'monthly' && (
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider text-shade-400 font-bold mb-2">Month</p>
                      <div className="grid grid-cols-4 gap-1">
                        {months.map((m, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedMonth(i)}
                            className={cn(
                              'px-2 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer',
                              selectedMonth === i ? 'bg-primary text-on-primary' : 'text-shade-60 hover:bg-shade-20/50'
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-shade-400 font-bold mb-2">Year</p>
                    <div className="flex gap-1">
                      {years.map(y => (
                        <button
                          key={y}
                          onClick={() => setSelectedYear(y)}
                          className={cn(
                            'flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer',
                            selectedYear === y ? 'bg-primary text-on-primary' : 'text-shade-60 hover:bg-shade-20/50'
                          )}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {historyView === 'daily' && (
          <span className="text-xs text-shade-50 font-medium">{getDateLabel()}</span>
        )}

        {historyView === 'weekly' && (
          <span className="text-xs text-shade-50 font-medium">{getDateLabel()}</span>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar">
        <button onClick={() => setCategoryFilter('')} className={cn('px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border-2', !categoryFilter ? 'bg-primary text-on-primary border-primary' : 'border-hairline-light dark:border-hairline-dark text-shade-50 hover:border-shade-30')}>All</button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className={cn('px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border-2', categoryFilter === cat.id ? 'bg-primary text-on-primary border-primary' : 'border-hairline-light dark:border-hairline-dark text-shade-50 hover:border-shade-30')}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <Card variant="analytics">
        <h3 className="text-base font-semibold text-ink dark:text-ink-dark mb-1">Expenses</h3>
        <p className="text-[11px] text-shade-400 mb-4">{filteredExpenses.length} of {expenses.length} shown</p>
        <ExpenseList expenses={filteredExpenses} onEdit={(e) => { setEditing(e); }} onDelete={handleDelete} />
      </Card>

      {/* Expense Modal */}
      <Modal open={isFormOpen} onClose={() => { setEditing(null); setShowForm(false); }} title={editing ? 'Edit Expense' : 'New Expense'}>
        <ExpenseForm editingExpense={editing} onSave={handleSave} onClose={() => { setEditing(null); setShowForm(false); }} />
      </Modal>

      <UndoToast pendingItem={pendingItem} onUndo={() => {
        if (pendingItem?.type === 'expense') { const d = pendingItem.data as Expense; addExpense(d.amount, d.category, d.date, d.notes); }
        dismissUndo();
      }} onDismiss={dismissUndo} />
    </div>
  );
}
