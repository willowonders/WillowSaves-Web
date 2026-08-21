import { CATEGORIES, MOTIVATIONAL_MESSAGES } from '@/utils/constants';
import {
  Apple, Bus, ShoppingBag, Receipt, Film, HeartPulse, GraduationCap, Package, MoreHorizontal,
} from 'lucide-react';
import { ComponentType, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const categoryIconMap: Record<string, ComponentType<IconProps>> = {
  apple: Apple,
  bus: Bus,
  'shopping-bag': ShoppingBag,
  receipt: Receipt,
  film: Film,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'more-horizontal': MoreHorizontal,
  other: Package,
};

export function getCategoryIcon(iconId: string) {
  return categoryIconMap[iconId] || Package;
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return '₱' + Math.abs(amount).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1000000) {
    return '₱' + (amount / 1000000).toFixed(1) + 'M';
  }
  if (Math.abs(amount) >= 1000) {
    return '₱' + (amount / 1000).toFixed(1) + 'k';
  }
  return formatCurrency(amount);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getPhilippineDate(): string {
  const now = new Date();
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8.toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDateFull(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function getMonthName(month: number): string {
  return new Date(2024, month, 1).toLocaleDateString('en-US', { month: 'short' });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isSameMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.getUTCFullYear() === year && d.getUTCMonth() === month;
}

export function isSameYear(dateStr: string, year: number): boolean {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.getUTCFullYear() === year;
}

export function getRandomMessage(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}

export function getCategoryById(id: string) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function filterByMonth<T extends { date: string }>(items: T[], month: number | null): T[] {
  if (month === null) return items;
  const year = new Date().getFullYear();
  return items.filter(item => {
    const d = new Date(item.date + 'T00:00:00Z');
    return d.getUTCMonth() === month && d.getUTCFullYear() === year;
  });
}

export function filterByYear<T extends { date: string }>(items: T[], year: number | null): T[] {
  if (year === null) return items;
  return items.filter(item => {
    const d = new Date(item.date + 'T00:00:00Z');
    return d.getUTCFullYear() === year;
  });
}

interface StatsResult {
  totalSpent: number;
  totalIncome: number;
  remaining: number;
  savingsRate: number;
}

export function calculateStats(expenses: { amount: number; source?: string }[], totalSaved: number, totalDeposited: number = 0, totalWithdrawn: number = 0): StatsResult {
  const totalSpent = expenses.filter(e => !e.source || e.source === 'allowance').reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalSaved - totalSpent - totalDeposited + totalWithdrawn;
  const savingsRate = totalSaved > 0 ? Math.max(0, (remaining / totalSaved) * 100) : 0;

  return { totalSpent, totalIncome: totalSaved, remaining, savingsRate };
}

interface AnalyticsResult {
  totalSpent: number;
  topCategories: { id: string; name: string; value: number; percentage: number; color: string }[];
}

export function calculateAnalytics(expenses: { amount: number; category: string }[]): AnalyticsResult {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

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

  const topCategories = Array.from(categoryMap.entries())
    .map(([id, value]) => ({
      id,
      name: categoryNames[id] || id,
      value,
      percentage: totalSpent > 0 ? (value / totalSpent) * 100 : 0,
      color: categoryColors[id] || '#7B7B8A',
    }))
    .sort((a, b) => b.value - a.value);

  return { totalSpent, topCategories };
}
