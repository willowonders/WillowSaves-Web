'use client';

import { useMemo } from 'react';
import { getMonthName } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAllowances } from '@/lib/store';

interface SavingsChartProps {
  view: 'daily' | 'weekly' | 'monthly' | 'yearly';
  selectedMonth?: number;
  selectedYear?: number;
}

export function SavingsChart({ view, selectedMonth, selectedYear }: SavingsChartProps) {
  const { allowances } = useAllowances();

  const chartData = useMemo(() => {
    const now = new Date();
    const sm = selectedMonth ?? now.getMonth();
    const sy = selectedYear ?? now.getFullYear();

    if (view === 'daily') {
      const dayOfWeek = now.getDay();
      const mondayOffset = (dayOfWeek + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - mondayOffset);
      monday.setHours(0, 0, 0, 0);

      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dayStr = d.toISOString().split('T')[0];
        const dayAllowances = allowances.filter(a => a.date === dayStr);
        const label = `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`;
        return { label, amount: dayAllowances.reduce((s, a) => s + a.amount, 0) };
      });
    }

    if (view === 'weekly') {
      const now2 = new Date();
      const firstDay = new Date(now2.getFullYear(), now2.getMonth(), 1);
      const lastDay = new Date(now2.getFullYear(), now2.getMonth() + 1, 0);
      const totalDays = lastDay.getDate();
      const weeksCount = Math.ceil(totalDays / 7);

      return Array.from({ length: weeksCount }, (_, i) => {
        const weekStart = new Date(firstDay);
        weekStart.setDate(firstDay.getDate() + i * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());

        const weekAllowances = allowances.filter(a => {
          const d = new Date(a.date + 'T00:00:00Z');
          return d >= weekStart && d <= weekEnd;
        });
        return {
          label: `W${i + 1}`,
          amount: weekAllowances.reduce((s, a) => s + a.amount, 0),
        };
      });
    }

    if (view === 'monthly') {
      return Array.from({ length: 12 }, (_, i) => {
        const monthAllowances = allowances.filter(a => {
          const d = new Date(a.date + 'T00:00:00Z');
          return d.getUTCMonth() === i && d.getUTCFullYear() === sy;
        });
        return {
          label: getMonthName(i).substring(0, 3).toUpperCase(),
          amount: monthAllowances.reduce((s, a) => s + a.amount, 0),
        };
      });
    }

    // yearly - show last 6 years
    return Array.from({ length: 6 }, (_, i) => {
      const year = sy - 5 + i;
      const yearAllowances = allowances.filter(a => {
        const d = new Date(a.date + 'T00:00:00Z');
        return d.getUTCFullYear() === year;
      });
      return {
        label: String(year),
        amount: yearAllowances.reduce((s, a) => s + a.amount, 0),
      };
    });
  }, [allowances, view, selectedMonth, selectedYear]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center">
          <BarChart3 size={14} className="text-primary" />
        </div>
        <p className="text-xs font-bold text-shade-60 uppercase tracking-wider">Savings Trend</p>
      </div>

      <div className="h-48 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E4EC" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#7B7B8A' }} axisLine={false} tickLine={false} interval={0} angle={view === 'monthly' ? -45 : 0} textAnchor={view === 'monthly' ? 'end' : 'middle'} height={view === 'monthly' ? 50 : 30} />
            <YAxis tick={{ fontSize: 11, fill: '#7B7B8A' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #ECECF3', borderRadius: '12px', fontSize: '12px' }} formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Allowance']} />
            <Bar dataKey="amount" fill="#2E8540" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
