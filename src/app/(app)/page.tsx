'use client';

import { useExpenses, useBank, useAllowances, useSavings, useGcash } from '@/lib/store';
import { formatCurrency, getMonthName, cn, calculateStats } from '@/lib/utils';
import { SavingsChart } from '@/components/dashboard/SavingsChart';
import { ExpensesTrendChart } from '@/components/dashboard/ExpensesTrendChart';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Banknote } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const { expenses } = useExpenses();
  const { balance, transactions: bankTx } = useBank();
  const { balance: gcashBalance, transactions: gcashTx } = useGcash();
  const { totalSaved, allowances } = useAllowances();
  const { totalDeposited, totalWithdrawn } = useSavings();

  const stats = calculateStats(expenses, totalSaved, totalDeposited, totalWithdrawn);
  const savingsRate = stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalSpent) / stats.totalIncome) * 100 : 0;

  const [analyticsView, setAnalyticsView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const now = new Date();
  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.date + 'T00:00:00Z');
    if (analyticsView === 'daily') {
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return d >= monday && d <= sunday;
    }
    if (analyticsView === 'weekly') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return d >= firstDay && d <= lastDay;
    }
    if (analyticsView === 'monthly') {
      return d.getUTCMonth() === selectedMonth && d.getUTCFullYear() === selectedYear;
    }
    if (analyticsView === 'yearly') {
      return d.getUTCFullYear() === selectedYear;
    }
    return true;
  });

  const filteredStats = calculateStats(filteredExpenses, totalSaved, totalDeposited, totalWithdrawn);
  const months = Array.from({ length: 12 }, (_, i) => getMonthName(i));
  const years = [selectedYear - 1, selectedYear, selectedYear + 1];

  const recentExpenses = expenses.slice(0, 5);
  const recentAllowances = allowances.slice(0, 5);
  const recentBankTx = [...bankTx, ...gcashTx].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#F2F3F5] via-[#E8F5E0] to-[#F2F3F5] dark:from-canvas-dark dark:via-canvas-dark-elevated dark:to-canvas-dark rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex items-center gap-4">
          <img 
            src="/hero-mascot.png" 
            alt="Mascot" 
            className="w-34 h-34 rounded-2xl object-cover flex-shrink-0"
          />
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink dark:text-ink-dark">
              Welcome Back!
            </h1>
            <p className="text-sm text-shade-50 mt-1">
              Great to see you again! Your savings rate is{' '}
              <span className="font-bold text-primary">{savingsRate.toFixed(0)}%</span> this month.
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Remaining</p>
          <p className="text-3xl font-heading font-bold text-ink dark:text-ink-dark tabular-nums">{formatCurrency(stats.remaining)}</p>
          <p className="text-sm text-shade-40 mt-1">Allowance minus expenses and deposits</p>
        </div>
        <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">Bank Balance</p>
          <p className="text-3xl font-heading font-bold text-ink dark:text-ink-dark tabular-nums">{formatCurrency(balance)}</p>
          <p className="text-sm text-shade-40 mt-1">Available in bank</p>
        </div>
        <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-shade-50 mb-2">GCASH Balance</p>
          <p className="text-3xl font-heading font-bold text-ink dark:text-ink-dark tabular-nums">{formatCurrency(gcashBalance)}</p>
          <p className="text-sm text-shade-40 mt-1">Available in GCASH</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-heading font-bold text-ink dark:text-ink-dark">Statistics</h2>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-shade-20/40 dark:bg-shade-70/40 rounded-full p-0.5">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setAnalyticsView(v)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize cursor-pointer',
                    analyticsView === v
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-shade-50'
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
                  className="flex items-center gap-1.5 px-3 py-1 bg-shade-20/40 dark:bg-shade-70/40 rounded-full text-xs font-semibold text-ink dark:text-ink-dark cursor-pointer"
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
                      className="absolute right-0 top-full mt-2 bg-white dark:bg-canvas-dark-elevated rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-hairline-light dark:border-hairline-dark p-3 z-50 w-56"
                    >
                      {analyticsView === 'monthly' && (
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-shade-20/20 dark:bg-shade-70/20 rounded-xl p-3">
            <p className="text-[11px] text-shade-50 font-semibold uppercase tracking-wider">Spent</p>
            <p className="text-xl font-heading font-bold text-danger tabular-nums mt-1">{formatCurrency(filteredStats.totalSpent)}</p>
          </div>
          <div className="bg-shade-20/20 dark:bg-shade-70/20 rounded-xl p-3">
            <p className="text-[11px] text-shade-50 font-semibold uppercase tracking-wider">Savings Rate</p>
            <p className="text-xl font-heading font-bold text-primary tabular-nums mt-1">{filteredStats.savingsRate.toFixed(0)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SavingsChart view={analyticsView} selectedMonth={selectedMonth} selectedYear={selectedYear} />
          <ExpensesTrendChart expenses={filteredExpenses} view={analyticsView} selectedMonth={selectedMonth} selectedYear={selectedYear} />
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-6">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">Recent Expenses</h3>
        <p className="text-[11px] text-shade-400 mb-4">Your latest spending</p>
        {recentExpenses.length === 0 ? (
          <p className="text-sm text-shade-40 text-center py-4">No expenses yet</p>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-hairline-light dark:border-hairline-dark last:border-0">
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-ink-dark capitalize">{e.category}</p>
                  <p className="text-[11px] text-shade-40">{e.date}{e.notes ? ` - ${e.notes}` : ''}</p>
                </div>
                <p className="text-sm font-bold text-danger tabular-nums">{formatCurrency(e.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Allowances */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-6">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">Recent Allowances</h3>
        <p className="text-[11px] text-shade-400 mb-4">Your latest allowance records</p>
        {recentAllowances.length === 0 ? (
          <p className="text-sm text-shade-40 text-center py-4">No allowances yet</p>
        ) : (
          <div className="space-y-2">
            {recentAllowances.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-hairline-light dark:border-hairline-dark last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center">
                    <Banknote size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink dark:text-ink-dark">{a.label}</p>
                    <p className="text-[11px] text-shade-40">{a.date}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-primary tabular-nums">+{formatCurrency(a.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bank Transactions */}
      <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 mb-6">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">Recent Bank Transactions</h3>
        <p className="text-[11px] text-shade-400 mb-4">Deposits and withdrawals</p>
        {recentBankTx.length === 0 ? (
          <p className="text-sm text-shade-40 text-center py-4">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {recentBankTx.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-hairline-light dark:border-hairline-dark last:border-0">
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-ink-dark">{tx.note || (tx.type === 'deposit' ? 'Deposit' : 'Withdrawal')}</p>
                  <p className="text-[11px] text-shade-40">{tx.date} {tx.account === 'gcash' ? '(GCASH)' : ''}</p>
                </div>
                <p className={cn('text-sm font-bold tabular-nums', tx.type === 'deposit' ? 'text-danger' : 'text-primary')}>
                  {tx.type === 'deposit' ? '-' : '+'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
