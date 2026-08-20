import { Expense, SavingsAnalytics } from '@/types';

export function calculateAnalytics(expenses: Expense[]) {
  const now = new Date();
  const today = getPhilippineDate();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const weeklyTotal = expenses
    .filter(e => new Date(e.date + 'T00:00:00Z') >= weekAgo)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyTotal = expenses
    .filter(e => new Date(e.date + 'T00:00:00Z') >= monthStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = new Map<string, number>();
  expenses.forEach(e => {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  });

  const categoryColors: Record<string, string> = {
    food: '#FF4B4B',
    transport: '#cccf18',
    shopping: '#ffae00',
    bills: '#FF9601',
    entertainment: '#1CB0F6',
    health: '#d30404',
    education: '#A855F7',
    other: '#7B7B8A',
  };

  const categoryNames: Record<string, string> = {
    food: 'Food',
    transport: 'Transport',
    shopping: 'Shopping',
    bills: 'Bills',
    entertainment: 'Entertainment',
    health: 'Health',
    education: 'Education',
    other: 'Other',
  };

  const categoryTotals = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name: categoryNames[name] || name,
    value,
    color: categoryColors[name] || '#7B7B8A',
  }));

  const dailyTrend: { date: string; amount: number }[] = [];
  const monthlyTotals: { month: string; amount: number }[] = [];

  return {
    totalSpent,
    weeklyTotal,
    monthlyTotal,
    categoryTotals,
    dailyTrend,
    monthlyTotals,
  };
}

function getPhilippineDate(): string {
  const now = new Date();
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8.toISOString().split('T')[0];
}

export function calculateSavingsAnalytics(expenses: Expense[], allowances: { amount: number; date: string }[]): SavingsAnalytics {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalAllowance = allowances.reduce((sum, a) => sum + a.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const currentSavings = totalAllowance - totalExpenses;
  const savingsRate = totalAllowance > 0 ? Math.max(0, (currentSavings / totalAllowance) * 100) : 0;

  const weeklyAllowance = allowances
    .filter(a => new Date(a.date + 'T00:00:00Z') >= weekAgo)
    .reduce((sum, a) => sum + a.amount, 0);

  const monthlyAllowance = allowances
    .filter(a => new Date(a.date + 'T00:00:00Z') >= monthStart)
    .reduce((sum, a) => sum + a.amount, 0);

  const weeklyExpenses = expenses
    .filter(e => new Date(e.date + 'T00:00:00Z') >= weekAgo)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyExpenses = expenses
    .filter(e => new Date(e.date + 'T00:00:00Z') >= monthStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const weeklySavings = weeklyAllowance - weeklyExpenses;
  const monthlySavings = monthlyAllowance - monthlyExpenses;

  return {
    totalAllowance,
    totalExpenses,
    currentSavings,
    savingsRate,
    weeklyAllowance,
    monthlyAllowance,
    weeklySavings,
    monthlySavings,
    trend: [],
  };
}
