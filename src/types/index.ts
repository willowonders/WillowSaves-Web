export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  createdAt: string;
  userId?: string;
}

export interface Allowance {
  id: string;
  amount: number;
  label: string;
  date: string;
  createdAt: string;
  linkedTransactionId?: string;
  userId?: string;
}

export interface BankTransaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  source?: 'savings' | 'other';
  account?: 'bank' | 'gcash';
  note: string;
  date: string;
  createdAt: string;
  userId?: string;
}

export interface BankState {
  balance: number;
  transactions: BankTransaction[];
}

export interface AppState {
  expenses: Expense[];
  allowances: Allowance[];
  bank: BankState;
  gcash: BankState;
}

export interface Analytics {
  totalSpent: number;
  weeklyTotal: number;
  monthlyTotal: number;
  categoryTotals: { name: string; value: number; color: string }[];
  dailyTrend: { date: string; amount: number }[];
  monthlyTotals: { month: string; amount: number }[];
}

export interface SavingsAnalytics {
  totalAllowance: number;
  totalExpenses: number;
  currentSavings: number;
  savingsRate: number;
  weeklyAllowance: number;
  monthlyAllowance: number;
  weeklySavings: number;
  monthlySavings: number;
  trend: { date: string; savings: number }[];
}

export interface Filters {
  category: string;
}

export interface PendingUndoItem {
  type: 'expense' | 'allowance' | 'bank';
  data: Expense | Allowance | BankTransaction;
  linkedBankTx?: BankTransaction;
}

export type PeriodView = 'daily' | 'monthly' | 'yearly';

export interface PeriodStats {
  label: string;
  spent: number;
  income: number;
  saved: number;
  savingsRate: number;
  vsPrevious: { spent: number; income: number; saved: number };
  timeSeriesData: { label: string; amount: number }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
}
