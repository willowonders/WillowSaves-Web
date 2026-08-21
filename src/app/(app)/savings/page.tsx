'use client';

import { useState, useMemo } from 'react';
import { useAllowances, useSavings, useBank, useGcash, useExpenses, useUndo } from '@/lib/store';
import { formatCurrency, getMonthName, cn } from '@/lib/utils';
import { AllowanceCard } from '@/components/allowance/AllowanceCard';
import { AllowanceForm } from '@/components/forms/AllowanceForm';
import { UndoToast } from '@/components/ui/UndoToast';

import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFab } from '@/lib/fab-context';
import { Allowance } from '@/types';

export default function SavingsPage() {
  const { allowances, totalSaved, addAllowance, updateAllowance, deleteAllowance } = useAllowances();
  const { expenses } = useExpenses();
  const { savings } = useSavings();
  const { transactions: bankTransactions } = useBank();
  const { transactions: gcashTransactions } = useGcash();
  const { activeModal, closeModal, openModal } = useFab();
  const { pendingItem, queueUndo, dismissUndo } = useUndo();
  const [analyticsView, setAnalyticsView] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<any>(null);

  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const savingsRate = totalSaved > 0 ? Math.max(0, (savings / totalSaved) * 100) : 0;

  const filteredAllowances = allowances.filter(a => {
    const d = new Date(a.date + 'T00:00:00Z');
    if (analyticsView === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }
    if (analyticsView === 'yearly') {
      return d.getUTCFullYear() === selectedYear;
    }
    return d.getUTCMonth() === selectedMonth && d.getUTCFullYear() === selectedYear;
  });

  const allBankTx = [...bankTransactions, ...gcashTransactions];
  const filteredBankTx = allBankTx.filter(t => {
    const d = new Date(t.date + 'T00:00:00Z');
    if (analyticsView === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }
    if (analyticsView === 'yearly') {
      return d.getUTCFullYear() === selectedYear;
    }
    return d.getUTCMonth() === selectedMonth && d.getUTCFullYear() === selectedYear;
  });

  const handleDeleteAllowance = (id: string) => {
    const allowance = allowances.find(a => a.id === id);
    if (allowance) {
      queueUndo({ type: 'allowance', data: allowance });
      deleteAllowance(id);
    }
  };

  const handleUndo = () => {
    if (!pendingItem) return;
    if (pendingItem.type === 'allowance') {
      const a = pendingItem.data as Allowance;
      addAllowance(a.amount, a.label, a.date);
    }
    dismissUndo();
  };

  const months = Array.from({ length: 12 }, (_, i) => getMonthName(i));
  const years = [selectedYear - 1, selectedYear, selectedYear + 1];

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#F2F3F5] via-[#E8F5E0] to-[#F2F3F5] dark:from-canvas-dark dark:via-canvas-dark-elevated dark:to-canvas-dark rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-shade-50 mb-1">My Savings</p>
            <p className="text-4xl font-heading font-light text-ink dark:text-ink-dark tabular-nums">{formatCurrency(savings)}</p>
            <p className="text-sm font-medium text-shade-50 mt-2">Remaining after expenses and deposits</p>
          </div>
          <img 
            src="/hero-mascot.png" 
            alt="Mascot" 
            className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
          />
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-canvas-dark-elevated rounded-full p-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {(['weekly', 'monthly', 'yearly'] as const).map(v => (
              <button
                key={v}
                onClick={() => setAnalyticsView(v)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize cursor-pointer',
                  analyticsView === v ? 'bg-primary text-on-primary shadow-sm' : 'text-shade-50'
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {(analyticsView === 'monthly' || analyticsView === 'yearly') && (
            <div className="relative">
              <button
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-canvas-dark-elevated rounded-full text-xs font-semibold text-ink dark:text-ink-dark shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer"
              >
                {analyticsView === 'monthly' ? `${months[selectedMonth]} ${selectedYear}` : selectedYear}
                <ChevronDown size={12} />
              </button>

              <AnimatePresence>
                {showMonthPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="relative lg:absolute lg:top-full lg:left-0 mt-2 bg-white dark:bg-canvas-dark-elevated rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-hairline-light dark:border-hairline-dark p-3 z-50 w-full lg:w-56"
                  >
                    {analyticsView === 'monthly' && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wider text-shade-400 font-bold mb-2">Month</p>
                        <div className="grid grid-cols-4 gap-1">
                          {months.map((m, i) => (
                            <button key={i} onClick={() => setSelectedMonth(i)} className={cn('px-2 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer', selectedMonth === i ? 'bg-primary text-on-primary' : 'text-shade-60 hover:bg-shade-20/50')}>{m}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-shade-400 font-bold mb-2">Year</p>
                      <div className="flex gap-1">
                        {years.map(y => (
                          <button key={y} onClick={() => setSelectedYear(y)} className={cn('flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer', selectedYear === y ? 'bg-primary text-on-primary' : 'text-shade-60 hover:bg-shade-20/50')}>{y}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Period Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-shade-50 mb-1">
            {analyticsView === 'weekly' ? 'This Week' : analyticsView === 'yearly' ? selectedYear : `${months[selectedMonth]} ${selectedYear}`}
          </p>
          <p className="text-2xl font-heading font-bold text-primary tabular-nums">
            {formatCurrency(filteredAllowances.reduce((s, a) => s + a.amount, 0))}
          </p>
          <p className="text-[11px] text-shade-40 mt-1">Allowance received</p>
        </div>
        <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-shade-50 mb-1">Savings Rate</p>
          <p className="text-2xl font-heading font-bold text-primary tabular-nums">{savingsRate.toFixed(0)}%</p>
          <p className="text-[11px] text-shade-40 mt-1">Of allowance saved</p>
        </div>
      </div>

      {/* Allowance History */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-6">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">Allowance History</h3>
        <p className="text-[11px] text-shade-400 mb-4">All recorded allowance amounts</p>

        {filteredAllowances.length === 0 ? (
          <div className="py-8 text-center text-sm text-shade-40">
            No allowance for this period. Use the + button to add one!
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAllowances.map(allowance => (
              <AllowanceCard key={allowance.id} allowance={allowance} onEdit={(a) => setEditingAllowance(a)} onDelete={handleDeleteAllowance} />
            ))}
          </div>
        )}
      </div>

      {/* Bank Transactions */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">Bank Transactions</h3>
        <p className="text-[11px] text-shade-400 mb-4">Deposits and withdrawals from bank</p>

        {filteredBankTx.length === 0 ? (
          <div className="py-8 text-center text-sm text-shade-40">
            No bank transactions for this period.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBankTx.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-hairline-light dark:border-hairline-dark last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', tx.type === 'deposit' ? 'bg-primary-subtle' : 'bg-danger-soft')}>
                    <span className={cn('text-xs font-bold', tx.type === 'deposit' ? 'text-primary' : 'text-danger')}>
                      {tx.type === 'deposit' ? 'D' : 'W'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink dark:text-ink-dark">{tx.note || (tx.type === 'deposit' ? 'Deposit' : 'Withdrawal')}</p>
                    <p className="text-[11px] text-shade-40">{tx.date} {tx.account === 'gcash' ? '(GCASH)' : ''}</p>
                  </div>
                </div>
                <p className={cn('text-sm font-bold tabular-nums', tx.type === 'deposit' ? 'text-danger' : 'text-primary')}>
                  {tx.type === 'deposit' ? '-' : '+'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Allowance Modal */}
      <AnimatePresence>
        {editingAllowance && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-canvas-dark-elevated rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-lg font-heading font-bold text-ink dark:text-ink-dark mb-4">Edit Allowance</h2>
              <AllowanceForm editingAllowance={editingAllowance} onSave={(amount, label, date) => { updateAllowance({ ...editingAllowance, amount, label, date }); setEditingAllowance(null); }} onClose={() => setEditingAllowance(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UndoToast pendingItem={pendingItem} onUndo={handleUndo} onDismiss={dismissUndo} />
    </div>
  );
}
